import { describe, expect, it } from "vitest";
import { getClientIp } from "@/lib/client-ip";

// The header precedence in getClientIp is a security property, so these are
// regression tests in the literal sense: the spoofing case below is the bug
// this function was rewritten to fix, and it is the one that must never come
// back. Everything else here exists to stop someone "simplifying" the
// precedence without noticing what it was for.

function headers(init: Record<string, string>): Headers {
  return new Headers(init);
}

describe("getClientIp", () => {
  it("prefers the Vercel-set header over everything else", () => {
    const ip = getClientIp(
      headers({
        "x-vercel-forwarded-for": "203.0.113.5",
        "x-real-ip": "198.51.100.9",
        "x-forwarded-for": "192.0.2.1",
      })
    );
    expect(ip).toBe("203.0.113.5");
  });

  it("falls back to x-real-ip when the Vercel header is absent", () => {
    const ip = getClientIp(
      headers({ "x-real-ip": "198.51.100.9", "x-forwarded-for": "192.0.2.1" })
    );
    expect(ip).toBe("198.51.100.9");
  });

  // ── The regression this function exists for ──────────────────────────
  // An attacker sends their own X-Forwarded-For; the proxy appends the real
  // client IP to the right of it. Reading the LEFTMOST entry hands back the
  // attacker-controlled value, so rotating that header gives a fresh
  // rate-limit bucket on every request and the limit stops existing.
  it("takes the rightmost x-forwarded-for hop, not the spoofable leftmost one", () => {
    const ip = getClientIp(
      headers({ "x-forwarded-for": "1.1.1.1, 2.2.2.2, 203.0.113.5" })
    );
    expect(ip).toBe("203.0.113.5");
    expect(ip).not.toBe("1.1.1.1");
  });

  it("gives one attacker rotating x-forwarded-for a single bucket, not many", () => {
    const spoofed = ["9.9.9.9", "8.8.8.8", "7.7.7.7"].map((claimed) =>
      getClientIp(headers({ "x-forwarded-for": `${claimed}, 203.0.113.5` }))
    );
    // All three resolve to the same real client, so they share a bucket.
    expect(new Set(spoofed).size).toBe(1);
    expect(spoofed[0]).toBe("203.0.113.5");
  });

  it("handles a single-hop x-forwarded-for", () => {
    expect(getClientIp(headers({ "x-forwarded-for": "203.0.113.5" }))).toBe(
      "203.0.113.5"
    );
  });

  it("trims surrounding whitespace", () => {
    expect(getClientIp(headers({ "x-real-ip": "  203.0.113.5  " }))).toBe(
      "203.0.113.5"
    );
    expect(
      getClientIp(headers({ "x-forwarded-for": "1.1.1.1,   203.0.113.5  " }))
    ).toBe("203.0.113.5");
  });

  // Fails closed: everything unidentifiable shares one bucket rather than
  // each getting its own.
  it("returns 'unknown' when no usable header is present", () => {
    expect(getClientIp(headers({}))).toBe("unknown");
  });

  it("treats a blank header value as absent rather than as an identifier", () => {
    expect(getClientIp(headers({ "x-real-ip": "   " }))).toBe("unknown");
    expect(
      getClientIp(headers({ "x-real-ip": "  ", "x-forwarded-for": "203.0.113.5" }))
    ).toBe("203.0.113.5");
  });
});
