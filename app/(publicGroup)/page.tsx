import React from "react";
import Hero from "./_components/Hero";
import { getProperties } from "@/app/service/propertyService";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  let properties: any[] = [];
  try {
    properties = await getProperties();
  } catch (err) {
  }

  const featuredProperties = properties.slice(0, 6);

  return (
    <div className="space-y-12 pb-16 bg-slate-50">
      <Hero />

      {/* Featured Properties Grid Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-800">
              Handpicked Homes
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              Featured Rental Properties
            </h2>
          </div>

          <Link
            href="/property"
            prefetch={true}
            className="inline-flex items-center gap-1.5 text-sm font-bold text-emerald-800 hover:text-emerald-950 transition-colors"
          >
            <span>Explore All Properties</span>
            <span>→</span>
          </Link>
        </div>

        {featuredProperties.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-100 text-slate-400">
            No properties found at the moment.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProperties.map((prop) => {
              const mainImage = prop.images && prop.images.length > 0 ? prop.images[0] : null;

              return (
                <Link
                  key={prop.id}
                  href={`/property/${prop.id}`}
                  prefetch={true}
                  className="group bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-xs hover:shadow-md transition-all duration-300 hover:scale-[1.02] flex flex-col justify-between cursor-pointer"
                >
                  <div>
                    {/* Card Image Viewport */}
                    <div className="h-52 w-full bg-slate-100 relative overflow-hidden">
                      {mainImage ? (
                        <img
                          src={mainImage}
                          alt={prop.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs font-bold uppercase tracking-wider bg-slate-100">
                          No Image
                        </div>
                      )}

                      {prop.category?.name && (
                        <div className="absolute top-3 left-3">
                          <span className="bg-white/90 backdrop-blur-xs text-slate-800 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-xs">
                            {prop.category.name}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Card Content */}
                    <div className="p-5 space-y-2">
                      <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-800 transition-colors line-clamp-1">
                        {prop.title}
                      </h3>
                      <p className="text-xs text-slate-600 font-semibold flex items-center gap-1.5">
                        <span>📍</span>
                        <span className="truncate">{prop.location}</span>
                      </p>
                    </div>
                  </div>

                  <div className="px-5 pb-5 pt-2 flex items-center justify-between border-t border-slate-50 mt-auto">
                    <span className="text-base font-extrabold text-slate-900">
                      ৳ {prop.price?.toLocaleString()} <span className="text-xs text-slate-400 font-normal">/ mo</span>
                    </span>
                    <span className="text-xs font-bold text-emerald-800 group-hover:translate-x-1 transition-transform">
                      View Details →
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}