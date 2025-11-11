"use client";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import React from "react";

export function NavDocuments({
  items,
}: {
  items: {
    name: string;
    url: string;
    icon: React.ElementType;
  }[];
}) {
  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Users</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <SidebarMenu key={item.name}>
            <SidebarMenuButton tooltip={item.name} asChild>
              <a href={item.url}>
                {item.icon && <item.icon />}
                <span>{item.name}</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenu>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
