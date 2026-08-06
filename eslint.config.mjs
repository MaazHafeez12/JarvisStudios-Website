// ESLint flat config. ESLint 9 dropped `.eslintrc.*` support and this repo
// had no config file at all, so `npm run lint` exited on the migration notice
// instead of linting anything — silently, because `next build` does not run
// ESLint, so CI stayed green.
//
// `eslint-config-next` 16 ships native flat-config arrays, so these spread
// directly; no `FlatCompat` shim is needed.

import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypeScript from "eslint-config-next/typescript";

const config = [
  {
    ignores: [
      ".next/**",
      "node_modules/**",
      "next-env.d.ts",
      "tsconfig.tsbuildinfo",
    ],
  },
  ...nextCoreWebVitals,
  ...nextTypeScript,
];

export default config;
