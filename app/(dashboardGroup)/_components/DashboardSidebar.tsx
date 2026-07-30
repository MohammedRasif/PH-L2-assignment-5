"use client"

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSidebar } from "@/app/components/ui/sidebar";

interface SidebarProps {
  user?: any;
}

export default function DashboardSidebar({ user }: SidebarProps) {
  const pathname = usePathname();
  const { open } = useSidebar();

  const role = user?.role || "TENANT";

  // Sidebar links based on role
  const getSidebarLinks = (userRole: string) => {
    switch (userRole) {
      case "ADMIN":
        return [
          { name: "Overview", href: "/admin-dashboard", icon: "📊" },
          { name: "Manage Users", href: "/admin-dashboard/users", icon: "👥" },
          { name: "Manage Properties", href: "/admin-dashboard/properties", icon: "🏢" },
          { name: "Manage Rentals", href: "/admin-dashboard/rentals", icon: "📬" },
          { name: "System Settings", href: "/admin-dashboard/settings", icon: "⚙️" },
        ];
      case "LANDLORD":
        return [
          { name: "Overview", href: "/landlord-dashboard", icon: "📊" },
          { name: "My Properties", href: "/landlord-dashboard/my-properties", icon: "🏡" },
          { name: "Add Property", href: "/landlord-dashboard/add-property", icon: "➕" },
          { name: "Rental Requests", href: "/landlord-dashboard/requests", icon: "📬" },
        ];
      case "TENANT":
      default:
        return [
          { name: "My Dashboard", href: "/rental-dashboard", icon: "🔑" },
          { name: "My Bookings", href: "/rental-dashboard/bookings", icon: "📅" },
          { name: "Search Homes", href: "/properties", icon: "🔍" },
          { name: "Saved Listings", href: "/rental-dashboard/saved", icon: "⭐" },
        ];
    }
  };

  const links = getSidebarLinks(role);

  if (!open) return null;

  return (
    <aside className="w-64 border-r border-slate-100 bg-white min-h-[calc(100vh-4rem)] flex flex-col justify-between py-6 px-4">
      <div className="space-y-6">
        <div>
          <span className="px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
            {role} Portal
          </span>
          <nav className="mt-4 space-y-1">
            {links.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-semibold transition-all ${
                    isActive
                      ? "bg-blue-50 text-blue-600"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <span className="text-lg">{link.icon}</span>
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Footer Info inside Sidebar */}
      <div className="border-t border-slate-100 pt-4 px-3">
        <div className="flex items-center gap-3">
          <div className="flex flex-col">
            <span className="text-xs font-bold text-slate-800">
              {user?.name || "Loading..."}
            </span>
            <span className="text-[10px] text-slate-400 truncate max-w-[150px]">
              {user?.email || ""}
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}
