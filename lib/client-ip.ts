// Identifier for the rate limiter (app/api/leads/route.ts).
//
// Lives here rather than inside the route handler for two reasons: a Next
// route file's exports are a contract with the framework and shouldn't carry
// helpers, and this is security-relevant logic that needs to be testable
// without standing up a request.
//
// THE HEADER ORDER IS A SECURITY PROPERTY, not a preference.
//
// This used to read the first entry of `x-forwarded-for` and only consult
// `x-real-ip` when XFF was absent — which, behind Vercel, is never. XFF is a
// client-supplied header that proxies append to: the leftmost entry is
// whatever the original caller claimed, so anyone willing to send
// `X-Forwarded-For: <random>` on each request gets a fresh rate-limit bucket
// every time and the 5-per-hour limit stops existing. Reading the *first*
// entry of an append-only header is the classic form of this bug.
//
// The fix is to prefer headers the platform sets itself and the client cannot
// forge:
//   1. x-vercel-forwarded-for — written by Vercel's edge, not forwardable.
//   2. x-real-ip — also platform-set on Vercel.
//   3. x-forwarded-for — last resort, for running behind something else. The
//      RIGHTMOST entry is taken, not the leftmost: each hop appends, so the
//      last one was written by the proxy nearest us, which is the closest
//      thing to trustworthy in the chain.
//
// A request with none of these shares the "unknown" bucket. That fails
// closed — everything unidentifiable is limited together — which is the
// right direction for this to err in.

/** Takes `Headers` rather than the request, so it is trivial to test. */
export function getClientIp(headers: Headers): string {
  const trusted =
    headers.get("x-vercel-forwarded-for") ?? headers.get("x-real-ip");
  if (trusted?.trim()) return trusted.trim();

  const forwardedFor = headers.get("x-forwarded-for");
  if (forwardedFor?.trim()) {
    const hops = forwardedFor.split(",");
    return hops[hops.length - 1].trim();
  }

  return "unknown";
}
