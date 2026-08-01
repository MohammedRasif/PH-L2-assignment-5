"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Building2,
  FileText,
  PlusCircle,
  Calendar,
  Search,
  Bookmark,
  LogOut,
  ArrowLeft,
  Menu,
  X,
} from "lucide-react";
import { logout } from "@/app/service/logout";

interface SidebarProps {
  user?: any;
}

export default function DashboardSidebar({ user }: SidebarProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const role = user?.role || "TENANT";

  // Sidebar links based on role using Lucide React Icons
  const getSidebarLinks = (userRole: string) => {
    switch (userRole) {
      case "ADMIN":
        return [
          { name: "Overview", href: "/admin-dashboard", icon: LayoutDashboard },
          { name: "Manage Users", href: "/admin-dashboard/users", icon: Users },
          { name: "Manage Properties", href: "/admin-dashboard/properties", icon: Building2 },
          { name: "Manage Rentals", href: "/admin-dashboard/rentals", icon: FileText },
        ];
      case "LANDLORD":
        return [
          { name: "Overview", href: "/landlord-dashboard", icon: LayoutDashboard },
          { name: "Property Management", href: "/landlord-dashboard/my-properties", icon: Building2 },
          { name: "Request Management", href: "/landlord-dashboard/requests", icon: FileText },
        ];
      case "TENANT":
      default:
        return [
          { name: "My Dashboard", href: "/rental-dashboard", icon: LayoutDashboard },
          { name: "My Bookings", href: "/rental-dashboard/bookings", icon: Calendar },
        ];
    }
  };

  const links = getSidebarLinks(role);

  const handleLogout = () => {
    startTransition(async () => {
      await logout();
      window.location.href = "/login";
    });
  };

  const NavContent = () => (
    <>
      <div className="space-y-6">
        {/* Brand header */}
        <div className="px-2 pt-1 pb-2 border-b border-slate-100 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2" onClick={() => setMobileOpen(false)}>
            <span className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-extrabold text-sm shadow-md shadow-blue-500/20">
              R
            </span>
            <span className="font-extrabold text-slate-900 tracking-tight text-lg">
              Rent<span className="text-blue-600">Nest</span>
            </span>
          </Link>
          <Link
            href="/"
            title="Return to site"
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all text-xs flex items-center gap-1"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </div>

        {/* Portal navigation links */}
        <div>
          <span className="px-3 text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
            {role} Portal
          </span>
          <nav className="mt-3 space-y-1">
            {links.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition-all ${
                    isActive
                      ? "bg-blue-50 text-blue-600 shadow-sm"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <Icon className={`h-4 w-4 ${isActive ? "text-blue-600" : "text-slate-400"}`} />
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* User Info & Logout Button */}
      <div className="border-t border-slate-100 pt-4 px-2 space-y-3">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-700 shrink-0 text-sm">
            {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
          </div>
          <div className="flex flex-col min-w-0 flex-1">
            <span className="text-xs font-bold text-slate-900 truncate">
              {user?.name || "User Account"}
            </span>
            <span className="text-[10px] text-slate-400 truncate">
              {user?.email || ""}
            </span>
          </div>
        </div>

        <button
          onClick={handleLogout}
          disabled={isPending}
          className="w-full flex items-center justify-center gap-2 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 px-3 py-2 text-xs font-bold transition-all cursor-pointer disabled:opacity-50"
        >
          <LogOut className="h-3.5 w-3.5" />
          <span>{isPending ? "Logging out..." : "Log Out"}</span>
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Top Navigation Header */}
      <div className="md:hidden flex items-center justify-between bg-white border-b border-slate-200 px-4 py-3 sticky top-0 z-40 w-full shadow-sm">
        <Link href="/" className="flex items-center gap-2">
          <span className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-extrabold text-sm">
            R
          </span>
          <span className="font-extrabold text-slate-900 tracking-tight text-lg">
            Rent<span className="text-blue-600">Nest</span>
          </span>
        </Link>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
          aria-label="Toggle navigation menu"
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Sidebar Drawer */}
      <div
        className={`fixed inset-y-0 left-0 w-64 bg-white z-50 py-5 px-4 flex flex-col justify-between shadow-2xl transition-transform duration-300 transform md:hidden ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <NavContent />
      </div>

      {/* Desktop Permanent Sidebar */}
      <aside className="hidden md:flex w-64 border-r border-slate-200/80 bg-white h-screen sticky top-0 flex-col justify-between py-5 px-4 shadow-sm shrink-0">
        <NavContent />
      </aside>
    </>
  );
}
