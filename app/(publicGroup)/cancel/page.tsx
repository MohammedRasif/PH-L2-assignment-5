import React from "react";
import Link from "next/link";
import { XCircle, ArrowLeft } from "lucide-react";

export default function PaymentCancelPage() {
  return (
    <div className="bg-slate-50 min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-xl border border-slate-100 text-center space-y-6 animate-fadeIn">
        <div className="h-20 w-20 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
          <XCircle className="w-12 h-12" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-rose-600 bg-rose-50 px-3 py-1 rounded-full">
            Payment Cancelled
          </span>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight sm:text-3xl pt-2">
            Payment Not Completed
          </h1>
          <p className="text-slate-500 text-sm leading-relaxed">
            The payment process was cancelled or was not completed. You can try making the payment again anytime from your tenant dashboard.
          </p>
        </div>

        <div className="pt-4 border-t border-slate-100">
          <Link
            href="/rental-dashboard"
            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 px-6 rounded-2xl text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Tenant Dashboard</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
