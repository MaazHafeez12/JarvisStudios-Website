import "server-only";
import { Resend } from "resend";
import { escapeHtml } from "@/lib/sanitize";
import type { Lead } from "@/lib/types/lead";

// TODO: replace with a verified sending domain (e.g. leads@jarvisstudios.com)
// once one exists for this project — Resend's shared test address works
// without any domain verification but shouldn't be used in production.
const FROM_ADDRESS = "Jarvis Studios <onboarding@resend.dev>";

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
    from: FROM_ADDRESS,
    to,
    subject: `New ${lead.type} inquiry from ${lead.name}`,
    html,
  });
}
