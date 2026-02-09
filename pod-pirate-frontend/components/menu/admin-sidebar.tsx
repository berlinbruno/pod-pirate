"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { HomeIcon, LockIcon, LogOutIcon, MonitorIcon, Settings } from "lucide-react";
import Link from "next/link";

export function AdminSidebar() {
  const dashboardUrl = "/admin";
  const podcastsUrl = "/admin/podcasts";
  const usersUrl = "/admin/users";
  const profileUrl = "/admin/profile";
  const logoutUrl = "/auth/logout";

  return (
    <Sidebar>
      <SidebarHeader className="h-14 sm:h-16 lg:h-18" />
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href={dashboardUrl}>
                  <HomeIcon size={20} />
                  <span>Dashboard</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href={usersUrl}>
                  <LockIcon size={20} />
                  <span>Manage Users</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href={podcastsUrl}>
                  <MonitorIcon size={20} />
                  <span>Moderate Podcasts</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href={profileUrl}>
                  <Settings size={20} />
                  <span>Settings</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarSeparator />
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href={logoutUrl}>
                  <LogOutIcon size={20} />
                  <span>Log Out</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
