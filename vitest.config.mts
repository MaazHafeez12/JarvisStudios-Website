import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

// Test runner config. Scope is deliberately narrow: the pure, security-
// relevant functions in lib/ — input validation, output escaping, and the
// rate limiter's client identifier. Those are the three places where a quiet
// regression has a consequence worse than a visual glitch, and all three are
// plain functions with no I/O, so they are the cheapest possible coverage.
//
// Component and end-to-end tests are NOT set up here. That is a real gap, not
// a claim that it is covered; adding a DOM environment and a component
// harness is a larger decision than this change should make on its own.
export default defineConfig({
  test: {
    environment: "node",
    include: ["lib/**/*.test.ts"],
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL(".", import.meta.url)),
    },
  },
});
