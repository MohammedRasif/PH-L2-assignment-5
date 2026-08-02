import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Building2, ShieldCheck, CreditCard, ArrowRight } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative w-full min-h-[550px] md:min-h-[640px] flex items-center overflow-hidden bg-[#F8F4ED]">
      {/* Background building image - right side on desktop, full cover on mobile */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/hero-building.jpg"
          alt="Modern Apartment Building"
          fill
          priority
          className="object-cover object-right md:object-right opacity-40 md:opacity-100 transition-opacity duration-500"
          sizes="100vw"
        />
        {/* Soft left-to-right fade so text stays 100% readable on all screen sizes */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#F8F4ED] via-[#F8F4ED]/95 sm:via-[#F8F4ED]/85 to-transparent md:to-[#F8F4ED]/10" />
      </div>

      {/* Hero Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 md:px-10 lg:px-16 w-full py-12 md:py-20">
        <div className="max-w-2xl">
          {/* Demo mode badge */}
          <div className="inline-flex items-center gap-2 mb-6">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-900 bg-emerald-100/90 backdrop-blur-md border border-emerald-200/80 rounded-full px-4 py-1.5 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
              Live Platform · Discover Rental Homes
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#1A2E1A] leading-[1.15] tracking-tight mb-6">
            Find & list rental <br className="hidden sm:inline" />
            properties with ease.
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-base md:text-lg text-slate-700 leading-relaxed max-w-xl mb-8 font-medium">
            Tenants browse and request lease contracts. Landlords approve applications and collect payments seamlessly via Stripe — all in one unified portal.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center gap-4 mb-10">
            <Link
              href="/property"
              prefetch={true}
              className="inline-flex items-center justify-center gap-2 bg-[#1A2E1A] hover:bg-[#274427] text-white text-sm font-bold px-6 py-3.5 rounded-full transition-all duration-200 shadow-md hover:shadow-lg active:scale-95 cursor-pointer"
            >
              <span>Browse Properties</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/register"
              prefetch={true}
              className="inline-flex items-center justify-center bg-[#E8C9A8] hover:bg-[#dfb990] text-[#3D2B1F] text-sm font-bold px-6 py-3.5 rounded-full transition-all duration-200 shadow-sm active:scale-95 cursor-pointer"
            >
              Create an Account
            </Link>
          </div>

          {/* Highlights / Features Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-slate-300/60 max-w-lg">
            <div className="flex items-center gap-2.5 text-xs font-bold text-slate-800">
              <div className="p-1.5 bg-emerald-100 text-emerald-800 rounded-lg shrink-0">
                <Building2 className="w-4 h-4" />
              </div>
              <span>Verified Listings</span>
            </div>

            <div className="flex items-center gap-2.5 text-xs font-bold text-slate-800">
              <div className="p-1.5 bg-blue-100 text-blue-800 rounded-lg shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <span>Instant Leases</span>
            </div>

            <div className="flex items-center gap-2.5 text-xs font-bold text-slate-800">
              <div className="p-1.5 bg-amber-100 text-amber-800 rounded-lg shrink-0">
                <CreditCard className="w-4 h-4" />
              </div>
              <span>Stripe Payments</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;