#!/usr/bin/env node
// IndexNow submission. Tells Bing (and Yandex, Seznam, Naver — every engine
// on the shared protocol) that this site's URLs have changed, instead of
// waiting for a crawl that arrives on its own schedule. Google is not a
// participant and ignores it; nothing here affects Google, which discovers
// changes through the sitemap submitted in Search Console.
//
// ── WHY THE KEY IS COMMITTED ────────────────────────────────────────────
// `public/<key>.txt` is not a secret and must not be treated as one. The
// protocol's entire ownership proof is "whoever can publish a file at
// https://<host>/<key>.txt controls <host>", so the engine fetches that file
// over the open internet before accepting a submission. A key in an env var
// would still have to be published verbatim at a public URL to work. The
// only thing it grants an attacker who copies it is the ability to tell Bing
// to re-crawl pages we already asked Bing to crawl.
//
// ── WHAT THIS SUBMITS ───────────────────────────────────────────────────
// Every URL in the live sitemap, not just the ones that changed. The
// protocol asks for changed URLs only, and at 17 URLs and a handful of
// deploys a week that distinction costs nothing — but it would matter at a
// few hundred, and the fix then is to derive the list from the deploy's diff
// rather than to submit less often. Recorded here so the reason it is
// acceptable is visible alongside the thing that makes it acceptable.
//
// Usage:
//   node scripts/indexnow.mjs            submit
//   node scripts/indexnow.mjs --dry-run  print what would be submitted

import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const KEY = "ff3ba3dad840a6b79c54255dc6f3b415";
const ENDPOINT = "https://api.indexnow.org/indexnow";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dryRun = process.argv.includes("--dry-run");

function fail(message) {
  console.error(`indexnow: ${message}`);
  process.exit(1);
}

// lib/seo.ts owns the canonical origin — it exists so the domain is declared
// once rather than in sitemap.ts, robots.ts and metadataBase separately, and
// this script is one more place it would otherwise drift. Read out with a
// regex rather than imported because this is a plain Node script: importing
// a .ts module means a loader or a build step, which is a lot of machinery
// to run forty lines.
async function siteUrl() {
  const source = await readFile(path.join(ROOT, "lib", "seo.ts"), "utf8");
  const match = source.match(/export const SITE_URL = "([^"]+)"/);
  if (!match) fail("could not read SITE_URL from lib/seo.ts");
  return match[1];
}

// The submission is rejected if the engine cannot fetch the key file, and
// the rejection is a bare 403 that says nothing about which half is wrong.
// Checking it here turns "403 Forbidden" into "the deploy hasn't propagated
// yet" or "the file is missing from public/".
async function assertKeyIsLive(origin) {
  const local = await readFile(
    path.join(ROOT, "public", `${KEY}.txt`),
    "utf8",
  ).catch(() => fail(`public/${KEY}.txt is missing`));

  if (local.trim() !== KEY) {
    fail(`public/${KEY}.txt does not contain the key this script submits`);
  }

  const url = `${origin}/${KEY}.txt`;
  const response = await fetch(url).catch((error) =>
    fail(`could not reach ${url} — ${error.message}`),
  );

  if (!response.ok) {
    fail(`${url} returned ${response.status} — is the key file deployed?`);
  }
  if ((await response.text()).trim() !== KEY) {
    fail(`${url} is serving a different key than this script submits`);
  }
}

async function sitemapUrls(origin) {
  const url = `${origin}/sitemap.xml`;
  const response = await fetch(url).catch((error) =>
    fail(`could not reach ${url} — ${error.message}`),
  );
  if (!response.ok) fail(`${url} returned ${response.status}`);

  const xml = await response.text();
  const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());

  if (urls.length === 0) fail(`${url} contained no <loc> entries`);

  // A submission mixing hosts is rejected wholesale (422), so catch it here
  // where the message can name the offender.
  const foreign = urls.filter((entry) => !entry.startsWith(`${origin}/`) && entry !== origin);
  if (foreign.length > 0) fail(`sitemap contains off-host URLs: ${foreign.join(", ")}`);

  return urls;
}

const origin = await siteUrl();
const host = new URL(origin).host;

await assertKeyIsLive(origin);
const urlList = await sitemapUrls(origin);

if (dryRun) {
  console.log(`indexnow: would submit ${urlList.length} URLs for ${host}:`);
  for (const entry of urlList) console.log(`  ${entry}`);
  process.exit(0);
}

const response = await fetch(ENDPOINT, {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({ host, key: KEY, urlList }),
}).catch((error) => fail(`submission failed — ${error.message}`));

// The protocol's codes, spelled out because "422" on its own sends you
// reading a spec to learn it means the URLs and the key disagree.
const MEANINGS = {
  200: "accepted",
  202: "accepted — key validation pending",
  400: "bad request (malformed submission)",
  403: "key rejected (the key file could not be verified)",
  422: "URLs do not match the host, or the key does not match the host",
  429: "rate limited (too many submissions)",
};

const meaning = MEANINGS[response.status] ?? "unexpected status";
const line = `indexnow: ${response.status} ${meaning} — ${urlList.length} URLs for ${host}`;

if (response.status === 200 || response.status === 202) {
  console.log(line);
} else {
  fail(line.replace("indexnow: ", ""));
}
