import { SidebarProvider } from "@/app/components/ui/sidebar";
import { getMe } from "@/app/service/getMe";
import DashboardSidebar from "./_components/DashboardSidebar";
import { redirect } from "next/navigation";

const DashboardLayout = async ({
  children
}: {
  children: React.ReactNode
}) => {
  const user = await getMe();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50">
      <SidebarProvider>
        <DashboardSidebar user={user} />
        <main className="flex-1 min-w-0 p-4 sm:p-6 md:p-8 bg-slate-50 overflow-x-hidden">{children}</main>
      </SidebarProvider>
    </div>
  );
};

export default DashboardLayout;