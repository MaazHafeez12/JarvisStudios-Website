import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { validateLead } from "@/lib/validation/lead";
import { checkRateLimit } from "@/lib/rate-limit";
import { getSupabaseServerClient } from "@/lib/supabase/server-client";
import { sendLeadNotificationEmail } from "@/lib/notifications/email";
import { postLeadToSlack } from "@/lib/notifications/slack";
import type { Lead, LeadInput } from "@/lib/types/lead";

// Full contract: docs/TRD.md §5. Request lifecycle: docs/ARCHITECTURE.md §2.2.
//
// Order of operations (matters — see docs/TRD.md §8.4):
//   1. Content-Type enforcement (docs/SECURITY_AUDIT.md finding #11)
//   2. Rate limit + honeypot (docs/SECURITY_AUDIT.md finding #1)
//   3. Server-side validation (source of truth regardless of client checks)
//   4. Supabase insert — the ONE step that must succeed for a 200
//   5. Email + Slack notifications — best-effort, concurrent, never block
//      or fail the response; the lead is already saved by this point.

function getClientIp(request: NextRequest): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0].trim();
  return request.headers.get("x-real-ip") ?? "unknown";
}

export async function POST(request: NextRequest) {
  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) {
    return NextResponse.json(
      { success: false, error: "UNSUPPORTED_MEDIA_TYPE" },
      { status: 415 }
    );
  }

  let body: Partial<LeadInput>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, error: "INVALID_JSON" }, { status: 400 });
  }

  // Honeypot: a real visitor never fills this hidden field. Respond with a
  // convincing fake success rather than a distinguishable rejection, so
  // the bot has no signal that it was caught (standard honeypot practice).
  if (body.website) {
    return NextResponse.json({ success: true, id: randomUUID() }, { status: 200 });
  }

  try {
    const ip = getClientIp(request);
    const { success: withinLimit } = await checkRateLimit(ip);
    if (!withinLimit) {
      return NextResponse.json(
        { success: false, error: "RATE_LIMITED" },
        { status: 429 }
      );
    }
  } catch (err) {
    console.error("[api/leads] rate limit check failed:", err);
    return NextResponse.json({ success: false, error: "SERVER_ERROR" }, { status: 500 });
  }

  const { valid, fields } = validateLead(body);
  if (!valid) {
    return NextResponse.json(
      { success: false, error: "VALIDATION_ERROR", fields },
      { status: 400 }
    );
  }

  let lead: Lead;
  try {
    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase
      .from("leads")
      .insert({
        type: body.type,
        name: body.name!.trim(),
        email: body.email!.trim(),
        company: body.company?.trim() || null,
        project_type: body.projectType ?? null,
        message: body.message!.trim(),
      })
      .select()
      .single();

    if (error || !data) throw error ?? new Error("Insert returned no data");

    lead = {
      id: data.id,
      type: data.type,
      name: data.name,
      email: data.email,
      company: data.company,
      projectType: data.project_type,
      message: data.message,
      status: data.status,
      createdAt: data.created_at,
    };
  } catch (err) {
    console.error("[api/leads] Supabase insert failed:", err);
    return NextResponse.json({ success: false, error: "SERVER_ERROR" }, { status: 500 });
  }

  // Best-effort, non-blocking (docs/TRD.md §8.4): the lead is already
  // saved, so a notification failure is logged with the lead id for
  // manual recovery, never surfaced to the client.
  const results = await Promise.allSettled([
    sendLeadNotificationEmail(lead),
    postLeadToSlack(lead),
  ]);
  results.forEach((result, i) => {
    if (result.status === "rejected") {
      const channel = i === 0 ? "email" : "slack";
      console.error(`[api/leads] ${channel} notification failed for lead ${lead.id}:`, result.reason);
    }
  });

  return NextResponse.json({ success: true, id: lead.id }, { status: 200 });
}
