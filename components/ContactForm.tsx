"use client";

import { useState, type FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import { validateLead, type FieldErrors } from "@/lib/validation/lead";
import { PROJECT_TYPES, type LeadInput, type LeadType, type ProjectType } from "@/lib/types/lead";

const PROJECT_TYPE_LABELS: Record<ProjectType, string> = {
  web: "Web Development",
  app: "App Development",
  saas: "SaaS",
  crm: "CRM",
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
  const initialType: LeadType = searchParams.get("type") === "investor" ? "investor" : "client";

  const [form, setForm] = useState<LeadInput>({ ...EMPTY_FORM, type: initialType });
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
        setForm({ ...EMPTY_FORM, type: initialType });
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
          Thanks for reaching out — we'll get back to you soon.
        </p>
      </div>
    );
  }

  const fieldErrors = state.status === "field-errors" ? state.fields : {};
  const isSubmitting = state.status === "submitting";

  return (
    <form onSubmit={handleSubmit} noValidate className="relative flex flex-col gap-5">
      {/* Type selector */}
      <div className="flex gap-2 rounded-lg border border-[--border] p-1">
        {(["client", "investor"] as LeadType[]).map((type) => (
          <button
            key={type}
            type="button"
            onClick={() => update("type", type)}
            aria-pressed={form.type === type}
            className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors duration-150 ease-confident ${
              form.type === type
                ? "bg-brand-500 text-neutral-950"
                : "text-[--text-secondary] hover:text-[--text-primary]"
            }`}
          >
            {type === "client" ? "I'm a prospective client" : "I'm an investor / partner"}
          </button>
        ))}
      </div>

      <Field label="Name" htmlFor="name" error={fieldErrors.name}>
        <input
          id="name"
          type="text"
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
          value={form.company}
          onChange={(e) => update("company", e.target.value)}
          className={inputClass(!!fieldErrors.company)}
        />
      </Field>

      {form.type === "client" && (
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
      )}

      <Field label="Message" htmlFor="message" error={fieldErrors.message}>
        <textarea
          id="message"
          rows={5}
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
        <p role="alert" className="text-sm text-error-500">
          {state.message}
        </p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded-md bg-brand-500 px-6 py-3 text-sm font-medium text-neutral-950 transition-colors duration-150 ease-confident hover:bg-brand-300 disabled:opacity-60"
      >
        {isSubmitting ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}

function inputClass(hasError: boolean): string {
  return `w-full rounded-md border bg-[--surface-raised] px-4 py-2.5 text-[--text-primary] outline-none transition-colors duration-150 ease-confident focus:border-[--accent] ${
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
        <p id={`${htmlFor}-error`} className="mt-1.5 text-sm text-error-500">
          {error}
        </p>
      )}
    </div>
  );
}
