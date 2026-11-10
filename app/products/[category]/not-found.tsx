import Link from 'next/link';
import { ArrowLeft, Layers } from 'lucide-react';

export default function CategoryNotFound() {
  return (
    <div className="mx-auto max-w-xl py-20 px-4 text-center space-y-5">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-[#002B8B] border border-blue-100">
        <Layers className="w-7 h-7" />
      </div>
      <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
        Machinery Line Not Found
      </h1>
      <p className="text-sm text-slate-600 leading-relaxed">
        The product category you are looking for does not exist or may have moved. Browse all 6 commercial laundry machinery lines below.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
        <Link
          href="/products"
          className="inline-flex items-center gap-2 rounded-xl bg-[#002B8B] hover:bg-[#001f66] text-white font-bold text-xs px-5 py-3 transition-colors"
        >
          <span>Browse All Products</span>
        </Link>
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs px-5 py-3 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>
      </div>
    </div>
  );
}
