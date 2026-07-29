import React from "react";
import { getMe } from "@/app/service/getMe";
import { redirect } from "next/navigation";

export default async function LandlordDashboardPage() {
  const user = await getMe();

  // Route security: Check if user is authenticated and has correct role
  if (!user) {
    redirect("/login");
  }

  if (user.role !== "LANDLORD") {
    redirect("/");
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Landlord Dashboard Overview</h1>
          <p className="text-sm text-slate-500 mt-1">
            Welcome back, <span className="font-semibold text-slate-800">{user.name}</span>. Here is your property and tenant summary.
          </p>
        </div>
      </div>

      {/* Mock Stats Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🏡</span>
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">My Listings</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">12</h3>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="text-3xl">💼</span>
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Leases</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">8</h3>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="text-3xl">📬</span>
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Pending Requests</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">3</h3>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="text-3xl">💵</span>
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Monthly Revenue</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">$4,250</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Details Card */}
      <div className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">My Landlord Profile</h2>
        <div className="mt-4 grid gap-6 sm:grid-cols-2">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Landlord Name</p>
            <p className="text-sm font-semibold text-slate-800 mt-1">{user.name}</p>
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Email Address</p>
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