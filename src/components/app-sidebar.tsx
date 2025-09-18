"use client";

import { User, Home, GraduationCap, Inbox, Settings } from "lucide-react";
import { Fingerprint } from "lucide-react";
import Link from "next/link";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { NavUser } from "@/components/nav-user";
import { useUser } from "@/context/userprop";

const items = [
  {
    title: "Home",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Reports",
    url: "/dashboard/reports",
    icon: Inbox,
  },
  {
    title: "Users",
    url: "/dashboard/users",
    icon: User,
  },
  {
    title: "Settings",
    url: "#",
    icon: Settings,
  },
  ,
  {
    title: "Huella",
    url: "/dashboard/huella",
    icon: Fingerprint,
  },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useUser();

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader className="flex gap-2 items-center flex-row">
        <SidebarMenuButton
          asChild
          className="data-[slot=sidebar-menu-button]:!p-1.5"
        >
          <a href="#">
            <GraduationCap className="!size-5 text-blue-500" />
            <span className="text-base font-semibold">Eduacces</span>
          </a>
        </SidebarMenuButton>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url} className="flex items-center gap-2">
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        {user && (
          <NavUser
            user={{
              name: `${user.nombre ?? ""} ${user.apellido ?? ""}`,
              email: user.correo,
              avatar: "https://github.com/shadcn.png", // 👈 aquí dejas la fija
            }}
          />
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
