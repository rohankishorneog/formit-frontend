import { AppSidebar } from "@/components/app_sidebar/AppSideBar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-screen h-screen">
        <SidebarTrigger />
        <ScrollArea>
          <Outlet />
        </ScrollArea>
      </main>
    </SidebarProvider>
  );
}
