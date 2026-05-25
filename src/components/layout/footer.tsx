import Link from "next/link";
import { Sparkles, Github, Linkedin, Twitter } from "lucide-react";

const footerLinks = {
  Platform: [
    { label: "AI Engine", href: "#engine" },
    { label: "Roadmap", href: "#roadmap" },
    { label: "Features", href: "#features" },
    { label: "Pricing", href: "#" },
  ],
  Resources: [
    { label: "Documentation", href: "#" },
    { label: "Blog", href: "#resources" },
    { label: "API Reference", href: "#" },
    { label: "Case Studies", href: "#" },
  ],
  Company: [
    { label: "About", href: "#" },
    { label: "Careers", href: "#" },
    { label: "Contact", href: "#" },
    { label: "Partners", href: "#" },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-navy-100 bg-white">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 lg:gap-12">
          <div className="col-span-2 sm:col-span-3 md:col-span-4 lg:col-span-2">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-navy-900">
                <Sparkles className="h-4 w-4 text-emerald-glow" />
              </div>
              <span className="text-lg font-semibold text-navy-900">
                Tensure
              </span>
            </Link>
            <p className="mt-4 max-w-sm text-sm text-navy-600">
              AI-driven pipeline design and ROI estimation for enterprise
              DevOps modernization.
            </p>
            <div className="mt-6 flex gap-4">
              {[Twitter, Github, Linkedin].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="text-navy-400 transition-colors hover:text-emerald-brand"
                  aria-label="Social link"
                >
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-semibold text-navy-900">{title}</h4>
              <ul className="mt-4 space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-navy-600 transition-colors hover:text-emerald-brand"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-navy-100 pt-8 sm:flex-row">
          <p className="text-sm text-navy-500">
            © {new Date().getFullYear()} Tensure. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-navy-500">
            <a href="#" className="hover:text-navy-900">
              Privacy
            </a>
            <a href="#" className="hover:text-navy-900">
              Terms
            </a>
            <a href="#" className="hover:text-navy-900">
              Security
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
