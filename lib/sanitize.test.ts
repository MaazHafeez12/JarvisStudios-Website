import { describe, expect, it } from "vitest";
import { escapeHtml, escapeSlackMrkdwn } from "@/lib/sanitize";

// These two functions are the only thing standing between a lead's free text
// and two channels the team reads and trusts (docs/SECURITY_AUDIT.md finding
// #3). The `message` field is up to 5000 characters of anything an anonymous
// visitor cares to type, so the attack cases below are the point of the file
// — the character-by-character assertions exist to stop someone reordering
// the replaces and breaking the ampersand rule without noticing.

describe("escapeHtml", () => {
  it("escapes every character that carries meaning in HTML", () => {
    expect(escapeHtml("&")).toBe("&amp;");
    expect(escapeHtml("<")).toBe("&lt;");
    expect(escapeHtml(">")).toBe("&gt;");
    expect(escapeHtml('"')).toBe("&quot;");
    expect(escapeHtml("'")).toBe("&#39;");
  });

  // ORDERING. The ampersand must be replaced first, or the `&` introduced by
  // a later replacement gets escaped again and `<` renders as the literal
  // text "&lt;" in the email instead of as a less-than sign.
  it("escapes ampersands first, so nothing is double-escaped", () => {
    expect(escapeHtml("<")).toBe("&lt;");
    expect(escapeHtml("<")).not.toBe("&amp;lt;");
  });

  it("preserves text that already looks like an entity", () => {
    expect(escapeHtml("&lt;")).toBe("&amp;lt;");
  });

  it("neutralises a script tag in the message body", () => {
    expect(escapeHtml("<script>alert(1)</script>")).toBe(
      "&lt;script&gt;alert(1)&lt;/script&gt;"
    );
  });

  // The realistic attack: the notification email is HTML, so an unescaped
  // anchor is a phishing link inside a message the team already trusts.
  it("neutralises an injected phishing link", () => {
    const injected = '<a href="https://evil.example">Click here</a>';
    const escaped = escapeHtml(injected);
    expect(escaped).not.toContain("<a");
    expect(escaped).not.toContain('href="');
    expect(escaped).toContain("&lt;a href=&quot;https://evil.example&quot;&gt;");
  });

  it("neutralises an attribute-breaking payload", () => {
    expect(escapeHtml('" onmouseover="alert(1)')).toBe(
      "&quot; onmouseover=&quot;alert(1)"
    );
  });

  it("leaves ordinary text untouched", () => {
    const plain = "We need a booking system by March. Budget is around 5k.";
    expect(escapeHtml(plain)).toBe(plain);
  });

  it("handles an empty string", () => {
    expect(escapeHtml("")).toBe("");
  });
});

describe("escapeSlackMrkdwn", () => {
  // Slack's own escaping rules cover exactly &, < and > — quotes and
  // apostrophes are not special in mrkdwn, so escaping them would show
  // literal &quot; in the message rather than protect anything.
  it("escapes the three characters Slack treats as special", () => {
    expect(escapeSlackMrkdwn("&")).toBe("&amp;");
    expect(escapeSlackMrkdwn("<")).toBe("&lt;");
    expect(escapeSlackMrkdwn(">")).toBe("&gt;");
  });

  it("leaves quotes and apostrophes alone", () => {
    expect(escapeSlackMrkdwn(`"it's fine"`)).toBe(`"it's fine"`);
  });

  it("escapes ampersands first, so nothing is double-escaped", () => {
    expect(escapeSlackMrkdwn("<")).not.toBe("&amp;lt;");
  });

  // The realistic attack: Slack renders <url|label> as a link whose visible
  // text is arbitrary, so an unescaped message can forge a trustworthy-
  // looking link into the team's channel.
  it("neutralises Slack link syntax", () => {
    const escaped = escapeSlackMrkdwn(
      "<https://evil.example|Open the client portal>"
    );
    expect(escaped).toBe(
      "&lt;https://evil.example|Open the client portal&gt;"
    );
    expect(escaped).not.toContain("<https://");
  });

  // <!channel> and <!here> are broadcast pings. Escaped, they render as text.
  it("neutralises a channel-wide mention", () => {
    expect(escapeSlackMrkdwn("<!channel>")).toBe("&lt;!channel&gt;");
    expect(escapeSlackMrkdwn("<!here>")).toBe("&lt;!here&gt;");
  });

  it("leaves ordinary text untouched", () => {
    const plain = "Looking for a CRM migration, roughly 40 users.";
    expect(escapeSlackMrkdwn(plain)).toBe(plain);
  });
});
