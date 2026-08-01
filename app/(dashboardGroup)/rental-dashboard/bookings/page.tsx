import React from "react";
import { getMe } from "@/app/service/getMe";
import { redirect } from "next/navigation";
import TenantDashboardClient from "../TenantDashboardClient";

export const dynamic = "force-dynamic";

export default async function TenantBookingsPage() {
  const user = await getMe();

  if (!user) {
    redirect("/login");
  }

  if (user.role !== "TENANT") {
    redirect("/");
  }

  return <TenantDashboardClient user={user} />;
}
