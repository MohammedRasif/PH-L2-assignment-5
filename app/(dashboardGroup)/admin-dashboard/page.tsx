import React from "react";
import { getMe } from "@/app/service/getMe";
import { redirect } from "next/navigation";

export default async function AdminDashboardPage() {
  const user = await getMe();

  // Route security: Check if user is authenticated and has correct role
  if (!user) {
    redirect("/login");
  }

  if (user.role !== "ADMIN") {
    redirect("/");
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Admin Dashboard Overview</h1>
          <p className="text-sm text-slate-500 mt-1">
            Welcome back, <span className="font-semibold text-slate-800">{user.name}</span>. Here is your system health summary.
          </p>
        </div>
      </div>

      {/* Mock Stats Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="text-3xl">👥</span>
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Users</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">1,248</h3>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🏡</span>
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Approved Properties</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">842</h3>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="text-3xl">📜</span>
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Rents</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">481</h3>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="text-3xl">💰</span>
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Platform Earnings</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">$14,820</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Details Card */}
      <div className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">My System Profile</h2>
        <div className="mt-4 grid gap-6 sm:grid-cols-2">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Admin Name</p>
            <p className="text-sm font-semibold text-slate-800 mt-1">{user.name}</p>
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Admin Email</p>
            <p className="text-sm font-semibold text-slate-800 mt-1">{user.email}</p>
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Role Access</p>
            <p className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700 mt-1">
              {user.role}
            </p>
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Account ID</p>
            <p className="text-sm font-mono text-slate-600 mt-1 text-xs">{user.id}</p>
          </div>
        </div>
      </div>
    </div>
  );
}