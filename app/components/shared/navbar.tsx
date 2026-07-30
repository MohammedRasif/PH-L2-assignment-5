"use client"
import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image';
import { logout } from "@/app/service/logout";

interface NavbarProps {
  user?: any;
}

function Navbar({ user }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    const res = await logout();
    if (res.success) {
      window.location.href = "/login";
    }
  };

  const getDashboardLink = (role?: string) => {
    switch (role) {
      case "ADMIN":
        return "/admin-dashboard";
      case "LANDLORD":
        return "/landlord-dashboard";
      case "TENANT":
        return "/rental-dashboard";
      default:
        return "/";
    }
  };

  // Get initials for profile fallback
  const getInitials = (name?: string) => {
    if (!name) return "U";
    return name.charAt(0).toUpperCase();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-100 bg-white/90 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="flex items-center justify-center text-blue-600 transition-colors">
                <Image
                  src="/logo.svg"
                  alt="Logo"
                  width={130}
                  height={130}
                  style={{ height: "auto" }}
                  priority
                />
              </div>
            </Link>
          </div>

          {/* Desktop Navigation & Actions */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              href="/properties"
              className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors"
            >
              Properties
            </Link>

            <a
              href="tel:+18005550199"
              className="flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                className="h-4 w-4 text-slate-400"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-2.824-1.802-5.122-4.1-6.924-6.924l1.293-.97c.362-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"
                />
              </svg>
              <span>+1 (800) 555-0199</span>
            </a>

            <div className="h-4 w-px bg-slate-200" />

            <button
              aria-label="Bookmarks"
              className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-50 hover:text-blue-600 transition-all active:scale-95"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                className="h-5 w-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z"
                />
              </svg>
            </button>

            {/* Auth section */}
            {user ? (
              <div className="flex items-center gap-4">
                <Link
                  href={getDashboardLink(user.role)}
                  className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors"
                >
                  Dashboard
                </Link>
                
                {/* User avatar and name */}
                <div className="flex items-center gap-2 border-l border-slate-200 pl-4">
                  {user.profile?.profilePhoto ? (
                    <img
                      src={user.profile.profilePhoto}
                      alt={user.name || "User Profile"}
                      className="h-8 w-8 rounded-full object-cover ring-2 ring-blue-50"
                    />
                  ) : (
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 text-blue-600 font-bold text-sm ring-2 ring-blue-50">
                      {getInitials(user.name)}
                    </div>
                  )}
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-slate-800 leading-none">
                      {user.name}
                    </span>
                    <span className="text-[10px] text-slate-500 font-medium capitalize mt-0.5">
                      {user.role?.toLowerCase()}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleLogout}
                  className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-red-600 hover:bg-slate-50 transition-all active:scale-95 cursor-pointer"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  href="/login"
                  className="rounded-lg px-4 py-2 text-sm font-semibold text-slate-600 hover:text-blue-600 hover:bg-slate-50 transition-all active:scale-95"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-blue-100 hover:bg-blue-700 transition-all active:scale-95"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Hamburger Mobile Toggle */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="inline-flex items-center justify-center rounded-md p-2 text-slate-500 hover:bg-slate-50 hover:text-slate-600 transition-all"
              aria-controls="mobile-menu"
              aria-expanded={isOpen}
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <svg
                  className="block h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg
                  className="block h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white" id="mobile-menu">
          <div className="space-y-1 px-4 pb-4 pt-3">
            <Link
              href="/properties"
              className="block rounded-lg px-3 py-2 text-base font-semibold text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-all"
              onClick={() => setIsOpen(false)}
            >
              Properties
            </Link>

            <a
              href="tel:+18005550199"
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-base font-medium text-slate-700 hover:bg-slate-50 transition-all"
              onClick={() => setIsOpen(false)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                className="h-5 w-5 text-slate-400"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-2.824-1.802-5.122-4.1-6.924-6.924l1.293-.97c.362-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"
                />
              </svg>
              <span>+1 (800) 555-0199</span>
            </a>

            <button
              onClick={() => setIsOpen(false)}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-base font-medium text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-all"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                className="h-5 w-5 text-slate-400"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z"
                />
              </svg>
              <span>Bookmarks</span>
            </button>

            <div className="my-2 h-px bg-slate-100" />

            {/* Mobile Auth section */}
            {user ? (
              <div className="space-y-3 pt-1 pb-2 px-3 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-3">
                  {user.profile?.profilePhoto ? (
                    <img
                      src={user.profile.profilePhoto}
                      alt={user.name || "User Profile"}
                      className="h-10 w-10 rounded-full object-cover ring-2 ring-blue-50"
                    />
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600 font-bold text-sm ring-2 ring-blue-50">
                      {getInitials(user.name)}
                    </div>
                  )}
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-slate-800">
                      {user.name}
                    </span>
                    <span className="text-xs text-slate-500 capitalize">
                      {user.role?.toLowerCase()}
                    </span>
                  </div>
                </div>

                <Link
                  href={getDashboardLink(user.role)}
                  className="block text-center rounded-lg bg-blue-50 text-blue-600 px-4 py-2 text-sm font-semibold hover:bg-blue-100 transition-all"
                  onClick={() => setIsOpen(false)}
                >
                  Go to Dashboard
                </Link>

                <button
                  onClick={() => {
                    setIsOpen(false);
                    handleLogout();
                  }}
                  className="w-full text-center rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-red-600 hover:bg-slate-50 transition-all cursor-pointer"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3 pt-2">
                <Link
                  href="/login"
                  className="flex items-center justify-center rounded-lg border border-slate-200 px-4 py-2 text-center text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-all"
                  onClick={() => setIsOpen(false)}
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition-all"
                  onClick={() => setIsOpen(false)}
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;
