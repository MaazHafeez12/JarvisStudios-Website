import Link from "next/link";
import { Logo } from "./ui/Logo";

const SERVICE_LINKS = [
  { href: "/services#web", label: "Web Development" },
  { href: "/services#app", label: "App Development" },
  { href: "/services#saas", label: "SaaS" },
  { href: "/services#crm", label: "CRM" },
  { href: "/services#ai", label: "AI Automation" },
  { href: "/services#design", label: "Marketing & Design" },
];

const COMPANY_LINKS = [
  { href: "/about", label: "About" },
  { href: "/work", label: "Work" },
  { href: "/investors", label: "Investors" },
  { href: "/contact", label: "Contact" },
];

export function Footer() {
  return (
    <footer className="border-t border-[--border] bg-[--surface]">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-4">
          <div className="sm:col-span-2 md:col-span-2">
            <Logo />
            <p className="mt-4 max-w-sm text-sm text-[--text-secondary]">
              Web development, app development, SaaS, CRM, and
              marketing/design for growing businesses.
            </p>
          </div>

          <div>
            <h2 className="font-mono text-xs uppercase tracking-widest text-[--text-secondary]">
              Services
            </h2>
            <ul className="mt-4 space-y-2">
              {SERVICE_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-[--text-secondary] transition-colors duration-150 ease-confident hover:text-[--text-primary]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="font-mono text-xs uppercase tracking-widest text-[--text-secondary]">
              Company
            </h2>
            <ul className="mt-4 space-y-2">
              {COMPANY_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-[--text-secondary] transition-colors duration-150 ease-confident hover:text-[--text-primary]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-[--border] pt-6 text-sm text-[--text-secondary] sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Jarvis Studios. All rights reserved.</p>
          <a
            href="mailto:jarvisstudios12@gmail.com"
            className="transition-colors duration-150 ease-confident hover:text-[--text-primary]"
          >
            jarvisstudios12@gmail.com
          </a>
        </div>
      </div>
    </footer>
  );
}
