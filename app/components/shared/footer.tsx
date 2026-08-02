import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Building2, Phone, Mail, MapPin, ShieldCheck, Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
      {/* Main Footer Container */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Info & Tagline (Spans 2 columns on desktop) */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" prefetch={true} className="inline-block bg-white/90 p-2 rounded-xl">
              <Image
                src="/logo.svg"
                alt="RentNest Logo"
                width={120}
                height={40}
                style={{ height: "auto" }}
              />
            </Link>

            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              RentNest is your modern, all-in-one real estate rental management platform. Connecting tenants with verified landlords and seamless digital payment automation.
            </p>

            <div className="pt-2 flex items-center gap-4 text-slate-400 text-xs font-semibold">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-emerald-400">
                <ShieldCheck className="w-3.5 h-3.5" /> 100% Verified Platform
              </span>
            </div>
          </div>

          {/* Column 1: Navigation Links */}
          <div className="space-y-3">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-100">
              Explore
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link
                  href="/property"
                  prefetch={true}
                  className="text-slate-400 hover:text-emerald-400 transition-colors"
                >
                  All Properties
                </Link>
              </li>
              <li>
                <Link
                  href="/property"
                  prefetch={true}
                  className="text-slate-400 hover:text-emerald-400 transition-colors"
                >
                  Featured Apartments
                </Link>
              </li>
              <li>
                <Link
                  href="/property"
                  prefetch={true}
                  className="text-slate-400 hover:text-emerald-400 transition-colors"
                >
                  Family Homes
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Dashboard Links */}
          <div className="space-y-3">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-100">
              User Dashboards
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link
                  href="/rental-dashboard"
                  prefetch={true}
                  className="text-slate-400 hover:text-emerald-400 transition-colors"
                >
                  Tenant Dashboard
                </Link>
              </li>
              <li>
                <Link
                  href="/rental-dashboard/payment-history"
                  prefetch={true}
                  className="text-slate-400 hover:text-emerald-400 transition-colors"
                >
                  Payment History
                </Link>
              </li>
              <li>
                <Link
                  href="/landlord-dashboard"
                  prefetch={true}
                  className="text-slate-400 hover:text-emerald-400 transition-colors"
                >
                  Landlord Portal
                </Link>
              </li>
              <li>
                <Link
                  href="/admin-dashboard"
                  prefetch={true}
                  className="text-slate-400 hover:text-emerald-400 transition-colors"
                >
                  Admin Overview
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact & Support */}
          <div className="space-y-3">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-100">
              Get in Touch
            </h3>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <Link href="tel:+18005550199" prefetch={true} className="hover:text-white transition-colors">
                  +1 (800) 555-0199
                </Link>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <a href="mailto:support@rentnest.com" className="hover:text-white transition-colors">
                  support@rentnest.com
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Dhaka, Bangladesh</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar Divider */}
        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} RentNest Inc. All rights reserved.</p>

          <div className="flex items-center gap-6">
            <Link href="#" prefetch={true} className="hover:text-slate-300 transition-colors">
              Privacy Policy
            </Link>
            <Link href="#" prefetch={true} className="hover:text-slate-300 transition-colors">
              Terms of Service
            </Link>
            <Link href="#" prefetch={true} className="hover:text-slate-300 transition-colors">
              Security
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}