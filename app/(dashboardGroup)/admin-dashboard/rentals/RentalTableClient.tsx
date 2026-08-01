"use client";

import React, { useState, useEffect } from "react";
import { getAdminRentalsAction } from "../_actions/adminActions";
import { Search, MapPin } from "lucide-react";

interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  bedrooms: number;
  bathrooms: number;
}

interface Tenant {
  id: string;
  name: string;
  email: string;
}

interface Payment {
  id: string;
  transactionId: string;
  amount: number;
  method: string;
  provider: string;
  status: string;
  paidAt: string | null;
}

interface RentalRequest {
  id: string;
  tenantId: string;
  propertyId: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  property: Property;
  tenant: Tenant;
  payment: Payment | null;
}

export default function RentalTableClient() {
  const [rentals, setRentals] = useState<RentalRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    async function loadRentals() {
      setIsLoading(true);
      setErrorMsg("");
      try {
        const res = await getAdminRentalsAction();
        if (res.success && res.data) {
          setRentals(res.data);
        } else {
          setErrorMsg(res.message || "Failed to load rentals list.");
        }
      } catch (err: any) {
        setErrorMsg(err.message || "An error occurred while fetching rentals.");
      } finally {
        setIsLoading(false);
      }
    }
    loadRentals();
  }, []);

  const filteredRentals = rentals.filter((r) =>
    r.property?.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.tenant?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.tenant?.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (r.payment?.transactionId && r.payment.transactionId.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Manage Rental Requests</h1>
          <p className="text-sm text-slate-500 mt-1">
            System overview of booking requests, approval states, and rental payment transactions.
          </p>
        </div>
      </div>

      {/* Filter and Search controls */}
      

      {/* Table container */}
      {isLoading ? (
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-12 flex flex-col items-center justify-center min-h-[300px]">
          <div className="relative flex items-center justify-center mb-4">
            <div className="h-10 w-10 rounded-full border-4 border-slate-100 border-t-blue-600 animate-spin"></div>
          </div>
          <span className="text-xs text-slate-500 font-semibold animate-pulse">Loading rental requests...</span>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto w-full">
            <table className="min-w-full divide-y divide-slate-100 text-left text-sm whitespace-nowrap">
                <thead className="bg-slate-55/70 text-slate-500 text-xs font-bold uppercase tracking-wider">
                  <tr>
                    <th className="py-4 px-6">Booked Home</th>
                    <th className="py-4 px-6">Tenant</th>
                    <th className="py-4 px-6">Rental Status</th>
                    <th className="py-4 px-6">Payment Details</th>
                    <th className="py-4 px-6">Booking Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                  {filteredRentals.length > 0 ? (
                    filteredRentals.map((rental) => (
                      <tr key={rental.id} className="hover:bg-slate-50/50 transition-colors">
                        {/* Property */}
                        <td className="py-4 px-6">
                          {rental.property ? (
                            <div>
                              <div className="font-bold text-slate-900 line-clamp-1">{rental.property.title}</div>
                              <div className="text-[10px] text-slate-400 font-normal flex items-center gap-1 mt-0.5">
                                <MapPin className="h-3 w-3 text-slate-400" /> {rental.property.location} • ৳ {rental.property.price.toLocaleString()}/mo
                              </div>
                            </div>
                          ) : (
                            <span className="text-slate-400 italic">Unknown Property</span>
                          )}
                        </td>

                        {/* Tenant */}
                        <td className="py-4 px-6">
                          {rental.tenant ? (
                            <div>
                              <div className="font-bold text-slate-900">{rental.tenant.name}</div>
                              <div className="text-[10px] text-slate-400 font-normal">{rental.tenant.email}</div>
                            </div>
                          ) : (
                            <span className="text-slate-400 italic">Unknown Tenant</span>
                          )}
                        </td>

                        {/* Rental Request Status */}
                        <td className="py-4 px-6">
                          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${rental.status === "COMPLETED"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                              : rental.status === "APPROVED"
                                ? "bg-blue-50 text-blue-700 border border-blue-100"
                                : rental.status === "PENDING"
                                  ? "bg-amber-50 text-amber-700 border border-amber-105"
                                  : "bg-rose-50 text-rose-700 border border-rose-100"
                            }`}>
                            {rental.status}
                          </span>
                        </td>

                        {/* Payment Details */}
                        <td className="py-4 px-6">
                          {rental.payment ? (
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className="text-slate-900 font-bold">৳ {rental.payment.amount.toLocaleString()}</span>
                                <span className={`text-[9px] font-extrabold px-1.5 rounded uppercase tracking-wider ${rental.payment.status === "COMPLETED"
                                    ? "bg-emerald-100 text-emerald-800"
                                    : "bg-amber-100 text-amber-800"
                                  }`}>
                                  {rental.payment.status}
                                </span>
                              </div>
                              <div className="text-[10px] text-slate-500 font-mono mt-0.5 truncate max-w-[150px] select-all" title={rental.payment.transactionId}>
                                TXID: {rental.payment.transactionId}
                              </div>
                              <div className="text-[9px] text-slate-400 mt-0.5 font-normal">
                                {rental.payment.provider} ({rental.payment.method})
                              </div>
                            </div>
                          ) : (
                            <span className="text-slate-400 italic font-normal text-xs">No Payment Made</span>
                          )}
                        </td>

                        {/* Booking date */}
                        <td className="py-4 px-6 text-slate-500 font-normal">
                          {new Date(rental.createdAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-slate-400 font-medium">
                        No matching rental requests found in the system database.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
      );
}
