import React from "react";

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="w-12 h-12 rounded-full border-4 border-slate-200 border-t-blue-600 animate-spin"></div>
    </div>
  );
}