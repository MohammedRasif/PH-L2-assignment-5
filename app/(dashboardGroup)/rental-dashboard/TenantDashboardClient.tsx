"use client";

import React, { useState, useEffect } from "react";
import { getTenantRequestsAction, createPaymentAction } from "@/app/actions/requestActions";
import { CreditCard, Clock, CheckCircle2, XCircle, Home, Calendar, AlertCircle, RefreshCw } from "lucide-react";

interface TenantDashboardClientProps {
  user: any;
}

export default function TenantDashboardClient({ user }: TenantDashboardClientProps) {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [payingRequestId, setPayingRequestId] = useState<string | null>(null);
  const [paymentError, setPaymentError] = useState<{ [id: string]: string }>({});

  const fetchRequests = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await getTenantRequestsAction();
      if (res.success && Array.isArray(res.data)) {
        setRequests(res.data);
      } else {
        setError(res.message || "Failed to load rental requests.");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred while fetching requests.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handlePay = async (requestId: string) => {
    setPayingRequestId(requestId);
    setPaymentError((prev) => ({ ...prev, [requestId]: "" }));

    try {
      const res = await createPaymentAction(requestId, "STRIPE");
      if (res.success && res.data?.checkoutUrl) {
        // Redirect to Stripe checkout URL
        window.location.href = res.data.checkoutUrl;
      } else {
        setPaymentError((prev) => ({
          ...prev,
          [requestId]: res.message || "Failed to create payment checkout session.",
        }));
        setPayingRequestId(null);
      }
    } catch (err: any) {
      setPaymentError((prev) => ({
        ...prev,
        [requestId]: err.message || "An unexpected error occurred during payment setup.",
      }));
      setPayingRequestId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
            <Clock className="w-3.5 h-3.5" /> Pending Approval
          </span>
        );
      case "APPROVED":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5" /> Approved - Payment Required
          </span>
        );
      case "COMPLETED":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200">
            <CheckCircle2 className="w-3.5 h-3.5" /> Lease Completed
          </span>
        );
      case "REJECTED":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-200">
            <XCircle className="w-3.5 h-3.5" /> Request Rejected
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

  // Stats calculation
  const totalRequests = requests.length;
  const pendingRequests = requests.filter((r) => r.status === "PENDING").length;
  const approvedRequests = requests.filter((r) => r.status === "APPROVED").length;
  const completedRequests = requests.filter((r) => r.status === "COMPLETED").length;

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
            Tenant Dashboard
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Welcome back, <span className="font-semibold text-slate-800">{user.name}</span>. Track your rental requests and manage property payments.
          </p>
        </div>
        <button
          onClick={fetchRequests}
          disabled={loading}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer disabled:opacity-50 self-start md:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          <span>Refresh Requests</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm flex items-center gap-4">
          <div className="p-3.5 bg-blue-50 text-blue-600 rounded-xl">
            <Home className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Requests</p>
            <h3 className="text-2xl font-black text-slate-900 mt-1">{totalRequests}</h3>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm flex items-center gap-4">
          <div className="p-3.5 bg-amber-50 text-amber-600 rounded-xl">
            <Clock className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pending</p>
            <h3 className="text-2xl font-black text-slate-900 mt-1">{pendingRequests}</h3>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm flex items-center gap-4">
          <div className="p-3.5 bg-emerald-50 text-emerald-600 rounded-xl">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Action Needed</p>
            <h3 className="text-2xl font-black text-emerald-600 mt-1">{approvedRequests}</h3>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm flex items-center gap-4">
          <div className="p-3.5 bg-indigo-50 text-indigo-600 rounded-xl">
            <CreditCard className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Completed</p>
            <h3 className="text-2xl font-black text-slate-900 mt-1">{completedRequests}</h3>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-lg font-extrabold text-slate-900">My Rental Requests</h2>
            <p className="text-xs text-slate-500 mt-0.5">Status of properties you have submitted rent requests for</p>
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
              <div key={i} className="h-28 bg-slate-100 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : requests.length === 0 ? (
          <div className="text-center py-16 px-4">
            <span className="text-5xl block mb-3">🏡</span>
            <h3 className="text-lg font-bold text-slate-800">No Rental Requests Yet</h3>
            <p className="text-slate-500 text-sm mt-1 max-w-md mx-auto">
              You haven't requested any rental properties yet. Browse available listings and click "Submit Rent Request" to get started!
            </p>
            <a
              href="/properties"
              className="mt-6 inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2.5 rounded-xl text-sm transition-all shadow-sm"
            >
              Browse Properties
            </a>
          </div>
        ) : (
          <div className="grid gap-6">
            {requests.map((req) => {
              const prop = req.property || {};
              const isApproved = req.status === "APPROVED";
              const isCompleted = req.status === "COMPLETED";

              return (
                <div
                  key={req.id}
                  className={`rounded-2xl border transition-all p-6 ${
                    isApproved
                      ? "border-emerald-200 bg-emerald-50/20 shadow-sm"
                      : isCompleted
                      ? "border-blue-100 bg-blue-50/10"
                      : "border-slate-100 bg-white"
                  }`}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    {/* Property info */}
                    <div className="space-y-2 flex-1">
                      <div className="flex flex-wrap items-center gap-3">
                        {getStatusBadge(req.status)}
                        <span className="text-xs text-slate-400 font-medium">
                          Submitted on {new Date(req.createdAt).toLocaleDateString()}
                        </span>
                      </div>

                      <h3 className="text-xl font-bold text-slate-900">{prop.title || "Property Details"}</h3>

                      <p className="text-sm text-slate-600 line-clamp-2">{prop.description}</p>

                      <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-600 pt-1">
                        <span className="flex items-center gap-1">📍 {prop.location || "N/A"}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">🛏️ {prop.bedrooms || 0} Beds</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">🚿 {prop.bathrooms || 0} Baths</span>
                        <span>•</span>
                        <span className="text-blue-600 font-extrabold text-sm">৳ {prop.price?.toLocaleString()} / month</span>
                      </div>
                    </div>

                    {/* Price and Action Section */}
                    <div className="flex flex-col items-start lg:items-end justify-between border-t lg:border-t-0 pt-4 lg:pt-0 border-slate-100 shrink-0">
                      <div className="text-left lg:text-right mb-3">
                        <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold block">Monthly Price</span>
                        <span className="text-2xl font-black text-slate-900">৳ {prop.price?.toLocaleString()}</span>
                      </div>

                      {/* Payment Action if APPROVED */}
                      {isApproved && (
                        <div className="w-full lg:w-auto">
                          <button
                            onClick={() => handlePay(req.id)}
                            disabled={payingRequestId === req.id}
                            className="w-full lg:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-6 rounded-xl text-sm transition-all shadow-md shadow-emerald-500/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 hover:scale-[1.02] active:scale-[0.98]"
                          >
                            {payingRequestId === req.id ? (
                              <>
                                <span className="animate-spin inline-block w-4 h-4 border-2 border-current border-t-transparent text-white rounded-full"></span>
                                <span>Redirecting to Stripe...</span>
                              </>
                            ) : (
                              <>
                                <CreditCard className="w-4 h-4" />
                                <span>Pay Now</span>
                              </>
                            )}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Landlord accepted message for APPROVED status */}
                  {isApproved && (
                    <div className="mt-4 p-4 rounded-xl bg-emerald-100/70 border border-emerald-300 text-emerald-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">🎉</span>
                        <div>
                          <p className="text-sm font-bold">Landlord accepted your request!</p>
                          <p className="text-xs text-emerald-800 mt-0.5">
                            Please complete the payment above to finalize your rental agreement.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {paymentError[req.id] && (
                    <div className="mt-3 p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-semibold">
                      ⚠️ {paymentError[req.id]}
                    </div>
                  )}

                  {/* Payment Info display if COMPLETED */}
                  {isCompleted && req.payment && (
                    <div className="mt-4 p-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-emerald-600">✓ Payment Received</span>
                        <span className="text-slate-400">•</span>
                        <span className="font-mono text-slate-600">Txn: {req.payment.transactionId}</span>
                      </div>
                      <div className="flex items-center gap-3 font-semibold text-slate-700">
                        <span>Paid: ৳ {req.payment.amount?.toLocaleString()}</span>
                        <span>Provider: {req.payment.provider}</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
