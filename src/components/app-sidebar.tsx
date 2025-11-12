"use client";

import * as React from "react";
import {
  IconCamera,
  IconDashboard,
  IconFileAi,
  IconFileDescription,
  IconHelp,
  IconInnerShadowTop,
  IconListDetails,
  IconReport,
  IconCalendar,
  IconSettings,
  IconUsers,
} from "@tabler/icons-react";
import { Fingerprint } from "lucide-react";
import { FaUserCircle } from "react-icons/fa";

import { NavDocuments } from "@/components/nav-documents";
import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/segundary-nav";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: IconDashboard,
    },
    {
      title: "profesores",
      url: "#",
      icon: IconListDetails,
    },

    {
      title: "fichas",
      url: "#",
      icon: IconCalendar,
    },
    {
      title: "Personas",
      url: "/dashboard/persona",
      icon: IconUsers,
    },
    {
      title: "Asistencia",
      url: "/dashboard/asistencias",
      icon: IconUsers,
    },
  ],
  navClouds: [
    {
      title: "Capture",
      icon: IconCamera,
      isActive: true,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Proposal",
      icon: IconFileDescription,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Prompts",
      icon: IconFileAi,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Ajustes",
      url: "#",
      icon: IconSettings,
    },
    {
      title: "Guia",
      url: "#",
      icon: IconHelp,
    },
  ],
  documents: [
    {
      name: "users",
      url: "/dashboard/users",
      icon: FaUserCircle,
    },
    {
      name: "Reportes",
      url: "/dashboard/reports",
      icon: IconReport,
    },
    {
      name: "Huella",
      url: "/dashboard/huella",
      icon: Fingerprint,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="#">
                <IconInnerShadowTop className="!size-5" />
                <span className="text-base font-semibold">Eduacces.</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavDocuments items={data.documents} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
