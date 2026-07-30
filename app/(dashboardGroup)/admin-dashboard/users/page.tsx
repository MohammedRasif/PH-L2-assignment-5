import { getAdminUsers } from "@/app/service/adminService";
import UserTableClient from "./UserTableClient";
import { getMe } from "@/app/service/getMe";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function ManageUsersPage() {
  const user = await getMe();
  
  // Security checks
  if (!user) {
    redirect("/login");
  }

  if (user.role !== "ADMIN") {
    redirect("/");
  }

  return (
    <UserTableClient />
  );
}
