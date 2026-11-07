'use client';

import { useEffect, useRef, useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import gsap from 'gsap';

export default function SocialSidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const dockRef = useRef<HTMLDivElement>(null);
  const whatsappRef = useRef<HTMLAnchorElement>(null);
  const instaRef = useRef<HTMLAnchorElement>(null);
  const fbRef = useRef<HTMLAnchorElement>(null);

  // Silky smooth GSAP Wave Animation loop
  useEffect(() => {
    if (!isOpen) return;

    const ctx = gsap.context(() => {
      // 1. Butter-smooth entrance (force3D for hardware acceleration, no CSS transition conflict)
      if (dockRef.current) {
        gsap.fromTo(
          dockRef.current,
          { x: 60, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.6,
            ease: 'power2.out',
            force3D: true,
          }
        );
      }

      // 2. Cascading Wave Timeline across the 3 icons (smooth sine easing, no cut/stutter)
      const masterWave = gsap.timeline({
        repeat: -1,
        repeatDelay: 1.8,
        defaults: { ease: 'sine.inOut', force3D: true },
      });

      // WhatsApp Ring Vibration (silky gentle sway)
      if (whatsappRef.current) {
        masterWave
          .to(whatsappRef.current, {
            rotation: -12,
            scale: 1.1,
            duration: 0.12,
          })
          .to(whatsappRef.current, {
            rotation: 12,
            duration: 0.12,
          })
          .to(whatsappRef.current, {
            rotation: -8,
            duration: 0.1,
          })
          .to(whatsappRef.current, {
            rotation: 8,
            duration: 0.1,
          })
          .to(whatsappRef.current, {
            rotation: 0,
            scale: 1,
            duration: 0.25,
            ease: 'power2.out',
          });
      }

      // Instagram Pop Zoom & Glow (seamlessly flows in right as WhatsApp finishes)
      if (instaRef.current) {
        masterWave
          .to(
            instaRef.current,
            {
              scale: 1.16,
              rotation: -5,
              duration: 0.28,
              ease: 'power2.out',
            },
            '-=0.15'
          )
          .to(instaRef.current, {
            scale: 1,
            rotation: 0,
            duration: 0.3,
            ease: 'power2.inOut',
          });
      }

      // Facebook Float Bounce (seamlessly flows in right as Instagram finishes)
      if (fbRef.current) {
        masterWave
          .to(
            fbRef.current,
            {
              y: -6,
              scale: 1.14,
              duration: 0.28,
              ease: 'power2.out',
            },
            '-=0.15'
          )
          .to(fbRef.current, {
            y: 0,
            scale: 1,
            duration: 0.35,
            ease: 'sine.out',
          });
      }
    });

    return () => ctx.revert();
  }, [isOpen]);

  return (
    <aside
      aria-label="Instant support and social media channels"
      className="fixed right-0 top-1/2 z-50 -translate-y-1/2 select-none pointer-events-auto"
      style={{ willChange: 'transform' }}
    >
      {/* =========================================================
          EXPANDED SOCIAL DOCK
      ========================================================= */}
      {isOpen ? (
        <div
          ref={dockRef}
          className="relative rounded-l-2xl border border-r-0 border-slate-200/90 bg-white/98 p-2 sm:p-2.5 shadow-[0_8px_30px_rgba(0,43,139,0.12)] backdrop-blur-sm"
          style={{ willChange: 'transform, opacity' }}
        >
          {/* Header Bar with Live Indicator & Close Button */}
          <div className="flex items-center justify-between gap-2 pb-2 mb-1.5 border-b border-slate-100">
            <div className="flex items-center gap-1.5 pl-1" title="Senior Laundry Engineers Online">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="text-[9px] font-black uppercase tracking-wider text-slate-500">
                Support
              </span>
            </div>

            <button
              type="button"
              aria-label="Minimize support panel"
              onClick={() => setIsOpen(false)}
              className="flex h-5 w-5 items-center justify-center rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              title="Minimize"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Social / Support Buttons with Smooth Hardware-Accelerated Wave */}
          <div className="flex flex-col items-center gap-2.5" role="list">
            {/* 1. WHATSAPP */}
            <div className="relative group flex items-center justify-center" role="listitem">
              <a
                ref={whatsappRef}
                href="https://wa.me/918110012041?text=Hi%20SL%20Laundry%20Tech,%20I%20would%20like%20to%20enquire%20about%20commercial%20laundry%20machines%20and%20spare%20parts."
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Chat on WhatsApp"
                title="Chat on WhatsApp"
                className="relative inline-flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-xl border border-emerald-200/80 bg-white text-[#25D366] shadow-xs transition-colors duration-200 hover:bg-[#25D366] hover:text-white hover:border-[#25D366] hover:shadow-[0_6px_22px_rgba(37,211,102,0.45)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366]"
                style={{ willChange: 'transform' }}
              >
                <span className="flex items-center justify-center">
                  <svg
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.9"
                    className="w-5 h-5 sm:w-6 sm:h-6"
                  >
                    <path d="M20.4 11.7a8.4 8.4 0 0 1-12.5 7.3L4 20l1.1-3.7A8.4 8.4 0 1 1 20.4 11.7Z" />
                    <path d="M8.7 8.6c.2-.4.4-.4.7-.4h.5c.2 0 .4.1.5.4l.7 1.7c.1.3.1.5-.1.7l-.5.6c.5.9 1.2 1.5 2.1 2l.6-.5c.2-.2.4-.2.7-.1l1.6.8c.3.1.4.3.3.6-.2.8-.8 1.4-1.6 1.5-1.1.1-2.9-.8-4.2-2.1-1.3-1.3-2.1-3-2-4.1 0-.5.3-.9.7-1.1Z" />
                  </svg>
                </span>

                {/* WhatsApp Corner Live Beacon */}
                <span className="absolute -bottom-0.5 -right-0.5 flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 border border-white" />
                </span>
              </a>

              {/* Flyout Tooltip */}
              <div className="pointer-events-none absolute right-full top-1/2 mr-3 -translate-y-1/2 translate-x-2 opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100 z-50 hidden sm:block whitespace-nowrap">
                <div className="rounded-xl border border-slate-700/60 bg-slate-900/95 px-3 py-2 text-white shadow-xl backdrop-blur-md">
                  <div className="flex items-center gap-1.5 text-xs font-bold">
                    <span>Chat on WhatsApp</span>
                    <span className="rounded-full bg-emerald-500/20 px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wider text-emerald-400">
                      Online
                    </span>
                  </div>
                  <div className="text-[10px] font-medium text-slate-300">
                    Instant Quote &amp; Parts Support
                  </div>
                </div>
              </div>
            </div>

            {/* 2. INSTAGRAM */}
            <div className="relative group flex items-center justify-center" role="listitem">
              <a
                ref={instaRef}
                href="https://www.instagram.com/sanjithloganathan/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow on Instagram"
                title="Follow on Instagram"
                className="relative inline-flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-xl border border-pink-200/80 bg-white text-[#E1306C] shadow-xs transition-colors duration-200 hover:bg-gradient-to-tr hover:from-[#FCAF45] hover:via-[#FD1D1D] hover:to-[#833AB4] hover:text-white hover:border-transparent hover:shadow-[0_6px_22px_rgba(225,48,108,0.45)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E1306C]"
                style={{ willChange: 'transform' }}
              >
                <span className="flex items-center justify-center">
                  <svg
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.9"
                    className="w-5 h-5 sm:w-6 sm:h-6"
                  >
                    <rect x="3" y="3" width="18" height="18" rx="5" />
                    <circle cx="12" cy="12" r="4" />
                    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
                  </svg>
                </span>
              </a>

              {/* Flyout Tooltip */}
              <div className="pointer-events-none absolute right-full top-1/2 mr-3 -translate-y-1/2 translate-x-2 opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100 z-50 hidden sm:block whitespace-nowrap">
                <div className="rounded-xl border border-slate-700/60 bg-slate-900/95 px-3 py-2 text-white shadow-xl backdrop-blur-md">
                  <div className="text-xs font-bold">Follow on Instagram</div>
                  <div className="text-[10px] font-medium text-slate-300">
                    @sanjithloganathan (Machine Reels)
                  </div>
                </div>
              </div>
            </div>

            {/* 3. FACEBOOK */}
            <div className="relative group flex items-center justify-center" role="listitem">
              <a
                ref={fbRef}
                href="https://www.facebook.com/profile.php?id=61593101758218"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="SL Laundry Tech Facebook Page"
                title="SL Laundry Tech Facebook Page"
                className="relative inline-flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-xl border border-blue-200/80 bg-white text-[#1877F2] shadow-xs transition-colors duration-200 hover:bg-[#1877F2] hover:text-white hover:border-[#1877F2] hover:shadow-[0_6px_22px_rgba(24,119,242,0.45)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1877F2]"
                style={{ willChange: 'transform' }}
              >
                <span className="flex items-center justify-center">
                  <svg
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    fill="currentColor"
                    className="w-5 h-5 sm:w-6 sm:h-6"
                  >
                    <path d="M14 8h3V4h-3c-3.3 0-5 2-5 5v3H6v4h3v8h4v-8h3.5l.5-4H13V9c0-.7.3-1 1-1Z" />
                  </svg>
                </span>
              </a>

              {/* Flyout Tooltip */}
              <div className="pointer-events-none absolute right-full top-1/2 mr-3 -translate-y-1/2 translate-x-2 opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100 z-50 hidden sm:block whitespace-nowrap">
                <div className="rounded-xl border border-slate-700/60 bg-slate-900/95 px-3 py-2 text-white shadow-xl backdrop-blur-md">
                  <div className="text-xs font-bold">Official Facebook</div>
                  <div className="text-[10px] font-medium text-slate-300">
                    Laundry Engineers Community
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* =========================================================
            COLLAPSED / MINIMIZED ANIMATED TEASER BADGE
        ========================================================= */
        <button
          type="button"
          aria-label="Open instant WhatsApp support and social channels"
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center gap-2 rounded-l-2xl border border-r-0 border-slate-200/90 bg-white p-2 sm:p-2.5 shadow-[0_8px_25px_rgba(0,43,139,0.14)] transition-transform duration-200 hover:-translate-x-1 cursor-pointer"
        >
          {/* Animated Attention Beacon */}
          <span className="absolute -left-1 -top-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-80" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 border border-white shadow-xs" />
          </span>

          {/* WhatsApp Icon */}
          <div className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-xl bg-[#25D366] text-white shadow-md shadow-emerald-500/30 group-hover:scale-105 transition-transform">
            <MessageCircle className="h-5 w-5 sm:h-6 sm:w-6" />
          </div>

          {/* Teaser Label */}
          <div className="hidden sm:flex flex-col items-start pr-1 text-left">
            <span className="text-xs font-black text-slate-800 leading-tight group-hover:text-[#002B8B] transition-colors">
              Chat with Us
            </span>
            <span className="text-[10px] font-bold text-emerald-600">
              Online 24/7
            </span>
          </div>
        </button>
      )}
    </aside>
  );
}