"use client";

import React, { useState, useEffect } from "react";
import { getLandlordRequestsAction, updateLandlordRequestStatusAction } from "@/app/actions/requestActions";
import { Check, X, Clock, CheckCircle2, XCircle, Building2, User, RefreshCw, AlertCircle } from "lucide-react";

interface LandlordDashboardClientProps {
  user: any;
}

export default function LandlordDashboardClient({ user }: LandlordDashboardClientProps) {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [activeTab, setActiveTab] = useState<"ALL" | "PENDING" | "APPROVED" | "REJECTED" | "COMPLETED">("ALL");

  const fetchLandlordRequests = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await getLandlordRequestsAction();
      if (res.success && Array.isArray(res.data)) {
        setRequests(res.data);
      } else {
        setError(res.message || "Failed to load landlord requests.");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred while fetching requests.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLandlordRequests();
  }, []);

  const handleUpdateStatus = async (requestId: string, status: "APPROVED" | "REJECTED") => {
    setActionLoadingId(requestId);
    setToastMessage(null);

    try {
      const res = await updateLandlordRequestStatusAction(requestId, status);
      if (res?.success) {
        setToastMessage({
          type: "success",
          text: res.message || `Rental request ${status.toLowerCase()} successfully!`,
        });
        // Optimistically update status in local state
        setRequests((prev) =>
          prev.map((r) => (r.id === requestId ? { ...r, status: status } : r))
        );
      } else {
        setToastMessage({
          type: "error",
          text: res?.message || `Failed to update request status to ${status}.`,
        });
      }
    } catch (err: any) {
      setToastMessage({
        type: "error",
        text: err.message || "An unexpected error occurred while updating status.",
      });
    } finally {
      setActionLoadingId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
            <Clock className="w-3.5 h-3.5" /> Pending Review
          </span>
        );
      case "APPROVED":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5" /> Approved
          </span>
        );
      case "COMPLETED":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200">
            <CheckCircle2 className="w-3.5 h-3.5" /> Completed (Paid)
          </span>
        );
      case "REJECTED":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-200">
            <XCircle className="w-3.5 h-3.5" /> Rejected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-800 border border-slate-200">
            {status}
          </span>
        );
    }
  };

  // Filter requests
  const filteredRequests = activeTab === "ALL" 
    ? requests 
    : requests.filter((r) => r.status === activeTab);

  // Stats calculation
  const totalCount = requests.length;
  const pendingCount = requests.filter((r) => r.status === "PENDING").length;
  const approvedCount = requests.filter((r) => r.status === "APPROVED").length;
  const completedCount = requests.filter((r) => r.status === "COMPLETED").length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
            Landlord Dashboard
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Welcome back, <span className="font-semibold text-slate-800">{user.name}</span>. Manage tenant rental applications and property requests.
          </p>
        </div>
        <button
          onClick={fetchLandlordRequests}
          disabled={loading}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer disabled:opacity-50 self-start md:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          <span>Refresh List</span>
        </button>
      </div>

      {/* Global Toast Notification */}
      {toastMessage && (
        <div
          className={`p-4 rounded-xl border flex items-center justify-between shadow-sm transition-all animate-fadeIn ${
            toastMessage.type === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-800"
              : "bg-rose-50 border-rose-200 text-rose-800"
          }`}
        >
          <div className="flex items-center gap-3">
            <span className="text-xl">{toastMessage.type === "success" ? "✅" : "⚠️"}</span>
            <p className="text-sm font-semibold">{toastMessage.text}</p>
          </div>
          <button
            onClick={() => setToastMessage(null)}
            className="text-xs font-bold px-2 py-1 rounded hover:bg-black/5"
          >
            ✕
          </button>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm flex items-center gap-4">
          <div className="p-3.5 bg-blue-50 text-blue-600 rounded-xl">
            <Building2 className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Requests</p>
            <h3 className="text-2xl font-black text-slate-900 mt-1">{totalCount}</h3>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm flex items-center gap-4">
          <div className="p-3.5 bg-amber-50 text-amber-600 rounded-xl">
            <Clock className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pending Review</p>
            <h3 className="text-2xl font-black text-amber-600 mt-1">{pendingCount}</h3>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm flex items-center gap-4">
          <div className="p-3.5 bg-emerald-50 text-emerald-600 rounded-xl">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Approved</p>
            <h3 className="text-2xl font-black text-slate-900 mt-1">{approvedCount}</h3>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm flex items-center gap-4">
          <div className="p-3.5 bg-indigo-50 text-indigo-600 rounded-xl">
            <User className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Leases Completed</p>
            <h3 className="text-2xl font-black text-slate-900 mt-1">{completedCount}</h3>
          </div>
        </div>
      </div>

      {/* Main Request Container */}
      <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-lg font-extrabold text-slate-900">Incoming Tenant Applications</h2>
            <p className="text-xs text-slate-500 mt-0.5">Review and approve or reject rental requests for your properties</p>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl overflow-x-auto">
            {(["ALL", "PENDING", "APPROVED", "REJECTED", "COMPLETED"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all capitalize cursor-pointer whitespace-nowrap ${
                  activeTab === tab
                    ? "bg-white text-slate-900 shadow-xs"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                {tab.toLowerCase()}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-sm font-semibold flex items-center gap-3">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {loading ? (
          <div className="space-y-4 py-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-slate-100 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : filteredRequests.length === 0 ? (
          <div className="text-center py-16 px-4">
            <span className="text-5xl block mb-3">📬</span>
            <h3 className="text-lg font-bold text-slate-800">No Rental Requests Found</h3>
            <p className="text-slate-500 text-sm mt-1 max-w-md mx-auto">
              There are currently no rental requests under the selected filter.
            </p>
          </div>
        ) : (
          <div className="grid gap-6">
            {filteredRequests.map((req) => {
              const tenant = req.tenant || {};
              const prop = req.property || {};
              const isPending = req.status === "PENDING";

              return (
                <div
                  key={req.id}
                  className={`rounded-2xl border transition-all p-6 ${
                    isPending
                      ? "border-amber-200 bg-amber-50/10 shadow-xs"
                      : req.status === "APPROVED"
                      ? "border-emerald-200 bg-emerald-50/10"
                      : "border-slate-100 bg-white"
                  }`}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    {/* Details section */}
                    <div className="space-y-3 flex-1">
                      <div className="flex flex-wrap items-center gap-3">
                        {getStatusBadge(req.status)}
                        <span className="text-xs text-slate-400 font-medium">
                          Received on {new Date(req.createdAt).toLocaleDateString()}
                        </span>
                      </div>

                      {/* Property title & Location */}
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Property Requested</span>
                        <h3 className="text-xl font-bold text-slate-900 mt-0.5">{prop.title || "Property Listing"}</h3>
                        <p className="text-xs text-slate-500 mt-0.5">📍 {prop.location} • ৳ {prop.price?.toLocaleString()} / month</p>
                      </div>

                      {/* Tenant Card */}
                      <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-blue-100 text-blue-700 font-extrabold flex items-center justify-center text-sm shrink-0">
                          {tenant.name ? tenant.name.charAt(0).toUpperCase() : "T"}
                        </div>
                        <div className="flex flex-col text-xs min-w-0">
                          <span className="font-bold text-slate-800 truncate">{tenant.name || "Tenant Name"}</span>
                          <span className="text-slate-500 truncate">{tenant.email || "No email provided"}</span>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons for PENDING status */}
                    <div className="flex flex-col sm:flex-row lg:flex-col items-stretch lg:items-end justify-center gap-3 shrink-0 border-t lg:border-t-0 pt-4 lg:pt-0 border-slate-100">
                      {isPending ? (
                        <>
                          <button
                            onClick={() => handleUpdateStatus(req.id, "APPROVED")}
                            disabled={actionLoadingId === req.id}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-5 rounded-xl text-xs transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 hover:scale-[1.02] active:scale-[0.98]"
                          >
                            {actionLoadingId === req.id ? (
                              <span className="animate-spin inline-block w-3.5 h-3.5 border-2 border-current border-t-transparent text-white rounded-full"></span>
                            ) : (
                              <Check className="w-4 h-4" />
                            )}
                            <span>Approve Request</span>
                          </button>

                          <button
                            onClick={() => handleUpdateStatus(req.id, "REJECTED")}
                            disabled={actionLoadingId === req.id}
                            className="bg-white hover:bg-rose-50 border border-rose-200 text-rose-600 font-bold py-2.5 px-5 rounded-xl text-xs transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 hover:scale-[1.02] active:scale-[0.98]"
                          >
                            {actionLoadingId === req.id ? (
                              <span className="animate-spin inline-block w-3.5 h-3.5 border-2 border-current border-t-transparent text-rose-600 rounded-full"></span>
                            ) : (
                              <X className="w-4 h-4" />
                            )}
                            <span>Reject Request</span>
                          </button>
                        </>
                      ) : (
                        <div className="text-right text-xs font-semibold text-slate-500">
                          Status: <span className="font-bold text-slate-800">{req.status}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
