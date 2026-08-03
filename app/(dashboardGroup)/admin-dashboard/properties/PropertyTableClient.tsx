"use client";

import React, { useState, useEffect } from "react";
import { getAdminPropertiesAction } from "../_actions/adminActions";
import { Search, MapPin, ChevronLeft, ChevronRight } from "lucide-react";

interface Category {
  id: string;
  name: string;
}

interface Owner {
  id: string;
  name: string;
  email: string;
}

interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  bedrooms: number;
  bathrooms: number;
  isAvailable: boolean;
  owner: Owner;
  category: Category;
  createdAt: string;
}

export default function PropertyTableClient() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // Pagination state (5 items per page)
  const ITEMS_PER_PAGE = 5;
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    async function loadProperties() {
      setIsLoading(true);
      setErrorMsg("");
      try {
        const res = await getAdminPropertiesAction();
        if (res.success && res.data) {
          setProperties(res.data);
        } else {
          setErrorMsg(res.message || "Failed to load properties list.");
        }
      } catch (err: any) {
        setErrorMsg(err.message || "An error occurred while fetching properties.");
      } finally {
        setIsLoading(false);
      }
    }
    loadProperties();
  }, []);

  // Reset to page 1 on search
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const filteredProperties = properties.filter((p) =>
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.owner?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredProperties.length / ITEMS_PER_PAGE) || 1;
  const paginatedProperties = filteredProperties.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Manage Properties</h1>
          <p className="text-sm text-slate-500 mt-1">
            Overview of all properties added to the platform, including specifications and landlord details.
          </p>
        </div>
      </div>



      {/* Table container */}
      {isLoading ? (
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-12 flex flex-col items-center justify-center min-h-[300px]">
          <div className="relative flex items-center justify-center mb-4">
            <div className="h-10 w-10 rounded-full border-4 border-slate-100 border-t-blue-600 animate-spin"></div>
          </div>
          <span className="text-xs text-slate-500 font-semibold animate-pulse">Loading properties...</span>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto w-full">
            <table className="min-w-full divide-y divide-slate-100 text-left text-sm whitespace-nowrap">
              <thead className="bg-slate-50/70 text-slate-500 text-xs font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-4 px-6">Property Title</th>
                  <th className="py-4 px-6">Location</th>
                  <th className="py-4 px-6">Landlord / Owner</th>
                  <th className="py-4 px-6">Category</th>
                  <th className="py-4 px-6">Price</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6">Created Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                {paginatedProperties.length > 0 ? (
                  paginatedProperties.map((property) => (
                    <tr key={property.id} className="hover:bg-slate-50/50 transition-colors">
                      {/* Title */}
                      <td className="py-4 px-6">
                        <div>
                          <div className="font-bold text-slate-900 line-clamp-1">{property.title}</div>
                          <div className="text-[10px] text-slate-400 font-normal">
                            {property.bedrooms} Beds • {property.bathrooms} Baths
                          </div>
                        </div>
                      </td>

                      {/* Location */}
                      <td className="py-4 px-6">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5 text-slate-400" /> {property.location}
                        </span>
                      </td>

                      {/* Owner */}
                      <td className="py-4 px-6">
                        {property.owner ? (
                          <div>
                            <div className="font-bold text-slate-900">{property.owner.name}</div>
                            <div className="text-[10px] text-slate-400 font-normal">{property.owner.email}</div>
                          </div>
                        ) : (
                          <span className="text-slate-400 italic">Unknown Owner</span>
                        )}
                      </td>

                      {/* Category */}
                      <td className="py-4 px-6">
                        <span className="bg-slate-100 text-slate-600 text-xs font-semibold px-2.5 py-1 rounded-md border border-slate-200/50">
                          {property.category?.name || "Apartment"}
                        </span>
                      </td>

                      {/* Price */}
                      <td className="py-4 px-6 font-bold text-slate-900">৳ {property.price.toLocaleString()}</td>

                      {/* Status */}
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                          property.isAvailable 
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-100" 
                            : "bg-rose-50 text-rose-700 border border-rose-100"
                        }`}>
                          {property.isAvailable ? "Available" : "Occupied"}
                        </span>
                      </td>

                      {/* Created Date */}
                      <td className="py-4 px-6 text-slate-500 font-normal">
                        {new Date(property.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-400 font-medium">
                      No matching properties found in the system database.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          {filteredProperties.length > 0 && (
            <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-semibold text-slate-600">
              <div>
                Showing <span className="font-extrabold text-slate-900">{(currentPage - 1) * ITEMS_PER_PAGE + 1}</span> to{" "}
                <span className="font-extrabold text-slate-900">{Math.min(currentPage * ITEMS_PER_PAGE, filteredProperties.length)}</span> of{" "}
                <span className="font-extrabold text-slate-900">{filteredProperties.length}</span> properties
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-all flex items-center gap-1"
                >
                  <ChevronLeft className="w-3.5 h-3.5" /> Previous
                </button>

                <div className="flex items-center gap-1 px-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`h-7 w-7 rounded-lg font-bold text-xs transition-all cursor-pointer ${
                        currentPage === page
                          ? "bg-blue-600 text-white shadow-xs"
                          : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-all flex items-center gap-1"
                >
                  Next <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
