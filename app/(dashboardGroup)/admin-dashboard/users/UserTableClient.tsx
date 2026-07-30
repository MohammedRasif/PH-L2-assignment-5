"use client";

import React, { useState, useEffect, useTransition } from "react";
import { updateUserStatusAction, getAdminUsersAction } from "../_actions/adminActions";

interface UserProfile {
  id: string;
  profilePhoto: string | null;
  bio: string | null;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  activeStatus: string;
  createdAt: string;
  profile: UserProfile | null;
}

export default function UserTableClient() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isPending, startTransition] = useTransition();
  const [loadingUserId, setLoadingUserId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    async function loadUsers() {
      setIsLoading(true);
      setErrorMsg("");
      try {
        const res = await getAdminUsersAction();
        if (res.success && res.data) {
          setUsers(res.data);
        } else {
          setErrorMsg(res.message || "Failed to load users list.");
        }
      } catch (err: any) {
        setErrorMsg(err.message || "An error occurred while fetching users.");
      } finally {
        setIsLoading(false);
      }
    }
    loadUsers();
  }, []);

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleToggleStatus = (userId: string, currentStatus: string) => {
    const nextStatus = currentStatus === "ACTIVE" ? "BLOCKED" : "ACTIVE";
    setLoadingUserId(userId);
    setErrorMsg("");
    setSuccessMsg("");

    startTransition(async () => {
      try {
        const res = await updateUserStatusAction(userId, nextStatus);
        if (res.success) {
          setUsers(prev => prev.map(u => u.id === userId ? { ...u, activeStatus: nextStatus } : u));
          setSuccessMsg(res.message || `User status updated to ${nextStatus} successfully.`);
          setTimeout(() => setSuccessMsg(""), 3500);
        } else {
          setErrorMsg(res.message || "Failed to update user status.");
        }
      } catch (err: any) {
        setErrorMsg(err.message || "An error occurred.");
      } finally {
        setLoadingUserId(null);
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Manage Users</h1>
          <p className="text-sm text-slate-500 mt-1">
            View, search, and manage portal accounts. Ban or unban users instantly.
          </p>
        </div>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-sm font-semibold animate-pulse">
          ✅ {successMsg}
        </div>
      )}

      {errorMsg && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-sm font-semibold">
          ❌ {errorMsg}
        </div>
      )}

      {/* Filter and Search controls */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 flex items-center justify-between">
        <div className="relative max-w-sm w-full">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">🔍</span>
          <input
            type="text"
            placeholder="Search users by name, email or role..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-all"
          />
        </div>
        <div className="text-xs text-slate-500 font-medium">
          Found {filteredUsers.length} total users
        </div>
      </div>

      {/* Table container */}
      {isLoading ? (
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-16 flex flex-col items-center justify-center min-h-[350px]">
          <div className="relative flex items-center justify-center mb-4">
            <div className="h-12 w-12 rounded-full border-4 border-slate-100 border-t-blue-600 animate-spin"></div>
          </div>
          <span className="text-xs text-slate-500 font-semibold animate-pulse">Loading users...</span>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-100 text-left text-sm">
              <thead className="bg-slate-55/70 text-slate-500 text-xs font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-4 px-6">Name</th>
                  <th className="py-4 px-6">Email</th>
                  <th className="py-4 px-6">Role</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6">Joined Date</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                      {/* User profile / Name */}
                      <td className="py-4 px-6 flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-700">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900">{user.name}</div>
                          <div className="text-[10px] text-slate-400 font-mono select-all truncate max-w-[120px]">{user.id}</div>
                        </div>
                      </td>
                      
                      {/* Email */}
                      <td className="py-4 px-6 select-all font-semibold text-slate-800">{user.email}</td>
                      
                      {/* Role */}
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                          user.role === "ADMIN" 
                            ? "bg-purple-50 text-purple-700 border border-purple-100" 
                            : user.role === "LANDLORD" 
                            ? "bg-blue-50 text-blue-700 border border-blue-100" 
                            : "bg-orange-50 text-orange-700 border border-orange-100"
                        }`}>
                          {user.role}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                          user.activeStatus === "ACTIVE" 
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-100" 
                            : "bg-rose-50 text-rose-700 border border-rose-100"
                        }`}>
                          {user.activeStatus}
                        </span>
                      </td>

                      {/* Created Date */}
                      <td className="py-4 px-6 text-slate-500 font-normal">
                        {new Date(user.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-6 text-right">
                        {user.role !== "ADMIN" ? (
                          <button
                            onClick={() => handleToggleStatus(user.id, user.activeStatus)}
                            disabled={isPending && loadingUserId === user.id}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ml-auto hover:scale-[1.02] active:scale-[0.98] ${
                              user.activeStatus === "ACTIVE"
                                ? "bg-rose-50 text-rose-600 hover:bg-rose-100"
                                : "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                            } ${isPending && loadingUserId === user.id ? "opacity-50 pointer-events-none" : ""}`}
                          >
                            {isPending && loadingUserId === user.id ? (
                              <>
                                <svg className="animate-spin -ml-1 mr-1 h-3.5 w-3.5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Processing
                              </>
                            ) : user.activeStatus === "ACTIVE" ? (
                              "Ban User"
                            ) : (
                              "Unban User"
                            )}
                          </button>
                        ) : (
                          <span className="text-xs text-slate-400 italic">Protected System User</span>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-400 font-medium">
                      No matching users found in the system database.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
