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
  useSidebar,
} from "@/components/ui/sidebar";
import {
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import {
  Home,
  Joystick,
  ListTodoIcon,
  ServerCogIcon,
  Settings2,
  SettingsIcon,
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
    url: "/task",
    icon: ListTodoIcon,
  },
  {
    title: "SVG editor",
    url: "/svg-editor",
    icon: ServerCogIcon,
  },
  {
    title: "Relax",
    url: "relax",
    icon: Joystick,
  },
];

const AppSidebar = (): JSX.Element => {
  const { open } = useSidebar();
  return (
    <Sidebar collapsible="icon">
      <SidebarContent className="p-2">
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
                {open ? (
                  <SidebarMenuButton className="justify-between">
                    {`{{USER_NAME}} and avatar`}
                    <Settings2 />
                  </SidebarMenuButton>
                ) : (
                  <SidebarMenuButton>
                    <SettingsIcon />
                  </SidebarMenuButton>
                )}
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="start" side="top">
                <DropdownMenuItem className="p-2">
                  <Link to="/setting">
                    <Typography>Setting</Typography>
                  </Link>
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
        <SidebarTrigger />
        <main className="container mx-auto p-2">
          <Outlet />
        </main>
      </div>
    </SidebarProvider>
  );
}
