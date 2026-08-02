// Escaping helpers for lead content interpolated into the Resend email and
// Slack notification (docs/SECURITY_AUDIT.md finding #3). Every lead field
// is free-text from an anonymous visitor — treat it as plain text being
// dropped into a template, never as trusted markup.

/** HTML-escape for interpolation into the Resend email template. */
export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * Escape Slack's `mrkdwn` special characters per Slack's own escaping
 * rules (https://api.slack.com/reference/surfaces/formatting#escaping) —
 * `&`, `<`, `>` — so a lead's name/message can't inject link syntax or
 * fake formatting into the notification.
 */
export function escapeSlackMrkdwn(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
