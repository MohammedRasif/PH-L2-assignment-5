"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

export default function PaymentSuccessPage() {
  const [mounted, setMounted] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    setMounted(true);
    const timer = setTimeout(() => setShowConfetti(true), 300);
    return () => clearTimeout(timer);
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
        @keyframes checkDraw {
          from { stroke-dashoffset: 80; }
          to { stroke-dashoffset: 0; }
        }
        @keyframes circleDraw {
          from { stroke-dashoffset: 320; }
          to { stroke-dashoffset: 0; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
        }
        @keyframes confettiFall {
          0% { transform: translateY(-100vh) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
        @keyframes pulse-ring {
          0% { transform: scale(0.8); opacity: 0.5; }
          50% { transform: scale(1.1); opacity: 0.2; }
          100% { transform: scale(0.8); opacity: 0.5; }
        }
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .animate-fadeInUp { animation: fadeInUp 0.8s ease-out forwards; }
        .animate-fadeInUp-delay-1 { animation: fadeInUp 0.8s ease-out 0.2s forwards; opacity: 0; }
        .animate-fadeInUp-delay-2 { animation: fadeInUp 0.8s ease-out 0.4s forwards; opacity: 0; }
        .animate-fadeInUp-delay-3 { animation: fadeInUp 0.8s ease-out 0.6s forwards; opacity: 0; }
        .animate-scaleIn { animation: scaleIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
        .animate-float { animation: float 3s ease-in-out infinite; }
        .animate-pulse-ring { animation: pulse-ring 2s ease-in-out infinite; }
        .check-icon circle { stroke-dasharray: 320; animation: circleDraw 0.8s ease-out 0.3s forwards; stroke-dashoffset: 320; }
        .check-icon path { stroke-dasharray: 80; animation: checkDraw 0.5s ease-out 0.9s forwards; stroke-dashoffset: 80; }
        .confetti-piece {
          position: fixed;
          width: 10px;
          height: 10px;
          top: -20px;
          z-index: 100;
          border-radius: 2px;
        }
        .shimmer-btn {
          background: linear-gradient(90deg, #059669 0%, #10b981 25%, #34d399 50%, #10b981 75%, #059669 100%);
          background-size: 200% auto;
          animation: shimmer 3s linear infinite;
        }
      `}</style>

      {/* Confetti */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          {Array.from({ length: 50 }).map((_, i) => {
            const colors = ["#10b981", "#3b82f6", "#f59e0b", "#ec4899", "#8b5cf6", "#06b6d4", "#f43f5e"];
            const left = Math.random() * 100;
            const delay = Math.random() * 3;
            const duration = 2.5 + Math.random() * 2;
            const size = 6 + Math.random() * 10;
            const color = colors[Math.floor(Math.random() * colors.length)];
            return (
              <div
                key={i}
                className="confetti-piece"
                style={{
                  left: `${left}%`,
                  width: `${size}px`,
                  height: `${size * 0.6}px`,
                  backgroundColor: color,
                  animation: `confettiFall ${duration}s ease-in ${delay}s forwards`,
                  borderRadius: Math.random() > 0.5 ? "50%" : "2px",
                }}
              />
            );
          })}
        </div>
      )}

      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex items-center justify-center px-4 py-12 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-0 left-0 w-72 h-72 bg-emerald-200/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-teal-200/20 rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />
        <div className="absolute top-1/4 right-1/4 w-40 h-40 bg-emerald-300/10 rounded-full blur-2xl animate-pulse-ring" />

        <div className={`max-w-lg w-full text-center space-y-8 relative z-10 ${mounted ? "" : "opacity-0"}`}>
          {/* Animated Check Icon */}
          <div className="animate-scaleIn animate-float">
            <div className="mx-auto w-32 h-32 relative">
              {/* Glow ring */}
              <div className="absolute inset-0 rounded-full bg-emerald-400/20 animate-pulse-ring" />
              <svg
                className="check-icon w-32 h-32 mx-auto relative z-10"
                viewBox="0 0 100 100"
                fill="none"
              >
                <circle cx="50" cy="50" r="45" stroke="#10b981" strokeWidth="3" fill="none" />
                <path
                  d="M30 52 L44 66 L70 38"
                  stroke="#10b981"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
              </svg>
            </div>
          </div>

          {/* Success Text */}
          <div className="space-y-3 animate-fadeInUp-delay-1">
            <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
              Payment Successful!
            </h1>
            <p className="text-lg text-slate-600 max-w-md mx-auto leading-relaxed">
              Your rental payment has been processed securely through Stripe. Your lease is now active!
            </p>
          </div>

          {/* Info Card */}
          <div className="animate-fadeInUp-delay-2">
            <div className="mx-auto max-w-sm bg-white/80 backdrop-blur-sm rounded-3xl border border-emerald-100 shadow-lg shadow-emerald-500/5 p-6 space-y-4">
              <div className="flex items-center justify-center gap-2 text-emerald-700">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span className="text-sm font-bold">Transaction Verified</span>
              </div>

              <div className="h-px bg-gradient-to-r from-transparent via-emerald-200 to-transparent" />

              <div className="space-y-2.5 text-xs">
                <div className="flex items-center justify-between text-slate-600">
                  <span className="font-semibold">Payment Status</span>
                  <span className="font-extrabold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full">Completed</span>
                </div>
                <div className="flex items-center justify-between text-slate-600">
                  <span className="font-semibold">Payment Gateway</span>
                  <span className="font-bold text-slate-800">Stripe</span>
                </div>
                <div className="flex items-center justify-between text-slate-600">
                  <span className="font-semibold">Lease Status</span>
                  <span className="font-extrabold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full">Active</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="animate-fadeInUp-delay-3 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/rental-dashboard"
              className="shimmer-btn inline-flex items-center justify-center gap-2 text-white font-bold px-8 py-3.5 rounded-2xl text-sm shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/30 transition-all hover:scale-[1.03] active:scale-[0.97]"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span>Go to Dashboard</span>
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

          {/* Footer Note */}
          <p className="text-xs text-slate-400 pt-4 animate-fadeInUp-delay-3">
            A confirmation email with full payment details has been sent to your registered email address.
          </p>
        </div>
      </div>
    </>
  );
}
