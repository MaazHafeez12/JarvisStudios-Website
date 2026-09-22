# Case study brief

What has to be collected before a second case study can be written, and the consent that has to exist before it can be published.

This document exists because `TODO.md` has carried "Case studies — `docs/PRD.md` §6 item 3 asks for 2" since launch, blocked on information only the client has. The block is real. What was not real is the idea that nothing could be done about it until the client happened to offer — this is the list to send them.

## Why this cannot be drafted first and verified later

`PRODUCT.md` Principle 1 forbids fabricating evidence: results, clients, metrics, testimonials. A case study is nothing but those four things. There is no version of it that can be written speculatively and corrected afterwards, because the draft itself would be the violation — and a published metric that turns out to be wrong is worse than no case study, since it is the kind of error a client notices and a competitor screenshots.

The one published result on this site (SNF Construction Group, 10% month-over-month reach growth) is held to that standard: it appears in `content/services.ts` as a `ServiceProof`, every other surface reads it from there, and `content/insights.ts` records exactly what the piece deliberately omits — no vanity baseline, no invented tactics list, no self-written quote.

## What to ask the client

Send these as questions, not as a form. The answer to any one of them can be "no" or "we would rather not say", and the case study still works — it just says less.

**The engagement**

1. What was the problem in your words, before we got involved?
2. What had you already tried?
3. What did we actually build or run, and over what period?
4. Was it a fixed scope or a retainer? (Both are published positions — `content/engagement.ts` — so either is safe to state.)

**The result**

5. What number moved? Any number you are willing to have published.
6. What was it before, and what is it now? A percentage with no baseline is the weakest form of a real result, and this site has already committed to not publishing those.
7. Over what window was it measured, and who measured it — you or us?
8. Is there anything about that number that would mislead someone reading it without context? (Seasonality, a one-off campaign, a change you made independently of us.)

**Attribution**

9. May we use your company name?
10. May we use a named quote, and from whom, with what job title?
11. Is there anything about the engagement you would prefer we do not mention at all?

## The consent that has to be on file

Verbal agreement in a call is not enough for something that will sit on a public URL indefinitely. What is needed, in writing (email is fine):

- Permission to name the company.
- Permission to publish the specific figures, quoted back to them exactly as they will appear.
- Permission to use the quote, if there is one, in the exact wording that will be published.
- Confirmation of who is giving that permission and that they are authorised to.

Send the finished draft before it goes live and get a "yes, publish that" against the actual text. This is not a legal formality — it is the only way to catch the case where a client is happy with the result but unhappy with how it reads.

## Where it goes once collected

- The result becomes a `ServiceProof` in `content/services.ts`, on whichever service line earned it. That is the single source — `/services`, the service page, the homepage and any trade page with a matching `proofFrom` all read from it rather than restating it.
- The written piece becomes an entry in `content/insights.ts` with `kind: "case-study"`, which is the stricter bar that field exists to mark.
- If the second case study is for a trade with a page in `content/trades.ts`, set `proofFrom` on that trade to the service line carrying it.

## What not to do while waiting

Do not restore `/work` as a surface with nothing in it. The placeholder that used to live there is why it was removed, and a second empty shelf would repeat the mistake rather than fix it.
