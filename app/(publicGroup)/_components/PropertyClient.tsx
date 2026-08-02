"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { createRentalRequestAction } from "@/app/actions/requestActions";
import { toast } from "react-toastify";

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
  images?: string[];
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
  initialTenantRequests?: any[];
}

export default function PropertyClient({
  initialProperties,
  activeFilters,
  currentUser,
  initialTenantRequests = [],
}: PropertyClientProps) {
  const router = useRouter();
  const pathname = usePathname();

  // Console log property details as requested by user
  useEffect(() => {
    console.log("property details", initialProperties);
  }, [initialProperties]);

  // Search & Filter Input States initialized from active URL filters
  const [searchTerm, setSearchTerm] = useState(activeFilters.location || "");
  const [selectedCategory, setSelectedCategory] = useState(activeFilters.categoryId || "all");
  const [maxPrice, setMaxPrice] = useState(activeFilters.maxPrice || "");
  const [minBedrooms, setMinBedrooms] = useState(activeFilters.bedrooms || "all");

  // Rental request tracking state
  const [loadingPropertyId, setLoadingPropertyId] = useState<string | null>(null);
  const [requestedIds, setRequestedIds] = useState<Set<string>>(new Set());

  // Map propertyId -> request status (PENDING, APPROVED, COMPLETED, REJECTED)
  const [tenantRequestsMap, setTenantRequestsMap] = useState<{ [propId: string]: string }>(() => {
    const map: { [propId: string]: string } = {};
    initialTenantRequests.forEach((req) => {
      if (req.propertyId) {
        map[req.propertyId] = req.status;
      }
    });
    return map;
  });

  const handleSubmitRentRequest = async (propertyId: string, propertyTitle: string) => {
    setLoadingPropertyId(propertyId);
    try {
      const res = await createRentalRequestAction(propertyId);
      if (res?.success) {
        setRequestedIds((prev) => new Set(prev).add(propertyId));
        setTenantRequestsMap((prev) => ({ ...prev, [propertyId]: "PENDING" }));
        toast.success(res.message || `Rental request for "${propertyTitle}" submitted successfully!`);
      } else {
        toast.error(res?.message || "Failed to submit rental request.");
      }
    } catch (err: any) {
      toast.error(err.message || "An error occurred while submitting rental request.");
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
            {initialProperties.map((property) => {
              const displayImage = property.images && property.images.length > 0 ? property.images[0] : null;
              return (
                <Link 
                  key={property.id}
                  href={`/property/${property.id}`}
                  className="bg-white rounded-2xl overflow-hidden shadow-xs border border-slate-100 hover:shadow-xl hover:scale-[1.03] transition-all duration-300 ease-out cursor-pointer group flex flex-col h-full"
                >
                  {/* Card Image */}
                  <div className="h-56 relative bg-slate-50 overflow-hidden select-none">
                    {displayImage ? (
                      <img
                        src={displayImage}
                        alt={property.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center bg-slate-100 text-slate-450 group-hover:scale-105 transition-transform duration-500 ease-out">
                        <span className="text-5xl mb-2">🏡</span>
                        <span className="text-xs font-bold tracking-wide uppercase">No Image Available</span>
                      </div>
                    )}
                    
                    {/* Category Badge */}
                    {property.category?.name && (
                      <div className="absolute top-4 left-4">
                        <span className="bg-white/95 backdrop-blur-xs text-slate-800 text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider shadow-xs">
                          {property.category.name}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Card Body */}
                  <div className="p-6 flex flex-col flex-grow">
                    <h3 className="text-xl font-bold text-slate-900 mb-2 line-clamp-1 group-hover:text-blue-600 transition-colors">
                      {property.title}
                    </h3>
                    <p className="text-sm text-slate-500 line-clamp-3 leading-relaxed flex-grow">
                      {property.description}
                    </p>
                  </div>
                </Link>
              );
            })}
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
