'use client';

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import {
  CheckCircle2,
  Clock,
  ExternalLink,
  MapPin,
  Phone,
  Printer,
  ShieldCheck,
  X,
} from 'lucide-react';
import { useCart } from './CartContext';

export default function EnquirySuccessModal() {
  const { submissionResult, setSubmissionResult, clearItems } = useCart();
  const modalBoxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!submissionResult || !modalBoxRef.current) return;
    gsap.fromTo(
      modalBoxRef.current,
      { scale: 0.88, opacity: 0, y: 20 },
      { scale: 1, opacity: 1, y: 0, duration: 0.42, ease: 'back.out(1.3)' }
    );
  }, [submissionResult]);

  if (!submissionResult) return null;

  const handleClose = () => {
    setSubmissionResult(null);
  };

  const generateWhatsAppMessage = () => {
    const lines = [
      `*New Equipment & Parts Enquiry: ${submissionResult.refId}*`,
      `*Customer:* ${submissionResult.fullName}`,
      `*Phone:* ${submissionResult.mobileNumber}`,
      submissionResult.companyName ? `*Company:* ${submissionResult.companyName}` : null,
      `*Location:* ${submissionResult.district}, ${submissionResult.state}`,
      `*Preferred Branch:* ${submissionResult.branch}`,
      `*Requirement Type:* ${submissionResult.serviceType}`,
      '',
      `*Selected Items (${submissionResult.items.length}):*`,
      ...submissionResult.items.map(
        (item, idx) =>
          `${idx + 1}. [${item.type.toUpperCase()}] ${item.title} (${item.subtitle}) - Qty: ${item.quantity}`,
      ),
      submissionResult.requirement ? `\n*Note:* ${submissionResult.requirement}` : '',
      `\n*Submitted via:* sllaundrytech.com on ${submissionResult.submittedAt}`,
    ].filter(Boolean);

    return encodeURIComponent(lines.join('\n'));
  };

  const whatsappUrl = `https://wa.me/918110012041?text=${generateWhatsAppMessage()}`;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div
        ref={modalBoxRef}
        className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-3xl border border-blue-100 bg-white p-5 sm:p-8 shadow-2xl text-slate-800"
      >
        {/* Top close button */}
        <button
          onClick={handleClose}
          className="absolute right-4 top-4 p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Success Header */}
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 ring-8 ring-emerald-50/60 mb-4 animate-in zoom-in-75 duration-300">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-[#002B8B] text-xs font-bold tracking-wider uppercase border border-blue-100">
            Enquiry Successfully Submitted
          </span>

          <h2 className="mt-2 text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
            Thank You, {submissionResult.fullName}!
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Your quotation request has been officially recorded with Reference ID:{' '}
            <span className="font-mono font-bold text-[#002B8B] bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
              {submissionResult.refId}
            </span>
          </p>
        </div>

        {/* SLA Notice Card */}
        <div className="mt-5 flex items-start gap-3 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50/70 p-4 border border-blue-100/80">
          <Clock className="w-5 h-5 text-[#002B8B] shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm text-slate-700 leading-relaxed">
            <span className="font-bold text-[#002B8B]">Estimated Response: </span>
            A senior commercial laundry technician from our{' '}
            <strong className="text-slate-900">{submissionResult.branch}</strong> team is reviewing
            your machine &amp; parts specifications and will connect with you within 15 minutes.
          </div>
        </div>

        {/* Customer & Location Summary */}
        <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-100">
          <div>
            <div className="text-slate-400 font-medium">Customer</div>
            <div className="font-semibold text-slate-800 mt-0.5 truncate">{submissionResult.fullName}</div>
          </div>
          <div>
            <div className="text-slate-400 font-medium">Contact Phone</div>
            <div className="font-semibold text-slate-800 mt-0.5">{submissionResult.mobileNumber}</div>
          </div>
          <div>
            <div className="text-slate-400 font-medium">District &amp; State</div>
            <div className="font-semibold text-slate-800 mt-0.5 truncate">
              {submissionResult.district}, {submissionResult.state}
            </div>
          </div>
          <div>
            <div className="text-slate-400 font-medium">Service Type</div>
            <div className="font-semibold text-[#002B8B] mt-0.5 truncate">
              {submissionResult.serviceType}
            </div>
          </div>
        </div>

        {/* Selected Items Breakdown */}
        <div className="mt-5">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <span>Requested Items Summary</span>
              <span className="bg-[#002B8B] text-white text-[11px] font-bold px-2 py-0.2 rounded-full">
                {submissionResult.items.length}
              </span>
            </h3>
            <span className="text-xs text-slate-400 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              100% Genuine OEM Sourced
            </span>
          </div>

          <div className="border border-slate-200/80 rounded-2xl overflow-hidden divide-y divide-slate-100 max-h-56 overflow-y-auto">
            {submissionResult.items.map((item) => (
              <div key={item.id} className="flex items-center gap-3 p-3 bg-white hover:bg-slate-50/60 transition-colors">
                <div className="relative h-12 w-12 shrink-0 rounded-xl bg-slate-100 overflow-hidden border border-slate-200">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${
                        item.type === 'machine'
                          ? 'bg-blue-100 text-[#002B8B]'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {item.type}
                    </span>
                    <h4 className="text-sm font-semibold text-slate-900 truncate">
                      {item.title}
                    </h4>
                  </div>
                  <p className="text-xs text-slate-500 truncate mt-0.5">{item.subtitle}</p>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2 py-1 rounded-md">
                    Qty: {item.quantity}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Note if any */}
        {submissionResult.requirement && (
          <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-600">
            <strong className="text-slate-800">Your Notes:</strong> {submissionResult.requirement}
          </div>
        )}

        {/* Actions Bar */}
        <div className="mt-6 flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-100">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-4 py-3 text-sm transition-all shadow-md shadow-emerald-600/20 hover:-translate-y-0.5"
          >
            <Image src="/WA.png" alt="WhatsApp" width={18} height={18} />
            <span>Send Copy via WhatsApp</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-70" />
          </a>

          <a
            href="tel:+919361624107"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 font-semibold px-4 py-3 text-sm transition-all"
          >
            <Phone className="w-4 h-4 text-[#002B8B]" />
            <span>Call Hotline</span>
          </a>

          <button
            onClick={() => window.print()}
            type="button"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 font-semibold px-4 py-3 text-sm transition-all"
            title="Print Quote Slip"
          >
            <Printer className="w-4 h-4" />
            <span className="hidden sm:inline">Print Slip</span>
          </button>
        </div>

        <div className="mt-4 text-center">
          <button
            onClick={() => {
              clearItems();
              handleClose();
            }}
            className="text-xs font-semibold text-slate-500 hover:text-[#002B8B] transition-colors underline"
          >
            Clear Selected Items &amp; Return to Catalog
          </button>
        </div>
      </div>
    </div>
  );
}
