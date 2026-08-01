"use client";

import React, { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { createRentalRequestAction } from "@/app/actions/requestActions";

interface Category {
  id: string;
  name: string;
}

interface Owner {
  id: string;
  name: string;
  email: string;
  role: string;
  activeStatus: string;
}

interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  bedrooms: number;
  bathrooms: number;
  amenities: string[];
  isAvailable: boolean;
  category: Category;
  owner: Owner;
}

interface PropertyClientProps {
  initialProperties: Property[];
  activeFilters: {
    location?: string;
    minPrice?: string;
    maxPrice?: string;
    categoryId?: string;
    bedrooms?: string;
    amenities?: string;
  };
  currentUser?: any;
}

export default function PropertyClient({ initialProperties, activeFilters, currentUser }: PropertyClientProps) {
  const router = useRouter();
  const pathname = usePathname();

  // Search & Filter Input States initialized from active URL filters
  const [searchTerm, setSearchTerm] = useState(activeFilters.location || "");
  const [selectedCategory, setSelectedCategory] = useState(activeFilters.categoryId || "all");
  const [maxPrice, setMaxPrice] = useState(activeFilters.maxPrice || "");
  const [minBedrooms, setMinBedrooms] = useState(activeFilters.bedrooms || "all");

  // Rental request tracking state
  const [loadingPropertyId, setLoadingPropertyId] = useState<string | null>(null);
  const [requestedIds, setRequestedIds] = useState<Set<string>>(new Set());
  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const handleSubmitRentRequest = async (propertyId: string, propertyTitle: string) => {
    setLoadingPropertyId(propertyId);
    setNotification(null);
    try {
      const res = await createRentalRequestAction(propertyId);
      if (res?.success) {
        setRequestedIds((prev) => new Set(prev).add(propertyId));
        setNotification({
          type: "success",
          message: res.message || `Rental request for "${propertyTitle}" submitted successfully!`,
        });
      } else {
        setNotification({
          type: "error",
          message: res?.message || "Failed to submit rental request.",
        });
      }
    } catch (err: any) {
      setNotification({
        type: "error",
        message: err.message || "An error occurred while submitting rental request.",
      });
    } finally {
      setLoadingPropertyId(null);
    }
  };

  const [availableCategories] = useState(() => {
    const map = new Map<string, string>(); 
    initialProperties.forEach((p) => {
      if (p.category?.id && p.category?.name) {
        map.set(p.category.id, p.category.name);
      }
    });
    return Array.from(map.entries()).map(([id, name]) => ({ id, name }));
  });

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    const queryParams = new URLSearchParams();

    if (searchTerm.trim()) {
      queryParams.append("location", searchTerm.trim());
    }

    // Map category ID
    if (selectedCategory && selectedCategory !== "all") {
      queryParams.append("categoryId", selectedCategory);
    }

    if (maxPrice.trim()) {
      queryParams.append("maxPrice", maxPrice.trim());
    }

    if (minBedrooms && minBedrooms !== "all") {
      queryParams.append("bedrooms", minBedrooms);
    }

    
    router.push(`${pathname}?${queryParams.toString()}`);
  };

  const handleReset = () => {
    setSearchTerm("");
    setSelectedCategory("all");
    setMaxPrice("");
    setMinBedrooms("all");
    router.push(pathname); 
  };

  return (
    <div className="bg-slate-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight sm:text-5xl">
            Find Your Dream Home
          </h1>
          <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
            Browse through our premium, verified property listings. Real-time updates directly from landlords and owners.
          </p>
        </div>

        {/* Global Notification Banner */}
        {notification && (
          <div
            className={`mb-8 p-4 rounded-xl border flex items-center justify-between shadow-sm transition-all animate-fadeIn ${
              notification.type === "success"
                ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                : "bg-rose-50 border-rose-200 text-rose-800"
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-xl">{notification.type === "success" ? "✅" : "⚠️"}</span>
              <p className="text-sm font-semibold">{notification.message}</p>
            </div>
            <button
              onClick={() => setNotification(null)}
              className="text-xs font-bold px-2 py-1 rounded hover:bg-black/5"
            >
              ✕
            </button>
          </div>
        )}

        {/* Search and Filters Card */}
        <form onSubmit={handleSearch} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 mb-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
            
            {/* Search Input */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Location Name</label>
              <input
                type="text"
                placeholder="e.g. Dhaka, Chittagong..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm transition-all"
              />
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white cursor-pointer capitalize"
              >
                <option value="all">All Categories</option>
                {availableCategories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Max Budget (BDT)</label>
              <input
                type="number"
                placeholder="e.g. 30000"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
        
            <div>
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-xl text-[18px] transition-all shadow-sm flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              >
                 Search & Filter
              </button>
            </div>

          </div>

          <div className="flex items-center justify-between mt-6">
            {(searchTerm || selectedCategory !== "all" || maxPrice || minBedrooms !== "all") && (
              <button
                type="button"
                onClick={handleReset}
                className="text-xs font-bold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-all cursor-pointer"
              >
                Clear Filters
              </button>
            )}
          </div>
        </form>

        {/* Properties Grid */}
        {initialProperties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {initialProperties.map((property) => (
              <div 
                key={property.id}
                className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-md transition-all duration-300 group flex flex-col h-full"
              >
                {/* Visual Header / Mock Image Grid */}
                <div className="h-48 relative bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center p-6 text-white overflow-hidden">
                  <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>
                  
                  {/* Category and Availability Badge */}
                  <div className="absolute top-4 left-4 flex flex-col gap-2">
                    <span className="bg-white/95 backdrop-blur-sm text-slate-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                      {property.category?.name || "Home"}
                    </span>
                    <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full tracking-wider uppercase self-start shadow-sm ${
                      property.isAvailable 
                        ? "bg-emerald-500 text-white" 
                        : "bg-rose-500 text-white"
                    }`}>
                      {property.isAvailable ? "Available" : "Occupied"}
                    </span>
                  </div>
                  {/* Icon Representation */}
                  <div className="transform group-hover:scale-110 transition-transform duration-300 text-center">
                    <span className="text-7xl filter drop-shadow-md">🏡</span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6 flex flex-col flex-grow">
                  {/* Title & Location */}
                  <div className="mb-4">
                   <div className="flex items-center justify-between">
                     <div className="flex items-center gap-1 text-blue-600 text-xs font-semibold mb-1 uppercase tracking-wider">
                      <span>📍</span> {property.location}
                    </div>
                    <div className="text-lg font-black tracking-tight">৳ {property.price.toLocaleString()}</div>

                   </div>
                    <h3 className="text-xl font-bold text-slate-900 line-clamp-1 group-hover:text-blue-600 transition-colors">
                      {property.title}
                    </h3>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-slate-500 mb-6 line-clamp-2 leading-relaxed flex-grow">
                    {property.description}
                  </p>

                  {/* Key Specifications (Beds, Baths) */}
                  <div className="grid grid-cols-2 gap-4 py-3 px-4 rounded-xl bg-slate-50 border border-slate-100 mb-4 text-slate-600 text-sm font-semibold">
                    <div className="flex items-center justify-center gap-2">
                      <span>🛏️</span> {property.bedrooms} {property.bedrooms === 1 ? "Bedroom" : "Bedrooms"}
                    </div>
                    <div className="flex items-center justify-center gap-2 border-l border-slate-200">
                      <span>🚿</span> {property.bathrooms} {property.bathrooms === 1 ? "Bathroom" : "Bathrooms"}
                    </div>
                  </div>

                  {/* Amenities List */}
                  {property.amenities?.length > 0 && (
                    <div className="mb-6">
                      <div className="flex flex-wrap gap-1.5">
                        {property.amenities.map((amenity, idx) => (
                          <span 
                            key={idx}
                            className="bg-slate-100 text-slate-600 text-[10px] font-bold px-2.5 py-1 rounded-md border border-slate-200/50"
                          >
                            ⚡ {amenity}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Submit Rent Request Button for TENANT role */}
                  {currentUser?.role === "TENANT" && (
                    <div className="mt-auto pt-4 border-t border-slate-100">
                      <button
                        type="button"
                        disabled={loadingPropertyId === property.id || requestedIds.has(property.id)}
                        onClick={() => handleSubmitRentRequest(property.id, property.title)}
                        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-emerald-600 text-white font-bold py-2.5 px-4 rounded-xl text-sm transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed hover:scale-[1.01] active:scale-[0.99]"
                      >
                        {loadingPropertyId === property.id ? (
                          <>
                            <span className="animate-spin inline-block w-4 h-4 border-2 border-current border-t-transparent text-white rounded-full"></span>
                            <span>Submitting Request...</span>
                          </>
                        ) : requestedIds.has(property.id) ? (
                          <>
                            <span>✓</span>
                            <span>Request Sent</span>
                          </>
                        ) : (
                          <>
                            <span>📩</span>
                            <span>Submit Rent Request</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white border border-slate-150 rounded-2xl p-16 text-center shadow-sm">
            <span className="text-6xl mb-4 block">🔍</span>
            <h3 className="text-xl font-bold text-slate-800">No properties found</h3>
            <p className="text-slate-500 mt-2 max-w-sm mx-auto text-sm">
              We couldn't find any properties matching your current criteria on the server. Try resetting or broadening your filters.
            </p>
            <button
              type="button"
              onClick={handleReset}
              className="mt-6 inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2.5 rounded-xl text-sm transition-all shadow-sm cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
