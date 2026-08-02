import React from "react";
import { getMe } from "@/app/service/getMe";
import { redirect } from "next/navigation";
import { getTenantRequests } from "@/app/service/requestService";

export const dynamic = "force-dynamic";

export default async function TenantPaymentHistoryPage() {
  const user = await getMe();

  if (!user) {
    redirect("/login");
  }

  if (user.role !== "TENANT") {
    redirect("/");
  }

  let requests: any[] = [];
  try {
    requests = await getTenantRequests();
  } catch (err) {
    console.error("Failed to load requests in payment history page:", err);
  }

  const completedPayments = requests.filter((r) => r.status === "COMPLETED" && r.payment);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
          Payment History
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Records of successful payments for your active leases
        </p>
      </div>

      {/* Payment History Card */}
      <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm space-y-4">
        {completedPayments.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-slate-100 rounded-xl text-slate-400 text-sm select-none">
            <span className="text-4xl block mb-2">💳</span>
            No payment transactions found.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-slate-100">
            <table className="min-w-full divide-y divide-slate-100 text-left text-sm">
              <thead className="bg-slate-50 text-slate-500 text-xs font-bold uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-3">Property</th>
                  <th className="px-6 py-3">Transaction ID</th>
                  <th className="px-6 py-3">Amount</th>
                  <th className="px-6 py-3">Provider</th>
                  <th className="px-6 py-3">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {completedPayments.map((req: any) => (
                  <tr key={req.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-800 break-words">{req.property?.title || "Property"}</td>
                    <td className="px-6 py-4 font-mono text-xs text-slate-500 break-all">{req.payment?.transactionId || "N/A"}</td>
                    <td className="px-6 py-4 font-extrabold text-emerald-600">৳ {req.payment?.amount?.toLocaleString()} BDT</td>
                    <td className="px-6 py-4 text-xs font-bold text-slate-600">{req.payment?.provider || "STRIPE"}</td>
                    <td className="px-6 py-4 text-slate-500 text-xs">
                      {new Date(req.payment?.createdAt || req.updatedAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
