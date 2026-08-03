"use client";

import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { FolderPlus, Tag, Loader2, CheckCircle2, AlertCircle, RefreshCw } from "lucide-react";
import { getCategoriesAction } from "@/app/actions/propertyActions";
import { createCategoryAction } from "./_actions/adminActions";

interface AdminCategoriesClientProps {
  user?: any;
}

export default function AdminCategoriesClient({ user }: AdminCategoriesClientProps) {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [fetching, setFetching] = useState(true);
  const [apiResponse, setApiResponse] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const fetchExistingCategories = async () => {
    setFetching(true);
    try {
      const res = await getCategoriesAction();
      if (res.success && Array.isArray(res.data)) {
        setCategories(res.data);
      }
    } catch (err: any) {
      
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchExistingCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Please enter a category name.");
      return;
    }

    setLoading(true);
    setApiResponse(null);

    try {
      // Calls server action -> POST ${baseUrl}/api/categories with body { name }
      const res = await createCategoryAction(name.trim());

      if (res?.success) {
        const successMsg = res?.message || `Category "${name.trim()}" created successfully!`;
        toast.success(successMsg);
        setApiResponse({
          type: "success",
          message: successMsg,
        });
        setName("");
        fetchExistingCategories();
      } else {
        const errorMsg = res?.message || "Failed to create category.";
        toast.error(errorMsg);
        setApiResponse({
          type: "error",
          message: errorMsg,
        });
      }
    } catch (err: any) {
      const errorMsg = err?.message || "An unexpected error occurred while creating category.";
      toast.error(errorMsg);
      setApiResponse({
        type: "error",
        message: errorMsg,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto space-y-8">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/80 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <FolderPlus className="h-6 w-6" />
            </span>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
              Upload Property Category
            </h1>
          </div>
        </div>

        <button
          onClick={fetchExistingCategories}
          disabled={fetching}
          className="self-start md:self-auto flex items-center gap-2 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-2 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${fetching ? "animate-spin text-blue-600" : ""}`} />
          <span>Refresh Categories</span>
        </button>
      </div>

      {/* Main Upload Form & Response Banner */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 md:p-8 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Tag className="h-5 w-5 text-blue-600" />
              <span>Create New Category</span>
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="categoryName" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Category Name <span className="text-rose-500">*</span>
              </label>
              <input
                id="categoryName"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. housee, Apartment, Villa..."
                disabled={loading}
                className="w-full px-4 py-3 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all text-slate-900 placeholder:text-slate-400 bg-slate-50/50 focus:bg-white"
                required
              />
            </div>

            {/* In-form API Result Banner */}
            {apiResponse && (
              <div
                className={`p-4 rounded-xl text-xs flex items-start gap-3 border transition-all ${
                  apiResponse.type === "success"
                    ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                    : "bg-rose-50 text-rose-800 border-rose-200"
                }`}
              >
                {apiResponse.type === "success" ? (
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-rose-600 shrink-0 mt-0.5" />
                )}
                <div>
                  <p className="font-bold text-sm">
                    {apiResponse.type === "success" ? "Success Response" : "Error Response"}
                  </p>
                  <p className="mt-0.5">{apiResponse.message}</p>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !name.trim()}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3.5 px-6 rounded-xl font-semibold text-sm transition-all shadow-md shadow-blue-500/10 hover:shadow-lg hover:shadow-blue-500/20 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Uploading Category...</span>
                </>
              ) : (
                <>
                  <FolderPlus className="h-4 w-4" />
                  <span>Submit Category</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Categories List View */}
        <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 md:p-8 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Tag className="h-5 w-5 text-slate-700" />
              <span>Available Categories</span>
            </h2>
            <span className="text-xs font-bold px-2.5 py-1 bg-slate-100 text-slate-600 rounded-full">
              Total: {categories.length}
            </span>
          </div>

          {fetching ? (
            <div className="py-12 flex flex-col items-center justify-center gap-3 text-slate-400">
              <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
              <p className="text-xs font-medium">Loading existing categories...</p>
            </div>
          ) : categories.length === 0 ? (
            <div className="py-12 text-center text-slate-400 space-y-2">
              <Tag className="h-8 w-8 mx-auto text-slate-300" />
              <p className="text-sm font-medium text-slate-500">No categories found yet.</p>
              <p className="text-xs text-slate-400">Use the form to create your first property category.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[380px] overflow-y-auto pr-1">
              {categories.map((cat: any, idx: number) => (
                <div
                  key={cat.id || cat._id || idx}
                  className="flex items-center gap-3 p-3.5 rounded-xl border border-slate-100 bg-slate-50/60 hover:bg-white hover:border-slate-300 hover:shadow-xs transition-all"
                >
                  <div className="h-8 w-8 rounded-lg bg-blue-100/70 text-blue-700 flex items-center justify-center font-bold text-xs shrink-0">
                    {cat.name ? cat.name.charAt(0).toUpperCase() : "#"}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-slate-900 truncate">{cat.name}</p>
                    {cat.id && (
                      <p className="text-[10px] text-slate-400 truncate font-mono">ID: {cat.id}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
