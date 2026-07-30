import React from "react";

export default function DashboardLoading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] w-full p-6">
      {/* Premium glowing double-ring spinner */}
      <div className="relative flex items-center justify-center mb-6">
        <div className="h-16 w-16 rounded-full border-4 border-slate-100 border-t-blue-600 animate-spin"></div>
        <div className="absolute h-10 w-10 rounded-full border-4 border-slate-100 border-b-indigo-500 animate-spin [animation-direction:reverse]"></div>
      </div>
      
      {/* Clean text indicators */}
      <h3 className="text-lg font-bold text-slate-800 tracking-tight">Syncing with server</h3>
      <p className="text-xs text-slate-400 mt-1 font-medium animate-pulse">
        Fetching latest real-time dashboard data...
      </p>

      {/* Mock skeleton layout placeholder to make it look like a dashboard loading */}
      <div className="w-full max-w-4xl mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 opacity-20">
        <div className="h-24 bg-slate-200 rounded-xl animate-pulse"></div>
        <div className="h-24 bg-slate-200 rounded-xl animate-pulse"></div>
        <div className="h-24 bg-slate-200 rounded-xl animate-pulse"></div>
      </div>
    </div>
  );
}
