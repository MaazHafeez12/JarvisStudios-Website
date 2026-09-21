import type { NextConfig } from "next";

// Security response headers applied to every route, per docs/TRD.md §8.1
// and docs/SECURITY_AUDIT.md finding #4. Centralized here so no individual
// page/route has to remember to set them.
// Next.js dev mode (React Fast Refresh / Turbopack debugging) requires
// `eval()`, which production React never uses — so `unsafe-eval` is added
// to script-src only outside production, keeping the production CSP strict.
const isDev = process.env.NODE_ENV !== "production";

const securityHeaders = [
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data:",
      "font-src 'self' data:",
      "connect-src 'self'",
      "frame-ancestors 'none'",
      // The three directives below do NOT fall back to default-src, which is
      // why a policy can look locked down and still leave them open.
      //
      // base-uri: a <base href> injected into the document silently re-points
      // every relative URL on the page — including the script the page is
      // about to load. default-src does not cover it; 'none' forbids <base>
      // outright, and this site has no <base> tag to lose.
      //
      // form-action: restricts where a form may POST. The contact form
      // submits over fetch, so this is not the path it normally takes — it
      // closes the case where an injected <form> is aimed at another origin.
      //
      // object-src: <object>/<embed>/<applet>, a legacy script-execution
      // vector. Nothing on the site uses them.
      "base-uri 'none'",
      "form-action 'self'",
      "object-src 'none'",
    ].join("; "),
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
