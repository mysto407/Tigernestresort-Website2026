import Link from "next/link";
import { NAV_LINKS, CONTACT } from "@/lib/data";

export default function Footer() {
  return (
    <footer className="bg-forest-900 text-cream">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand */}
          <div>
            <h3 className="font-serif text-2xl text-cream mb-2">Tiger&apos;s Nest Resort</h3>
            <p className="font-sans text-[10px] tracking-[0.3em] uppercase text-gold-400 mb-6">
              Paro Valley · Bhutan
            </p>
            <p className="font-sans text-sm text-forest-100 leading-relaxed">
              Where luxury meets tradition — a sanctuary nestled in the shadow
              of the sacred Taktsang Monastery.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-sans text-[10px] tracking-[0.3em] uppercase text-gold-400 mb-6">
              Explore
            </h4>
            <nav className="flex flex-col gap-3">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="font-sans text-sm text-forest-100 hover:text-cream transition-colors duration-200"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-sans text-[10px] tracking-[0.3em] uppercase text-gold-400 mb-6">
              Contact
            </h4>
            <div className="flex flex-col gap-3 font-sans text-sm text-forest-100">
              <p>{CONTACT.address}</p>
              <a
                href={`tel:${CONTACT.phone}`}
                className="hover:text-cream transition-colors duration-200"
              >
                {CONTACT.phone}
              </a>
              <a
                href={`https://wa.me/${CONTACT.whatsapp.replace(/\D/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-cream transition-colors duration-200"
              >
                WhatsApp
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-forest-700 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-sans text-xs text-forest-200/50">
            © {new Date().getFullYear()} Tiger&apos;s Nest Resort. All rights reserved.
          </p>
          <p className="font-sans text-xs text-gold-500 tracking-widest uppercase">
            {CONTACT.offer}
          </p>
        </div>
      </div>
    </footer>
  );
}
