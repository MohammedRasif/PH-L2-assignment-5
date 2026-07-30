"use client";

import React, { useState, useEffect } from "react";
import { getAdminUsersAction, getAdminPropertiesAction, getAdminRentalsAction } from "./_actions/adminActions";

interface AdminOverviewClientProps {
  user: any;
}

export default function AdminOverviewClient({ user }: AdminOverviewClientProps) {
  const [usersList, setUsersList] = useState<any[]>([]);
  const [propertiesList, setPropertiesList] = useState<any[]>([]);
  const [rentalsList, setRentalsList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function loadStats() {
      setIsLoading(true);
      setErrorMessage("");
      try {
        const [usersRes, propertiesRes, rentalsRes] = await Promise.all([
          getAdminUsersAction(),
          getAdminPropertiesAction(),
          getAdminRentalsAction(),
        ]);

        if (usersRes.success && usersRes.data) setUsersList(usersRes.data);
        if (propertiesRes.success && propertiesRes.data) setPropertiesList(propertiesRes.data);
        if (rentalsRes.success && rentalsRes.data) setRentalsList(rentalsRes.data);

        if (!usersRes.success || !propertiesRes.success || !rentalsRes.success) {
          setErrorMessage("Failed to load some dashboard data. Showing available details.");
        }
      } catch (err: any) {
        setErrorMessage(err.message || "Failed to load real-time statistics.");
      } finally {
        setIsLoading(false);
      }
    }
    loadStats();
  }, []);

  // Calculate earnings from completed rental payments
  const platformEarnings = rentalsList.reduce((sum, rental) => {
    if (rental.payment && rental.payment.status === "COMPLETED") {
      return sum + (rental.payment.amount || 0);
    }
    return sum;
  }, 0);

  // Group counts by role
  const landlordsCount = usersList.filter(u => u.role === "LANDLORD").length;
  const tenantsCount = usersList.filter(u => u.role === "TENANT").length;

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

      {errorMessage && (
        <div className="p-4 bg-amber-50 border border-amber-200 text-amber-800 rounded-xl text-sm font-medium">
          ⚠️ {errorMessage}
        </div>
      )}

      {isLoading ? (
        /* Glowing loader cards */
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm flex items-center gap-4 animate-pulse">
              <div className="h-12 w-12 rounded-xl bg-slate-100"></div>
              <div className="flex-1 space-y-2">
                <div className="h-3 bg-slate-100 rounded w-1/2"></div>
                <div className="h-6 bg-slate-100 rounded w-3/4"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Stats Grid */
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 animate-fadeIn">
          {/* Total Users */}
          <div className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <span className="text-3xl bg-blue-50 p-2.5 rounded-xl">👥</span>
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Users</p>
                <h3 className="text-2xl font-bold text-slate-900 mt-1">{usersList.length}</h3>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  {landlordsCount} Landlords • {tenantsCount} Tenants
                </p>
              </div>
            </div>
          </div>

          {/* Total Properties */}
          <div className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <span className="text-3xl bg-emerald-50 p-2.5 rounded-xl">🏡</span>
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Properties</p>
                <h3 className="text-2xl font-bold text-slate-900 mt-1">{propertiesList.length}</h3>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  {propertiesList.filter(p => p.isAvailable).length} Available • {propertiesList.filter(p => !p.isAvailable).length} Booked
                </p>
              </div>
            </div>
          </div>

          {/* Total Rentals */}
          <div className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <span className="text-3xl bg-violet-50 p-2.5 rounded-xl">📜</span>
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Rental Requests</p>
                <h3 className="text-2xl font-bold text-slate-900 mt-1">{rentalsList.length}</h3>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  {rentalsList.filter(r => r.status === "PENDING").length} Pending • {rentalsList.filter(r => r.status === "COMPLETED").length} Completed
                </p>
              </div>
            </div>
          </div>

          {/* Platform Earnings */}
          <div className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <span className="text-3xl bg-amber-50 p-2.5 rounded-xl">৳</span>
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Platform Earnings</p>
                <h3 className="text-2xl font-bold text-slate-900 mt-1">৳ {platformEarnings.toLocaleString()}</h3>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  From completed stripe transactions
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

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
