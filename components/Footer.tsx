import Image from "next/image";
import { Manrope } from "next/font/google";
import Link from "next/link";
import { MACHINE_CATEGORIES, BRANCHES } from "@/lib/catalog-data";

const manrope = Manrope({ subsets: ["latin"] });

const socialLinks = [
  {
    name: "Instagram",
    href: "https://www.instagram.com/sanjithloganathan/",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    name: "Facebook",
    href: "https://www.facebook.com/profile.php?id=61593101758218",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M14 8h3V4h-3c-3.3 0-5 2-5 5v3H6v4h3v8h4v-8h3.5l.5-4H13V9c0-.7.3-1 1-1z"
          fill="currentColor"
          stroke="none"
        />
      </svg>
    ),
  },
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/company/143599197",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="4" y="4" width="16" height="16" rx="2" />
        <path d="M8 10v7M8 7.5v.1M12 17v-4c0-1.7 1-3 2.5-3s2.5 1.1 2.5 3v4M12 10v7" />
      </svg>
    ),
  },
];

export default function Footer() {
  return (
    <footer
      className={`${manrope.className} relative mx-auto w-full max-w-[1360px] overflow-hidden rounded-[32px] border border-[#D7E7F7] bg-gradient-to-br from-white via-[#F7FBFF] to-[#E8F3FD] text-slate-700 shadow-[0_20px_60px_rgba(0,43,139,0.08)] mt-16 mb-8`}
    >
      {/* Background glow */}
      <div className="pointer-events-none absolute -left-32 -top-32 h-80 w-80 rounded-full bg-[#1268D8]/8 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -right-32 h-96 w-96 rounded-full bg-[#002B8B]/8 blur-3xl" />

      <div className="relative z-10 mx-auto grid grid-cols-1 gap-8 px-6 py-10 sm:px-8 md:grid-cols-2 lg:grid-cols-5 lg:gap-8">
        {/* Brand Column */}
        <div className="lg:col-span-2">
          <Link href="/" className="mb-4 flex items-center gap-3">
            <div className="flex h-[52px] w-[52px] items-center justify-center rounded-2xl border border-[#CFE2F5] bg-white shadow-sm p-1">
              <Image
                src="/SL Logo.png"
                alt="SL Laundry Tech logo"
                width={48}
                height={48}
                className="h-full w-full rounded-xl object-contain"
              />
            </div>

            <div>
              <div className="text-gradient-brand text-[18px] font-extrabold tracking-wide">
                SL LAUNDRY TECH
              </div>
              <div className="text-[10px] uppercase tracking-[0.14em] text-slate-500 font-semibold">
                Commercial Laundry Machine Experts &amp; Spares
              </div>
            </div>
          </Link>

          <p className="max-w-[360px] text-xs sm:text-sm leading-relaxed text-slate-600">
            Headquartered in Tiruppur, Tamil Nadu. Authorized dealer for Danube, Speed Queen, and LG Commercial laundry equipment. Supplying machines, genuine spare parts, and AMC maintenance across India.
          </p>

          {/* Social */}
          <div className="mt-5 flex gap-2.5">
            {socialLinks.map((social) => (
              <a
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Follow SL Laundry Tech on ${social.name}`}
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#CFE0F2] bg-white text-[#0753B8] shadow-xs transition-all hover:-translate-y-0.5 hover:border-[#1268D8] hover:bg-[#EAF4FD]"
              >
                <span className="h-4 w-4 [&_svg]:h-4 [&_svg]:w-4 [&_svg]:stroke-current [&_svg]:fill-none [&_svg]:stroke-[1.8]">
                  {social.icon}
                </span>
              </a>
            ))}
          </div>
        </div>

        {/* 6 Machine Types */}
        <div>
          <h3 className="text-gradient-brand mb-3 text-sm font-bold uppercase tracking-wider">
            6 Machine Types
          </h3>
          <ul className="space-y-2 text-xs">
            {MACHINE_CATEGORIES.map((cat) => (
              <li key={cat.id}>
                <Link
                  href="/#equipment-catalog"
                  className="text-slate-600 hover:text-[#002B8B] transition-colors"
                >
                  {cat.shortName}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Genuine Spares & Services */}
        <div>
          <h3 className="text-gradient-brand mb-3 text-sm font-bold uppercase tracking-wider">
            Spares &amp; Support
          </h3>
          <ul className="space-y-2 text-xs">
            <li>
              <Link href="/#equipment-catalog" className="text-slate-600 hover:text-[#002B8B]">
                Inverter Drives &amp; VFDs
              </Link>
            </li>
            <li>
              <Link href="/#equipment-catalog" className="text-slate-600 hover:text-[#002B8B]">
                Drain Valves (3&quot; Motorized)
              </Link>
            </li>
            <li>
              <Link href="/#equipment-catalog" className="text-slate-600 hover:text-[#002B8B]">
                Inlet Water Solenoids
              </Link>
            </li>
            <li>
              <Link href="/#equipment-catalog" className="text-slate-600 hover:text-[#002B8B]">
                Bearings &amp; Viton Seals
              </Link>
            </li>
            <li>
              <Link href="/#equipment-catalog" className="text-slate-600 hover:text-[#002B8B]">
                Silicone Door Gaskets
              </Link>
            </li>
            <li>
              <Link href="/services" className="text-slate-600 hover:text-[#002B8B]">
                Annual AMC Maintenance
              </Link>
            </li>
            <li>
              <Link href="/services" className="text-slate-600 hover:text-[#002B8B]">
                Emergency Breakdown Assistance
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact & Branches */}
        <div>
          <h3 className="text-gradient-brand mb-3 text-sm font-bold uppercase tracking-wider">
            Contact &amp; Hubs
          </h3>
          <div className="space-y-2.5 text-xs text-slate-600">
            <a
              href="tel:+919361624107"
              className="flex items-center gap-2 font-bold text-slate-900 hover:text-[#002B8B]"
            >
              <span>☎</span> +91 93616 24107
            </a>
            <a
              href="https://wa.me/918110012041"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 font-bold text-emerald-700 hover:underline"
            >
              <span>◉</span> WhatsApp: +91 81100 12041
            </a>
            <p className="flex items-start gap-2">
              <span>⌖</span> Palladam, Tiruppur, TN
            </p>
            <div className="pt-2 border-t border-slate-200">
              <Link
                href="/enquiry"
                className="inline-flex items-center justify-center w-full py-2 px-3 rounded-xl bg-[#002B8B] text-white text-xs font-bold hover:bg-[#001f66] transition-colors"
              >
                Request Quotation
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="relative z-10 border-t border-[#D2E2F2] bg-white/50 backdrop-blur-sm px-6 py-4 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p>© {new Date().getFullYear()} SL Laundry Tech. All Rights Reserved.</p>
        <div className="flex items-center gap-4 text-[11px]">
          <Link href="/privacy-policy" className="hover:text-[#002B8B]">
            Privacy Policy
          </Link>
          <span>|</span>
          <Link href="/terms-conditions" className="hover:text-[#002B8B]">
            Terms &amp; Conditions
          </Link>
          <span>|</span>
          <Link href="/sitemap" className="hover:text-[#002B8B]">
            Sitemap
          </Link>
          <span>|</span>
          <Link href="/login" className="hover:text-[#002B8B] text-slate-400">
            Engineer Portal
          </Link>
        </div>
      </div>
    </footer>
  );
}