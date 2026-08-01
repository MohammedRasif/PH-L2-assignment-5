import React from "react";
import { getMe } from "@/app/service/getMe";
import { redirect } from "next/navigation";
import LandlordOverviewClient from "./LandlordOverviewClient";

export const dynamic = "force-dynamic";

export default async function LandlordDashboardPage() {
  const user = await getMe();

  if (!user) {
    redirect("/login");
  }

  if (user.role !== "LANDLORD") {
    redirect("/");
  }

  return <LandlordOverviewClient user={user} />;
}