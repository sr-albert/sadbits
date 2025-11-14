import Typography from "@/components/Typography";
import {
  DropdownMenu,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
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
  SidebarIcon,
} from "lucide-react";
import { Link, Outlet, useLocation } from "react-router-dom";

import { type JSX } from "react/jsx-runtime";

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

function AppLayoutContainer(): JSX.Element {
  const { open, toggleSidebar } = useSidebar();
  const { pathname } = useLocation();

  return (
    <>
      <Sidebar collapsible="icon">
        <SidebarHeader>
          {open && (
            <SidebarMenu className="flex">
              <SidebarMenuItem className="ml-auto">
                <span className="sr-only">Toggle Close</span>
                <SidebarIcon
                  className="size-4 fade-in-5"
                  onClick={toggleSidebar}
                />
              </SidebarMenuItem>
            </SidebarMenu>
          )}
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu aria-label="Menu">
            {menu.map((item) => (
              <SidebarMenuItem
                key={item.url}
                aria-label={item.title}
                className="flex justify-center"
              >
                <SidebarMenuButton asChild isActive={item.url === pathname}>
                  <Link to={item.url}>
                    <item.icon />
                    <span className={!open ? "sr-only" : ""}>{item.title}</span>
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
      <div className="min-h-screen bg-background">
        {!open && <SidebarTrigger size="icon-lg" />}
        <main className="container mx-auto p-2">
          <Outlet />
        </main>
      </div>
    </>
  );
}

export default function AppLayout(): JSX.Element {
  return (
    <SidebarProvider>
      <AppLayoutContainer />
    </SidebarProvider>
  );
}
