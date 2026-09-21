import "server-only";
import { Resend } from "resend";
import { escapeHtml } from "@/lib/sanitize";
import type { Lead } from "@/lib/types/lead";

// Sender address. Configured via RESEND_FROM_EMAIL so the verified domain is
// an environment decision rather than a code change, and so Preview and
// Production can differ.
//
// WHY THIS MATTERS MORE THAN IT LOOKS. `onboarding@resend.dev` is Resend's
// shared test address: it needs no domain verification, which is exactly why
// it is the wrong thing to ship. Mail sent from it carries no SPF or DKIM
// alignment for jarvisstudios.net, so receiving servers have nothing tying
// the message to this business — and lead notifications are the single
// output of the only dynamic feature on the site. An enquiry that saves to
// the database but whose notification lands in spam is a lead lost as surely
// as one that was never submitted.
//
// To set it up: add jarvisstudios.net as a domain in Resend, publish the
// DKIM and SPF records it gives you at your DNS provider (Cloudflare, per
// README), wait for verification, then set RESEND_FROM_EMAIL to an address
// on that domain. A DMARC record (`p=none` to start, so you get reports
// without rejecting anything) is worth adding at the same time.
//
// Falls back to the test address rather than throwing, deliberately: a
// missing env var must not stop lead notifications reaching a live inbox.
// The warning is what makes the degraded state visible in the logs.
const FALLBACK_FROM_ADDRESS = "Jarvis Studios <onboarding@resend.dev>";

function getFromAddress(): string {
  const configured = process.env.RESEND_FROM_EMAIL;
  if (configured) return configured;

  console.warn(
    "[notifications/email] RESEND_FROM_EMAIL is not set — falling back to " +
      "Resend's shared test address. Notification mail has no SPF/DKIM " +
      "alignment for this domain and may be filtered as spam. See the " +
      "setup note in lib/notifications/email.ts."
  );
  return FALLBACK_FROM_ADDRESS;
}

export async function sendLeadNotificationEmail(lead: Lead): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.NOTIFICATION_EMAIL_TO;

  if (!apiKey || !to) {
    throw new Error(
      "Email notifications are not configured: RESEND_API_KEY and NOTIFICATION_EMAIL_TO must be set."
    );
  }

  const resend = new Resend(apiKey);

  // Every field below is escaped (docs/SECURITY_AUDIT.md finding #3) —
  // this is free text from an anonymous visitor, never trusted markup.
  const html = `
    <h2>New ${escapeHtml(lead.type)} inquiry</h2>
    <p><strong>Name:</strong> ${escapeHtml(lead.name)}</p>
    <p><strong>Email:</strong> ${escapeHtml(lead.email)}</p>
    ${lead.company ? `<p><strong>Company:</strong> ${escapeHtml(lead.company)}</p>` : ""}
    ${lead.projectType ? `<p><strong>Project type:</strong> ${escapeHtml(lead.projectType)}</p>` : ""}
    <p><strong>Message:</strong></p>
    <p>${escapeHtml(lead.message).replace(/\n/g, "<br>")}</p>
    <hr>
    <p style="color:#8A8A8A;font-size:12px;">Lead ID: ${escapeHtml(lead.id)}</p>
  `;

  await resend.emails.send({
    from: getFromAddress(),
    to,
    // Replying to a notification should reach the person who sent it, not
    // bounce off the sending domain. The address is already validated and
    // the subject/body are escaped; this header is the only place the raw
    // value is used as an address rather than as text.
    replyTo: lead.email,
    subject: `New ${lead.type} inquiry from ${lead.name}`,
    html,
  });
}
