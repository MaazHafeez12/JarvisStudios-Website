"use client";

import { useEffect } from "react";

// Last-resort boundary, for an error thrown by app/layout.tsx itself. When
// the root layout is what failed, app/error.tsx cannot help — it renders
// *inside* that layout. So this one replaces the entire document and must
// supply its own <html> and <body>.
//
// That constraint is why this file looks so much plainer than app/error.tsx:
// it cannot use Nav, Footer, or the theme, because the thing that provides
// all three is what just broke. It also cannot rely on globals.css having
// applied, so the few colours it needs are inline and hardcoded to the dark
// theme's tokens (neutral-950 ground, neutral-0 text, brand-500 accent) —
// duplication that is justified here precisely because the token layer is
// exactly what is unavailable.
//
// This should effectively never render. Its job is to make the failure that
// does reach it legible rather than a blank white screen.

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[app/global-error] root layout error:", error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "1rem",
          padding: "2rem",
          textAlign: "center",
          backgroundColor: "#141414",
          color: "#FFFFFF",
          fontFamily:
            "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
        }}
      >
        <h1 style={{ margin: 0, fontSize: "1.5rem", fontWeight: 600 }}>
          Something broke on our end.
        </h1>
        <p style={{ margin: 0, color: "#8A8A8A", maxWidth: "32rem" }}>
          This page failed to load. Try again, or head back to the homepage.
        </p>
        <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.5rem" }}>
          <button
            type="button"
            onClick={reset}
            style={{
              cursor: "pointer",
              border: "none",
              borderRadius: "0.375rem",
              padding: "0.75rem 1.5rem",
              fontSize: "0.875rem",
              fontWeight: 500,
              backgroundColor: "#00ADEF",
              color: "#141414",
            }}
          >
            Try again
          </button>
          {/* A plain <a>, not next/link, and deliberately so. <Link> does a
              client-side navigation: it would re-mount the same React tree
              whose root layout has just thrown, landing the visitor right
              back here. A full document load is the only thing that gets them
              out, which is exactly what the lint rule is telling us not to do
              — the rule is right in general and wrong in this one file. */}
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
          <a
            href="/"
            style={{
              borderRadius: "0.375rem",
              border: "1px solid #4A4A4A",
              padding: "0.75rem 1.25rem",
              fontSize: "0.875rem",
              fontWeight: 500,
              color: "#FFFFFF",
              textDecoration: "none",
            }}
          >
            Back to homepage
          </a>
        </div>
        {error.digest && (
          <p style={{ marginTop: "1.5rem", fontSize: "0.75rem", color: "#8A8A8A" }}>
            Reference: {error.digest}
          </p>
        )}
      </body>
    </html>
  );
}
