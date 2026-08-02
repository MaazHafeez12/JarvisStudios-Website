import "server-only";
import { escapeSlackMrkdwn } from "@/lib/sanitize";
import type { Lead } from "@/lib/types/lead";

export async function postLeadToSlack(lead: Lead): Promise<void> {
  const webhookUrl = process.env.SLACK_WEBHOOK_URL;

  if (!webhookUrl) {
    throw new Error("Slack notifications are not configured: SLACK_WEBHOOK_URL must be set.");
  }

  // Fields are escaped per Slack's mrkdwn rules (docs/SECURITY_AUDIT.md
  // finding #3) so a lead can't inject link syntax or fake formatting.
  const name = escapeSlackMrkdwn(lead.name);
  const email = escapeSlackMrkdwn(lead.email);
  const message = escapeSlackMrkdwn(lead.message);

  const lines = [
    `*New ${lead.type} inquiry*`,
    `*Name:* ${name}`,
    `*Email:* ${email}`,
  ];
  if (lead.company) lines.push(`*Company:* ${escapeSlackMrkdwn(lead.company)}`);
  if (lead.projectType) lines.push(`*Project type:* ${escapeSlackMrkdwn(lead.projectType)}`);
  lines.push(`*Message:*\n${message}`);

  const response = await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text: lines.join("\n") }),
  });

  if (!response.ok) {
    throw new Error(`Slack webhook responded with ${response.status}`);
  }
}
