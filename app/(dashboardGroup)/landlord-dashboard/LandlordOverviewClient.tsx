"use client";

import React, { useState, useEffect } from "react";
import { getLandlordRequestsAction } from "@/app/actions/requestActions";
import { getPropertiesAction } from "@/app/actions/propertyActions";
import {
  Building2,
  Clock,
  CheckCircle2,
  Banknote,
  FileText,
  ArrowRight,
  RefreshCw,
  Home,
  User,
} from "lucide-react";
import Link from "next/link";

interface LandlordOverviewClientProps {
  user: any;
}

export default function LandlordOverviewClient({ user }: LandlordOverviewClientProps) {
  const [properties, setProperties] = useState<any[]>([]);
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadOverviewData = async () => {
    setLoading(true);
    try {
      const [propsRes, reqsRes] = await Promise.all([
        getPropertiesAction(),
        getLandlordRequestsAction(),
      ]);

      if (propsRes.success && Array.isArray(propsRes.data)) {
        const landlordProps = propsRes.data.filter(
          (p: any) => p.ownerId === user.id || p.owner?.id === user.id
        );
        setProperties(landlordProps.length > 0 ? landlordProps : propsRes.data);
      }

      if (reqsRes.success && Array.isArray(reqsRes.data)) {
        setRequests(reqsRes.data);
      }
    } catch (err) {
      console.error("Error loading landlord overview data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOverviewData();
  }, []);

  // Compute key stats
  const totalProperties = properties.length;
  const activeRequests = requests.filter((r) => r.status === "PENDING" || r.status === "APPROVED").length;
  const pendingRequests = requests.filter((r) => r.status === "PENDING").length;

  // Calculate Total Earnings from completed rental payments
  const totalEarnings = requests.reduce((sum, req) => {
    if (req.payment && req.payment.status === "COMPLETED") {
      return sum + (req.payment.amount || 0);
    }
    return sum;
  }, 0);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
            Landlord Overview
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Welcome back, <span className="font-semibold text-slate-800">{user.name}</span>. Summary of your property portfolio, active requests, and revenue.
          </p>
        </div>

        <button
          onClick={loadOverviewData}
          disabled={loading}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer disabled:opacity-50 self-start md:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* Primary Overview Stats Grid (Properties, Active Requests, Earnings) */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {/* Total Properties */}
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Properties</p>
            <h3 className="text-3xl font-black text-slate-900">{totalProperties}</h3>
            <p className="text-xs text-slate-500">
              {properties.filter((p) => p.isAvailable).length} Available • {properties.filter((p) => !p.isAvailable).length} Booked
            </p>
          </div>
          <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl">
            <Building2 className="h-7 w-7" />
          </div>
        </div>

        {/* Active Requests */}
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Requests</p>
            <h3 className="text-3xl font-black text-amber-600">{activeRequests}</h3>
            <p className="text-xs text-slate-500">{pendingRequests} Pending Review</p>
          </div>
          <div className="p-4 bg-amber-50 text-amber-600 rounded-2xl">
            <Clock className="h-7 w-7" />
          </div>
        </div>

        {/* Total Earnings */}
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm flex items-center justify-between sm:col-span-2 lg:col-span-1">
          <div className="space-y-1">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Earnings</p>
            <h3 className="text-3xl font-black text-emerald-600">৳ {totalEarnings.toLocaleString()}</h3>
            <p className="text-xs text-slate-500">From completed Stripe payments</p>
          </div>
          <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl">
            <Banknote className="h-7 w-7" />
          </div>
        </div>
      </div>

      {/* Navigation Quick Cards (Property Management & Request Management) */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Card 1: Property Management */}
        <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm flex flex-col justify-between space-y-4 hover:shadow-md transition-all">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                <Home className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-extrabold text-slate-900">Property Management</h3>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Create new property listings, edit details, toggle availability, and remove old listings.
            </p>
          </div>
          <Link
            href="/landlord-dashboard/my-properties"
            className="inline-flex items-center justify-center gap-2 w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-500/20 transition-all cursor-pointer"
          >
            <span>Manage Listings</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Card 2: Request Management */}
        <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm flex flex-col justify-between space-y-4 hover:shadow-md transition-all">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-extrabold text-slate-900">Request Management</h3>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              View dedicated table of incoming tenant applications with Approve and Reject action controls.
            </p>
          </div>
          <Link
            href="/landlord-dashboard/requests"
            className="inline-flex items-center justify-center gap-2 w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md shadow-indigo-500/20 transition-all cursor-pointer"
          >
            <span>View Tenant Applications</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Recent Properties Preview */}
      <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-base font-extrabold text-slate-900">My Properties Summary</h3>
          <Link
            href="/landlord-dashboard/my-properties"
            className="text-xs font-bold text-blue-600 hover:underline"
          >
            View All →
          </Link>
        </div>

        {loading ? (
          <div className="h-20 bg-slate-100 rounded-xl animate-pulse" />
        ) : properties.length === 0 ? (
          <p className="text-xs text-slate-400 py-4 text-center">No properties listed yet.</p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {properties.slice(0, 3).map((prop) => (
              <div key={prop.id} className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/50 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">{prop.category?.name}</span>
                  <h4 className="text-sm font-bold text-slate-900 truncate">{prop.title}</h4>
                </div>
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-200/60 text-xs font-semibold">
                  <span className="text-slate-500">📍 {prop.location}</span>
                  <span className="text-blue-600">৳ {prop.price?.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
