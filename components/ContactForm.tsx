"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { validateLead, type FieldErrors } from "@/lib/validation/lead";
import { PROJECT_TYPES, type LeadInput, type ProjectType } from "@/lib/types/lead";

const PROJECT_TYPE_LABELS: Record<ProjectType, string> = {
  web: "Web Development",
  app: "App Development",
  saas: "SaaS",
  crm: "CRM",
  ai: "AI Automation",
  design: "Marketing & Design",
};

type SubmitState =
  | { status: "idle" }
  | { status: "submitting" }
  | { status: "success" }
  | { status: "error"; message: string }
  | { status: "field-errors"; fields: FieldErrors };

const EMPTY_FORM: LeadInput = {
  type: "client",
  name: "",
  email: "",
  company: "",
  projectType: undefined,
  message: "",
  website: "", // honeypot — must stay empty
};

export function ContactForm() {
  const searchParams = useSearchParams();

  // /services links here with the line already chosen, so someone who has
  // decided doesn't re-pick it from a dropdown. Validated against
  // PROJECT_TYPES rather than trusted: the value arrives from the URL.
  const serviceParam = searchParams.get("service");
  const initialProjectType = PROJECT_TYPES.find((pt) => pt === serviceParam);

  const [form, setForm] = useState<LeadInput>({
    ...EMPTY_FORM,
    projectType: initialProjectType,
  });
  const [state, setState] = useState<SubmitState>({ status: "idle" });

  function update<K extends keyof LeadInput>(key: K, value: LeadInput[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    // Client-side validation is UX only — the Route Handler re-validates
    // everything server-side regardless (docs/TRD.md §8.1).
    const { valid, fields } = validateLead(form);
    if (!valid) {
      setState({ status: "field-errors", fields });
      return;
    }

    setState({ status: "submitting" });

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (res.status === 200 && data.success) {
        setState({ status: "success" });
        setForm({ ...EMPTY_FORM });
      } else if (res.status === 400 && data.error === "VALIDATION_ERROR") {
        setState({ status: "field-errors", fields: data.fields ?? {} });
      } else if (res.status === 429) {
        setState({
          status: "error",
          message: "You've submitted a few requests recently — please try again in a bit.",
        });
      } else {
        setState({
          status: "error",
          message: "Something went wrong on our end. Please try again shortly.",
        });
      }
    } catch {
      setState({
        status: "error",
        message: "Couldn't reach the server. Check your connection and try again.",
      });
    }
  }

  if (state.status === "success") {
    return (
      <div
        role="status"
        className="rounded-lg border border-success-500/30 bg-success-500/10 p-6 text-center"
      >
        <p className="font-display text-xl font-semibold">Message sent.</p>
        <p className="mt-2 text-sm text-[--text-secondary]">
          Thanks for reaching out — we&rsquo;ll get back to you soon.
        </p>
      </div>
    );
  }

  const fieldErrors = state.status === "field-errors" ? state.fields : {};
  const isSubmitting = state.status === "submitting";

  return (
    <form onSubmit={handleSubmit} noValidate className="relative flex flex-col gap-5">
      <Field label="Name" htmlFor="name" error={fieldErrors.name}>
        <input
          id="name"
          type="text"
          placeholder="Your name"
          value={form.name}
          onChange={(e) => update("name", e.target.value)}
          aria-invalid={!!fieldErrors.name}
          aria-describedby={fieldErrors.name ? "name-error" : undefined}
          className={inputClass(!!fieldErrors.name)}
        />
      </Field>

      <Field label="Email" htmlFor="email" error={fieldErrors.email}>
        <input
          id="email"
          type="email"
          placeholder="you@company.com"
          value={form.email}
          onChange={(e) => update("email", e.target.value)}
          aria-invalid={!!fieldErrors.email}
          aria-describedby={fieldErrors.email ? "email-error" : undefined}
          className={inputClass(!!fieldErrors.email)}
        />
      </Field>

      <Field label="Company (optional)" htmlFor="company" error={fieldErrors.company}>
        <input
          id="company"
          type="text"
          placeholder="Your business name"
          value={form.company}
          onChange={(e) => update("company", e.target.value)}
          className={inputClass(!!fieldErrors.company)}
        />
      </Field>

      {/* Always rendered. It used to be gated on type === "client", which
          only ever hid it for the investor path that no longer exists. */}
      <Field label="Project type (optional)" htmlFor="projectType" error={fieldErrors.projectType}>
        <select
          id="projectType"
          value={form.projectType ?? ""}
          onChange={(e) =>
            update("projectType", (e.target.value || undefined) as ProjectType | undefined)
          }
          className={inputClass(!!fieldErrors.projectType)}
        >
          <option value="">Select one…</option>
          {PROJECT_TYPES.map((pt) => (
            <option key={pt} value={pt}>
              {PROJECT_TYPE_LABELS[pt]}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Message" htmlFor="message" error={fieldErrors.message}>
        <textarea
          id="message"
          rows={5}
          placeholder="What's slow, missed, or manual right now? A sentence or two is enough, we'll ask the rest."
          value={form.message}
          onChange={(e) => update("message", e.target.value)}
          aria-invalid={!!fieldErrors.message}
          aria-describedby={fieldErrors.message ? "message-error" : undefined}
          className={inputClass(!!fieldErrors.message)}
        />
      </Field>

      {/* Honeypot — visually hidden (not display:none) and hidden from
          assistive tech and tab order, per docs/DESIGN.md §6.6. A real
          visitor never sees or fills this. */}
      <div className="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input
          id="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={form.website}
          onChange={(e) => update("website", e.target.value)}
        />
      </div>

      {state.status === "error" && (
        <p role="alert" className="text-sm text-[--error-text]">
          {state.message}
        </p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded-md bg-brand-500 px-6 py-3 text-sm font-medium text-neutral-950 transition-colors duration-150 ease-confident hover:bg-brand-300 disabled:opacity-60"
      >
        {isSubmitting ? "Sending…" : "Get my free scope"}
      </button>

      {/* Collection notice. This sits at the point of collection rather than
          only in the footer because that is what GDPR Art. 13 actually asks
          for — the information has to reach someone as they hand data over,
          not be discoverable elsewhere on the site. Deliberately states the
          retention window inline: "see our privacy policy" alone tells a
          visitor nothing at the moment they are deciding whether to type. */}
      <p className="text-xs leading-relaxed text-[--text-secondary]">
        We use this only to reply to your enquiry, keep it for 24 months, and
        never sell or share it.{" "}
        <Link
          href="/privacy"
          className="underline decoration-[--border] underline-offset-4 transition-colors duration-150 ease-confident hover:text-[--text-primary] hover:decoration-[--accent]"
        >
          Privacy policy
        </Link>
        .
      </p>
    </form>
  );
}

// `outline-none` is deliberately absent. It used to be here, leaving the
// 1px `focus:border-[--accent]` as the only focus signal — a one-pixel
// colour change that fails WCAG 2.4.13's 2px minimum and is genuinely hard
// to locate when tabbing. The global `:focus-visible` rule in globals.css now
// draws the real indicator; the border change stays as a secondary cue.
//
// Note that a Tailwind utility would win over that rule on specificity, so
// re-adding `outline-none` here silently removes the site's focus ring from
// every form field. Don't.
function inputClass(hasError: boolean): string {
  return `w-full rounded-md border bg-[--surface-raised] px-4 py-2.5 text-[--text-primary] transition-colors duration-150 ease-confident focus:border-[--accent] ${
    hasError ? "border-error-500" : "border-[--border]"
  }`;
}

function Field({
  label,
  htmlFor,
  error,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-1.5 block text-sm text-[--text-secondary]">
        {label}
      </label>
      {children}
      {error && (
        <p id={`${htmlFor}-error`} className="mt-1.5 text-sm text-[--error-text]">
          {error}
        </p>
      )}
    </div>
  );
}
