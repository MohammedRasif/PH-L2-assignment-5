"use client";

import React, { useState, useEffect, useTransition } from "react";
import { createCategoryAction, getAdminCategoriesAction } from "../_actions/adminActions";
import { toast } from "react-toastify";
import { Tags, PlusCircle, Search, Layers, Loader2 } from "lucide-react";

interface Category {
  id: string;
  name: string;
  createdAt?: string;
  updatedAt?: string;
}

export default function CategoryClient() {
  const [name, setName] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isPending, startTransition] = useTransition();

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const res = await getAdminCategoriesAction();
      if (res.success && res.data) {
        setCategories(Array.isArray(res.data) ? res.data : []);
      } else if (Array.isArray(res)) {
        setCategories(res);
      } else {
        setCategories([]);
      }
    } catch (err: any) {
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedName = name.trim();
    if (!trimmedName) {
      toast.error("Please enter a category name.");
      return;
    }

    startTransition(async () => {
      try {
        const res = await createCategoryAction(trimmedName);

        if (res.success) {
          toast.success(res.message || "Property category uploaded successfully!");
          setName("");
          fetchCategories();
        } else {
          // Display the exact error message returned from the backend response
          toast.error(res.message || "Failed to upload category.");
        }
      } catch (err: any) {
        toast.error(err.message || "An unexpected error occurred.");
      }
    });
  };

  const filteredCategories = categories.filter((c) =>
    c.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <Tags className="h-6 w-6" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Property Categories
            </h1>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Create new property categories and manage existing categories for property listings.
          </p>
        </div>
      </div>

      {/* Main Grid: Upload Category Form + Existing Categories List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Upload Category Form Card */}
        <div className="lg:col-span-1 bg-white rounded-xl shadow-sm border border-slate-200/80 p-6 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <PlusCircle className="h-5 w-5 text-blue-600" />
              Upload Property Category
            </h2>
          
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="categoryName" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                Category Name <span className="text-rose-500">*</span>
              </label>
              <input
                id="categoryName"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. housee, apartment, villa"
                disabled={isPending}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all disabled:opacity-50"
              />
            </div>

            <button
              type="submit"
              disabled={isPending || !name.trim()}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-4 rounded-lg text-sm shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed hover:shadow hover:scale-[1.01] active:scale-[0.99]"
            >
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Uploading Category...</span>
                </>
              ) : (
                <>
                  <PlusCircle className="h-4 w-4" />
                  <span>Upload Category</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Existing Categories List Table */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200/80 overflow-hidden space-y-4">
          <div className="p-6 pb-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Layers className="h-5 w-5 text-blue-600" />
                Existing Categories
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Total {categories.length} categories configured in the system.
              </p>
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all"
              />
            </div>
          </div>

          {isLoading ? (
            <div className="p-12 flex flex-col items-center justify-center min-h-[250px]">
              <Loader2 className="h-8 w-8 text-blue-600 animate-spin mb-3" />
              <span className="text-xs text-slate-500 font-semibold animate-pulse">
                Loading categories...
              </span>
            </div>
          ) : (
            <div className="overflow-x-auto w-full">
              <table className="min-w-full divide-y divide-slate-100 text-left text-sm whitespace-nowrap">
                <thead className="bg-slate-50/70 text-slate-500 text-xs font-bold uppercase tracking-wider">
                  <tr>
                    <th className="py-3.5 px-6">#</th>
                    <th className="py-3.5 px-6">Category Name</th>
                    <th className="py-3.5 px-6 text-right">Created At</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                  {filteredCategories.length > 0 ? (
                    filteredCategories.map((cat, idx) => (
                      <tr key={cat.id || idx} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-4 px-6 text-xs text-slate-400 font-mono">{idx + 1}</td>
                        <td className="py-4 px-6 font-bold text-slate-900 capitalize flex items-center gap-2">
                          <span className="h-2 w-2 rounded-full bg-blue-500"></span>
                          {cat.name}
                        </td>
                        <td className="py-4 px-6 text-right text-xs text-slate-500">
                          {cat.createdAt
                            ? new Date(cat.createdAt).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              })
                            : "N/A"}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="py-12 text-center text-slate-400 font-medium">
                        No property categories found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
