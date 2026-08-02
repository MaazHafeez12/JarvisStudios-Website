import "server-only";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Upstash Redis-backed rate limiting for /api/leads — NOT an in-memory
// counter. Route Handlers are stateless serverless functions; an in-memory
// counter would not reliably persist across invocations/instances and
// would not actually enforce a limit in production. See
// docs/SECURITY_AUDIT.md finding #1 and docs/ARCHITECTURE.md §4.8.
//
// Limit: 5 submissions per IP per hour (docs/TRD.md §7).

let ratelimit: Ratelimit | null = null;

function getRatelimit(): Ratelimit {
  if (ratelimit) return ratelimit;

  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    throw new Error(
      "Rate limiting is not configured: UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN must be set."
    );
  }

  ratelimit = new Ratelimit({
    redis: new Redis({ url, token }),
    limiter: Ratelimit.slidingWindow(5, "1 h"),
    prefix: "ratelimit:leads",
  });

  return ratelimit;
}

export interface RateLimitResult {
  success: boolean;
  remaining: number;
}

/** @param identifier Typically the requester's IP address. */
export async function checkRateLimit(identifier: string): Promise<RateLimitResult> {
  const limiter = getRatelimit();
  const { success, remaining } = await limiter.limit(identifier);
  return { success, remaining };
}
