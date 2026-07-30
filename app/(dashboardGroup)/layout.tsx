import { SidebarProvider } from "@/app/components/ui/sidebar";
import { getMe } from "@/app/service/getMe";
import DashboardSidebar from "./_components/DashboardSidebar";

const DashboardLayout = async ({
  children
}: {
  children: React.ReactNode
}) => {
  const user = await getMe();
  return (
    <div className="min-h-screen flex bg-slate-50">
      <SidebarProvider>
        <div className="flex flex-1 min-h-screen">
          <DashboardSidebar user={user} />
          <main className="flex-1 min-w-0 p-6 bg-slate-50">{children}</main>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default DashboardLayout;