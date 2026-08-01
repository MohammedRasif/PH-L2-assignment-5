"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

export default function PaymentCancelPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.3); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-4px); }
          20%, 40%, 60%, 80% { transform: translateX(4px); }
        }
        @keyframes crossDraw1 {
          from { stroke-dashoffset: 60; }
          to { stroke-dashoffset: 0; }
        }
        @keyframes crossDraw2 {
          from { stroke-dashoffset: 60; }
          to { stroke-dashoffset: 0; }
        }
        @keyframes circleDraw {
          from { stroke-dashoffset: 320; }
          to { stroke-dashoffset: 0; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes pulse-ring {
          0% { transform: scale(0.8); opacity: 0.5; }
          50% { transform: scale(1.15); opacity: 0.15; }
          100% { transform: scale(0.8); opacity: 0.5; }
        }
        @keyframes ripple {
          0% { transform: scale(1); opacity: 0.4; }
          100% { transform: scale(2.5); opacity: 0; }
        }
        .animate-fadeInUp { animation: fadeInUp 0.8s ease-out forwards; }
        .animate-fadeInUp-delay-1 { animation: fadeInUp 0.8s ease-out 0.25s forwards; opacity: 0; }
        .animate-fadeInUp-delay-2 { animation: fadeInUp 0.8s ease-out 0.5s forwards; opacity: 0; }
        .animate-fadeInUp-delay-3 { animation: fadeInUp 0.8s ease-out 0.7s forwards; opacity: 0; }
        .animate-scaleIn { animation: scaleIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
        .animate-shake { animation: shake 0.6s ease-in-out 1.2s; }
        .animate-float { animation: float 3.5s ease-in-out infinite; }
        .animate-pulse-ring { animation: pulse-ring 2s ease-in-out infinite; }
        .cross-icon circle {
          stroke-dasharray: 320;
          animation: circleDraw 0.8s ease-out 0.3s forwards;
          stroke-dashoffset: 320;
        }
        .cross-icon .line1 {
          stroke-dasharray: 60;
          animation: crossDraw1 0.4s ease-out 0.9s forwards;
          stroke-dashoffset: 60;
        }
        .cross-icon .line2 {
          stroke-dasharray: 60;
          animation: crossDraw2 0.4s ease-out 1.1s forwards;
          stroke-dashoffset: 60;
        }
        .ripple-circle {
          position: absolute;
          border-radius: 50%;
          border: 2px solid rgba(239, 68, 68, 0.15);
          animation: ripple 2.5s ease-out infinite;
        }
      `}</style>

      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-orange-50 flex items-center justify-center px-4 py-12 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-rose-200/15 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-orange-200/15 rounded-full blur-3xl -translate-x-1/3 translate-y-1/3" />
        <div className="absolute top-1/3 left-1/4 w-48 h-48 bg-rose-300/10 rounded-full blur-2xl animate-pulse-ring" />

        <div className={`max-w-lg w-full text-center space-y-8 relative z-10 ${mounted ? "" : "opacity-0"}`}>
          {/* Animated Cross Icon */}
          <div className="animate-scaleIn animate-shake animate-float">
            <div className="mx-auto w-32 h-32 relative">
              {/* Ripple rings */}
              <div className="ripple-circle" style={{ width: 128, height: 128, top: 0, left: 0 }} />
              <div className="ripple-circle" style={{ width: 128, height: 128, top: 0, left: 0, animationDelay: "0.8s" }} />

              {/* Glow ring */}
              <div className="absolute inset-0 rounded-full bg-rose-400/15 animate-pulse-ring" />

              <svg
                className="cross-icon w-32 h-32 mx-auto relative z-10"
                viewBox="0 0 100 100"
                fill="none"
              >
                <circle cx="50" cy="50" r="45" stroke="#ef4444" strokeWidth="3" fill="none" />
                <line className="line1" x1="35" y1="35" x2="65" y2="65" stroke="#ef4444" strokeWidth="4" strokeLinecap="round" />
                <line className="line2" x1="65" y1="35" x2="35" y2="65" stroke="#ef4444" strokeWidth="4" strokeLinecap="round" />
              </svg>
            </div>
          </div>

          {/* Cancel Text */}
          <div className="space-y-3 animate-fadeInUp-delay-1">
            <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
              Payment Cancelled
            </h1>
            <p className="text-lg text-slate-600 max-w-md mx-auto leading-relaxed">
              Your payment was not processed. No charges have been made to your account. You can try again whenever you're ready.
            </p>
          </div>

          {/* Info Card */}
          <div className="animate-fadeInUp-delay-2">
            <div className="mx-auto max-w-sm bg-white/80 backdrop-blur-sm rounded-3xl border border-rose-100 shadow-lg shadow-rose-500/5 p-6 space-y-4">
              <div className="flex items-center justify-center gap-2 text-rose-600">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <span className="text-sm font-bold">No Charges Applied</span>
              </div>

              <div className="h-px bg-gradient-to-r from-transparent via-rose-200 to-transparent" />

              <div className="space-y-2.5 text-xs">
                <div className="flex items-center justify-between text-slate-600">
                  <span className="font-semibold">Payment Status</span>
                  <span className="font-extrabold text-rose-600 bg-rose-50 px-2.5 py-0.5 rounded-full">Cancelled</span>
                </div>
                <div className="flex items-center justify-between text-slate-600">
                  <span className="font-semibold">Charge Amount</span>
                  <span className="font-bold text-slate-800">৳ 0.00</span>
                </div>
                <div className="flex items-center justify-between text-slate-600">
                  <span className="font-semibold">Rental Status</span>
                  <span className="font-extrabold text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded-full">Awaiting Payment</span>
                </div>
              </div>

              <div className="h-px bg-gradient-to-r from-transparent via-rose-200 to-transparent" />

              <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 text-left">
                <p className="text-[11px] text-amber-800 font-semibold leading-relaxed">
                  💡 <span className="font-bold">Tip:</span> Your approved rental request is still valid! Head to your dashboard to complete the payment at any time.
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="animate-fadeInUp-delay-3 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/rental-dashboard"
              className="inline-flex items-center justify-center gap-2 bg-rose-600 hover:bg-rose-700 text-white font-bold px-8 py-3.5 rounded-2xl text-sm shadow-lg shadow-rose-500/25 hover:shadow-xl hover:shadow-rose-500/30 transition-all hover:scale-[1.03] active:scale-[0.97]"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>Try Payment Again</span>
            </Link>

            <Link
              href="/property"
              className="inline-flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-700 font-bold px-8 py-3.5 rounded-2xl text-sm shadow-sm hover:bg-slate-50 hover:shadow-md transition-all hover:scale-[1.03] active:scale-[0.97]"
            >
              <span>Browse Properties</span>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>

          {/* Footer */}
          <p className="text-xs text-slate-400 pt-4 animate-fadeInUp-delay-3">
            Need help? Contact our support team for assistance with your rental payment.
          </p>
        </div>
      </div>
    </>
  );
}
