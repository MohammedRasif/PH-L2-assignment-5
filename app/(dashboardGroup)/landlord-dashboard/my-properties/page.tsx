import React from "react";
import { getMe } from "@/app/service/getMe";
import { redirect } from "next/navigation";
import LandlordDashboardClient from "../LandlordDashboardClient";

export const dynamic = "force-dynamic";

export default async function LandlordMyPropertiesPage() {
  const user = await getMe();

  if (!user) {
    redirect("/login");
  }

  if (user.role !== "LANDLORD") {
    redirect("/");
  }

  return <LandlordDashboardClient user={user} />;
}
