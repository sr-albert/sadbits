import Typography from "@/components/Typography";
import {
  DropdownMenu,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import {
  ChevronUp,
  Home,
  Settings2,
  ThermometerSnowflakeIcon,
  User2,
} from "lucide-react";
import { Link, Outlet } from "react-router-dom";

import type { JSX } from "react/jsx-runtime";

const menu = [
  {
    title: "Home",
    url: "/",
    icon: Home,
  },
  {
    title: "Task",
    url: "/",
    icon: ThermometerSnowflakeIcon,
  },
];

const AppSidebar = (): JSX.Element => {
  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarMenu>
          {menu.map((item) => (
            <SidebarMenuItem
              key={item.url}
              className="flex text-center justify-center"
            >
              <SidebarMenuButton asChild>
                <Link to={item.url}>
                  <item.icon />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
                  {`{{USER_NAME}} and avatar`}
                  <Settings2 />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="start" side="top">
                <DropdownMenuItem className="p-2">
                  <Typography>Setting</Typography>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};

export default function AppLayout(): JSX.Element {
  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="min-h-screen bg-background">
        <main className="container mx-auto">
          <SidebarTrigger />
          <Outlet />
        </main>
      </div>
    </SidebarProvider>
  );
}
