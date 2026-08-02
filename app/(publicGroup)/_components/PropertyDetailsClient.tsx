"use client";

import React, { useState } from "react";
import Link from "next/link";
import { createRentalRequestAction, createPaymentAction, createReviewAction } from "@/app/actions/requestActions";
import { toast } from "react-toastify";
import { showSuccessToast, showErrorToast } from "@/app/utils/toast";

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

interface Review {
  id?: string;
  comment: string;
  rating: number;
  createdAt?: string;
  tenant?: {
    name: string;
    email?: string;
  };
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
  reviews?: Review[];
}

interface PropertyDetailsClientProps {
  property: Property;
  currentUser?: any;
  initialTenantRequests?: any[];
}

export default function PropertyDetailsClient({
  property,
  currentUser,
  initialTenantRequests = [],
}: PropertyDetailsClientProps) {
  const images = property.images || [];
  const [activeImage, setActiveImage] = useState<string | null>(() => {
    return images.length > 0 ? images[0] : null;
  });

  const [loadingRequest, setLoadingRequest] = useState(false);
  const [matchingRequest, setMatchingRequest] = useState<any>(() => {
    return initialTenantRequests.find((req) => req.propertyId === property.id);
  });
  const requestStatus = matchingRequest?.status || null;

  // Direct payment trigger state
  const [paying, setPaying] = useState(false);

  // Review states
  const [reviews, setReviews] = useState<Review[]>(() => property.reviews || []);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  const handleRequestRent = async () => {
    setLoadingRequest(true);
    try {
      const res = await createRentalRequestAction(property.id);
      if (res?.success) {
        setMatchingRequest(res.data);
        showSuccessToast(res.message || `Rental request submitted successfully!`);
      } else {
        showErrorToast(res?.message || "Failed to submit rental request.");
      }
    } catch (err: any) {
      showErrorToast(err.message || "An error occurred while submitting rental request.");
    } finally {
      setLoadingRequest(false);
    }
  };

  const handlePay = async () => {
    if (!matchingRequest?.id) return;
    setPaying(true);
    try {
      const res = await createPaymentAction(matchingRequest.id, "STRIPE");
      if (res?.success && res.data?.checkoutUrl) {
        toast.info("Redirecting to Stripe checkout session...");
        window.location.href = res.data.checkoutUrl;
      } else {
        showErrorToast(res?.message || "Failed to create payment checkout session.");
      }
    } catch (err: any) {
      showErrorToast(err.message || "An error occurred during payment setup.");
    } finally {
      setPaying(false);
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) {
      showErrorToast("Please write a comment.");
      return;
    }
    setSubmittingReview(true);
    try {
      const res = await createReviewAction(property.id, rating, comment);
      if (res?.success) {
        showSuccessToast(res.message || "Review submitted successfully!");
        setReviews((prev) => [
          ...prev,
          {
            rating,
            comment,
            tenant: {
              name: currentUser?.name || "Verified Tenant",
              email: currentUser?.email || "",
            },
            createdAt: new Date().toISOString(),
          },
        ]);
        setComment("");
        setShowReviewForm(false);
      } else {
        showErrorToast(res?.message || "Failed to submit review.");
      }
    } catch (err: any) {
      showErrorToast(err.message || "An error occurred while submitting review.");
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Navigation & Back Link */}
        <div className="mb-8">
          <Link
            href="/property"
            className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors"
          >
            <span>←</span> Back to Property Listings
          </Link>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Left Column: Image Gallery and Information */}
          <div className="lg:col-span-2 space-y-8">
            {/* Beautiful Image Gallery */}
            <div className="bg-white rounded-3xl p-4 border border-slate-100 shadow-xs space-y-4">
              <div className="h-[260px] sm:h-[380px] md:h-[450px] w-full rounded-2xl overflow-hidden bg-slate-100 relative select-none">
                {activeImage ? (
                  <img
                    src={activeImage}
                    alt={property.title}
                    className="w-full h-full object-cover transition-all duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-slate-100 text-slate-450">
                    <span className="text-sm font-bold tracking-wide uppercase">No Image Available</span>
                  </div>
                )}

                {/* Category Tag on Gallery */}
                {property.category?.name && (
                  <div className="absolute top-4 left-4 z-10">
                    <span className="bg-white/95 backdrop-blur-xs text-slate-800 text-xs font-extrabold px-4 py-1.5 rounded-full uppercase tracking-wider shadow-sm border border-slate-100">
                      {property.category.name}
                    </span>
                  </div>
                )}

                {/* Availability Badge */}
                <div className="absolute top-4 right-4 z-10">
                  <span
                    className={`text-xs font-extrabold px-4 py-1.5 rounded-full uppercase tracking-wider shadow-sm border ${property.isAvailable
                        ? "bg-emerald-500 text-white border-emerald-400"
                        : "bg-rose-500 text-white border-rose-400"
                      }`}
                  >
                    {property.isAvailable ? "Available" : "Occupied"}
                  </span>
                </div>
              </div>

              {/* Thumbnails list if there are multiple images */}
              {images.length > 0 && (
                <div className="flex flex-wrap gap-3 pt-2">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImage(img)}
                      className={`h-20 w-28 rounded-xl overflow-hidden border-2 transition-all cursor-pointer hover:scale-[1.05] hover:shadow-xs active:scale-[0.98] ${activeImage === img
                          ? "border-blue-600 shadow-xs scale-102"
                          : "border-slate-200/80"
                        }`}
                    >
                      <img src={img} alt={`Preview ${idx + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Core Info */}
            <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-xs space-y-6">
              <div>
                <div className="flex items-center gap-1.5 text-blue-600 text-sm font-bold uppercase tracking-wider mb-2">
                  <span>📍</span> {property.location}
                </div>
                <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
                  {property.title}
                </h1>
              </div>

              {/* Basic Specs */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 border-y border-slate-100 py-6">
                <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-slate-50 border border-slate-100 text-center">
                  <span className="text-2xl mb-1">🛏️</span>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Bedrooms</span>
                  <span className="text-base font-bold text-slate-800 mt-0.5">{property.bedrooms} {property.bedrooms === 1 ? "Bed" : "Beds"}</span>
                </div>
                <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-slate-50 border border-slate-100 text-center">
                  <span className="text-2xl mb-1">🚿</span>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Bathrooms</span>
                  <span className="text-base font-bold text-slate-800 mt-0.5">{property.bathrooms} {property.bathrooms === 1 ? "Bath" : "Baths"}</span>
                </div>
                <div className="col-span-2 sm:col-span-1 flex flex-col items-center justify-center p-3 rounded-2xl bg-slate-50 border border-slate-100 text-center">
                  <span className="text-2xl mb-1">৳</span>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Rent Price</span>
                  <span className="text-base font-extrabold text-blue-600 mt-0.5">৳ {property.price.toLocaleString()}</span>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-3">
                <h3 className="text-lg font-extrabold text-slate-900">About this property</h3>
                <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">
                  {property.description}
                </p>
              </div>

              {/* Amenities */}
              {property.amenities?.length > 0 && (
                <div className="space-y-4 pt-2">
                  <h3 className="text-lg font-extrabold text-slate-900">Amenities & Features</h3>
                  <div className="flex flex-wrap gap-2.5">
                    {property.amenities.map((amenity, idx) => (
                      <span
                        key={idx}
                        className="bg-slate-50 text-slate-700 text-xs font-bold px-4 py-2 rounded-xl border border-slate-100 flex items-center gap-1.5"
                      >
                        <span className="text-amber-500">⚡</span> {amenity}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Reviews Section */}
            <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-xs space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <h3 className="text-xl font-extrabold text-slate-900">
                  Tenant Reviews ({reviews.length})
                </h3>
                {reviews.length > 0 && (
                  <div className="flex items-center gap-1 bg-amber-50 text-amber-700 px-3 py-1 rounded-xl text-sm font-bold border border-amber-100">
                    <span>★</span>
                    <span>
                      {(reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length).toFixed(1)}
                    </span>
                  </div>
                )}
              </div>

              {/* Reviews List */}
              {reviews.length === 0 ? (
                <div className="text-center py-6 text-slate-400 text-sm">
                  <span className="text-4xl block mb-2">⭐</span>
                  No reviews yet. Be the first to leave a review after your lease is active and completed!
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {reviews.map((rev, idx) => (
                    <div key={idx} className="py-4 first:pt-0 last:pb-0 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-650 text-xs border border-slate-200">
                            {rev.tenant?.name ? rev.tenant.name.charAt(0).toUpperCase() : "T"}
                          </div>
                          <div>
                            <h4 className="font-bold text-slate-800 text-sm">
                              {rev.tenant?.name || "Verified Tenant"}
                            </h4>
                            <p className="text-[10px] text-slate-400">
                              {rev.createdAt ? new Date(rev.createdAt).toLocaleDateString() : "Recent"}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-0.5 text-amber-500 text-sm font-bold">
                          {[...Array(5)].map((_, i) => (
                            <span key={i} className={i < rev.rating ? "text-amber-500" : "text-slate-200"}>★</span>
                          ))}
                        </div>
                      </div>
                      <p className="text-slate-650 text-sm pl-10 leading-relaxed italic">
                        "{rev.comment}"
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Landlord info and Actions panel */}
          <div className="space-y-8 lg:sticky lg:top-8">
            {/* Rent Pricing Card */}
            <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-xs space-y-6">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Monthly Rent</span>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-4xl font-black text-blue-600">৳ {property.price.toLocaleString()}</span>
                  <span className="text-sm font-semibold text-slate-500">/ BDT</span>
                </div>
              </div>

              {/* Submission panel based on tenant/roles */}
              <div className="border-t border-slate-100 pt-6">
                {!currentUser ? (
                  <div className="space-y-4 text-center">
                    <p className="text-xs font-semibold text-slate-500">
                      Sign in to submit a rental request for this property.
                    </p>
                    <Link
                      href="/login"
                      className="w-full inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl text-sm transition-all shadow-sm hover:scale-[1.01] active:scale-[0.99]"
                    >
                      Login to Request
                    </Link>
                  </div>
                ) : currentUser.role === "TENANT" ? (
                  (() => {
                    if (requestStatus === "PENDING") {
                      return (
                        <div className="bg-amber-50 text-amber-800 border border-amber-250 font-bold py-3.5 px-4 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs">
                          <span>⏳</span> Request Pending Approval
                        </div>
                      );
                    }

                    if (requestStatus === "APPROVED") {
                      return (
                        <div className="space-y-3">
                          <div className="bg-emerald-50 text-emerald-800 border border-emerald-250 font-bold py-3.5 px-4 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs">
                            <span>🎉</span> Request Approved!
                          </div>
                          <button
                            type="button"
                            disabled={paying}
                            onClick={handlePay}
                            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-xl text-sm flex items-center justify-center gap-2 shadow-md shadow-emerald-500/20 transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
                          >
                            {paying ? (
                              <>
                                <span className="animate-spin inline-block w-4 h-4 border-2 border-current border-t-transparent text-white rounded-full"></span>
                                <span>Processing...</span>
                              </>
                            ) : (
                              <>
                                <span>💳</span>
                                <span>Pay Now</span>
                              </>
                            )}
                          </button>
                        </div>
                      );
                    }

                    if (requestStatus === "COMPLETED") {
                      const hasReviewed = reviews.some(
                        (rev) =>
                          rev.tenant?.email === currentUser?.email ||
                          rev.tenant?.name === currentUser?.name
                      );

                      return (
                        <div className="space-y-4">
                          <div className="bg-blue-50 text-blue-800 border border-blue-250 font-bold py-3 px-4 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs">
                            <span>✓</span> Rent Lease Active / Paid
                          </div>

                          {!hasReviewed ? (
                            !showReviewForm ? (
                              <button
                                type="button"
                                onClick={() => setShowReviewForm(true)}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl text-sm flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer animate-pulse"
                              >
                                ✍️ Give Review
                              </button>
                            ) : (
                              <form onSubmit={handleReviewSubmit} className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
                                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Leave a Review</h4>
                                <div className="flex items-center gap-1.5">
                                  <span className="text-xs text-slate-500 font-semibold">Rating:</span>
                                  <div className="flex gap-1">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                      <button
                                        key={star}
                                        type="button"
                                        onClick={() => setRating(star)}
                                        className="text-lg focus:outline-none transition-transform hover:scale-110"
                                      >
                                        <span className={star <= rating ? "text-amber-500" : "text-slate-200"}>★</span>
                                      </button>
                                    ))}
                                  </div>
                                </div>
                                <textarea
                                  placeholder="Write your review here..."
                                  value={comment}
                                  onChange={(e) => setComment(e.target.value)}
                                  className="w-full p-2 rounded-lg border border-slate-200 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
                                  rows={3}
                                />
                                <div className="flex gap-2">
                                  <button
                                    type="submit"
                                    disabled={submittingReview}
                                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-lg text-xs transition-all flex items-center justify-center gap-1 cursor-pointer disabled:opacity-50"
                                  >
                                    {submittingReview ? "Submitting..." : "Submit"}
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setShowReviewForm(false)}
                                    className="px-3 border border-slate-200 hover:bg-slate-100 rounded-lg text-xs font-bold text-slate-500 transition-all cursor-pointer"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </form>
                            )
                          ) : (
                            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-center text-xs font-semibold text-slate-500 italic">
                              Thank you for leaving a review! ⭐
                            </div>
                          )}
                        </div>
                      );
                    }

                    if (requestStatus === "REJECTED") {
                      return (
                        <div className="bg-rose-50 text-rose-800 border border-rose-200 font-bold py-3.5 px-4 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs">
                          <span>✕</span> Request Rejected
                        </div>
                      );
                    }

                    return (
                      <button
                        type="button"
                        disabled={loadingRequest || !property.isAvailable}
                        onClick={handleRequestRent}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl text-sm transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.01] active:scale-[0.99]"
                      >
                        {loadingRequest ? (
                          <>
                            <span className="animate-spin inline-block w-4 h-4 border-2 border-current border-t-transparent text-white rounded-full"></span>
                            <span>Submitting...</span>
                          </>
                        ) : (
                          <>
                            <span>📩</span>
                            <span>Request to Rent Property</span>
                          </>
                        )}
                      </button>
                    );
                  })()
                ) : (
                  <div className="bg-slate-50 text-slate-600 border border-slate-200/60 font-semibold p-4 rounded-xl text-xs text-center leading-relaxed">
                    👤 Logged in as <span className="font-extrabold uppercase text-blue-600">{currentUser.role}</span>. Rental request submissions are restricted to tenants only.
                  </div>
                )}
              </div>
            </div>

            {/* Landlord Card */}
            <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-xs space-y-5">
              <h3 className="text-base font-extrabold text-slate-900 border-b border-slate-50 pb-3">Listed by Landlord</h3>
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-lg border border-blue-100 shrink-0">
                  {property.owner?.name ? property.owner.name.charAt(0).toUpperCase() : "L"}
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-slate-800 text-sm">{property.owner?.name || "Independent Landlord"}</h4>
                  <p className="text-xs text-slate-500 break-all">{property.owner?.email}</p>
                  <span className="inline-block bg-slate-100 text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider">
                    {property.owner?.role || "Landlord"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
