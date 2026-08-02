import React from "react";
import { getPropertyById } from "@/app/service/propertyService";
import { getMe } from "@/app/service/getMe";
import { getTenantRequests } from "@/app/service/requestService";
import PropertyDetailsClient from "../../_components/PropertyDetailsClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface PropertyDetailsPageProps {
  params: Promise<{ id: string }>;
}

export default async function PropertyDetailsPage({ params }: PropertyDetailsPageProps) {
  const { id } = await params;
  
  let property = null;
  try {
    property = await getPropertyById(id);
  } catch (err) {
    console.error(`Failed to fetch property details for ID ${id}:`, err);
  }

  if (!property) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full text-center space-y-6 bg-white p-10 rounded-3xl border border-slate-100 shadow-xl">
          <span className="text-7xl block font-sans">🏠</span>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Property Not Found</h2>
          <p className="text-slate-500 text-sm">
            We couldn't find the property you're looking for. It may have been removed or is no longer available.
          </p>
          <a
            href="/property"
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-sm font-bold rounded-2xl text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/20 transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
          >
            ← Back to Listings
          </a>
        </div>
      </div>
    );
  }

  const currentUser = await getMe();
  
  let initialTenantRequests: any[] = [];
  if (currentUser?.role === "TENANT") {
    try {
      initialTenantRequests = await getTenantRequests();
    } catch (err) {
      console.error("Failed to load tenant requests for details page:", err);
    }
  }

  return (
    <PropertyDetailsClient 
      property={property}
      currentUser={currentUser}
      initialTenantRequests={initialTenantRequests}
    />
  );
}
