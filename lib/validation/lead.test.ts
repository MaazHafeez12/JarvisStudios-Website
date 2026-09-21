import { describe, expect, it } from "vitest";
import { validateLead } from "@/lib/validation/lead";
import type { LeadInput } from "@/lib/types/lead";

// validateLead runs in two places: the contact form (where it is UX) and the
// route handler (where it is the security boundary — docs/TRD.md §8.1). The
// second is why this file exists. A request that never touches the form can
// send any JSON at all, so every rule below is the only thing between an
// arbitrary payload and a row in the leads table.

const VALID: LeadInput = {
  type: "client",
  name: "Sam Rivera",
  email: "sam@example.com",
  message: "We need a booking system for a plumbing business.",
};

describe("validateLead", () => {
  it("accepts a minimal valid lead", () => {
    const { valid, fields } = validateLead(VALID);
    expect(valid).toBe(true);
    expect(fields).toEqual({});
  });

  it("accepts the optional fields when present and well-formed", () => {
    const { valid } = validateLead({
      ...VALID,
      company: "Rivera Plumbing",
      projectType: "crm",
    });
    expect(valid).toBe(true);
  });

  it("rejects an empty payload and reports every missing field at once", () => {
    const { valid, fields } = validateLead({});
    expect(valid).toBe(false);
    // Reported together rather than one at a time — the form renders these
    // inline, and a visitor should not have to submit four times.
    expect(Object.keys(fields).sort()).toEqual([
      "email",
      "message",
      "name",
      "type",
    ]);
  });

  describe("type", () => {
    it("rejects a type the site no longer offers", () => {
      // 'investor' is still permitted by the table's check constraint but
      // removed from the site, so it must not pass validation.
      const { valid, fields } = validateLead({
        ...VALID,
        type: "investor" as LeadInput["type"],
      });
      expect(valid).toBe(false);
      expect(fields.type).toBeDefined();
    });

    it("rejects an arbitrary string", () => {
      const { fields } = validateLead({
        ...VALID,
        type: "admin" as LeadInput["type"],
      });
      expect(fields.type).toBeDefined();
    });
  });

  describe("name", () => {
    it("rejects a missing name", () => {
      expect(validateLead({ ...VALID, name: "" }).fields.name).toBeDefined();
    });

    it("rejects a whitespace-only name", () => {
      expect(validateLead({ ...VALID, name: "   " }).fields.name).toBeDefined();
    });

    it("accepts exactly 200 characters and rejects 201", () => {
      expect(validateLead({ ...VALID, name: "a".repeat(200) }).valid).toBe(true);
      expect(
        validateLead({ ...VALID, name: "a".repeat(201) }).fields.name
      ).toBeDefined();
    });

    it("measures length after trimming", () => {
      expect(validateLead({ ...VALID, name: `  ${"a".repeat(200)}  ` }).valid).toBe(
        true
      );
    });
  });

  describe("email", () => {
    it("rejects a missing email", () => {
      expect(validateLead({ ...VALID, email: "" }).fields.email).toBeDefined();
    });

    it.each([
      "not-an-email",
      "missing@tld",
      "@example.com",
      "sam@",
      "sam @example.com",
      "sam@exa mple.com",
    ])("rejects %j", (email) => {
      expect(validateLead({ ...VALID, email }).fields.email).toBeDefined();
    });

    it.each([
      "sam@example.com",
      "sam.rivera+leads@example.co.uk",
      "s@e.io",
    ])("accepts %j", (email) => {
      expect(validateLead({ ...VALID, email }).valid).toBe(true);
    });

    // Whitespace is what makes header injection possible downstream, where
    // the address is used as the notification's Reply-To.
    it("rejects an address containing whitespace or newlines", () => {
      expect(
        validateLead({ ...VALID, email: "sam@example.com\nBcc: evil@example.com" })
          .fields.email
      ).toBeDefined();
    });
  });

  describe("company", () => {
    it("is optional", () => {
      expect(validateLead({ ...VALID, company: undefined }).valid).toBe(true);
      expect(validateLead({ ...VALID, company: "" }).valid).toBe(true);
    });

    it("accepts exactly 200 characters and rejects 201", () => {
      expect(validateLead({ ...VALID, company: "a".repeat(200) }).valid).toBe(true);
      expect(
        validateLead({ ...VALID, company: "a".repeat(201) }).fields.company
      ).toBeDefined();
    });
  });

  describe("projectType", () => {
    it("is optional", () => {
      expect(validateLead({ ...VALID, projectType: undefined }).valid).toBe(true);
    });

    it.each(["web", "app", "saas", "crm", "ai", "design"] as const)(
      "accepts the %j service line",
      (projectType) => {
        expect(validateLead({ ...VALID, projectType }).valid).toBe(true);
      }
    );

    it("rejects a value that is not a service line", () => {
      const { fields } = validateLead({
        ...VALID,
        projectType: "blockchain" as LeadInput["projectType"],
      });
      expect(fields.projectType).toBeDefined();
    });
  });

  describe("message", () => {
    it("rejects a missing message", () => {
      expect(validateLead({ ...VALID, message: "" }).fields.message).toBeDefined();
    });

    it("rejects a whitespace-only message", () => {
      expect(
        validateLead({ ...VALID, message: "      " }).fields.message
      ).toBeDefined();
    });

    it("rejects a message under 10 characters", () => {
      expect(
        validateLead({ ...VALID, message: "too short" }).fields.message
      ).toBeDefined();
    });

    it("accepts exactly 10 characters", () => {
      expect(validateLead({ ...VALID, message: "a".repeat(10) }).valid).toBe(true);
    });

    it("accepts exactly 5000 characters and rejects 5001", () => {
      expect(validateLead({ ...VALID, message: "a".repeat(5000) }).valid).toBe(true);
      expect(
        validateLead({ ...VALID, message: "a".repeat(5001) }).fields.message
      ).toBeDefined();
    });
  });

  // Validation deliberately does not sanitize — lib/sanitize.ts does that at
  // the point of use. A message containing markup is a legitimate enquiry
  // from a developer, and rejecting it would turn an escaping concern into a
  // false rejection of real leads.
  it("does not reject markup in the message body", () => {
    expect(
      validateLead({
        ...VALID,
        message: "Our current site renders <script> tags unescaped. Can you fix it?",
      }).valid
    ).toBe(true);
  });
});
