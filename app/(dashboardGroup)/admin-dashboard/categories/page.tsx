import { getMe } from "@/app/service/getMe";
import { redirect } from "next/navigation";
import CategoryClient from "./CategoryClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function ManageCategoriesPage() {
  const user = await getMe();

  // Security checks - only ADMIN users can access this page
  if (!user) {
    redirect("/login");
  }

  if (user.role !== "ADMIN") {
    redirect("/");
  }

  return <CategoryClient />;
}
