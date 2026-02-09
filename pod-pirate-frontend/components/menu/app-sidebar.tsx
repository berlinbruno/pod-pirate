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
import { HomeIcon, LogOutIcon, PlusCircle, Podcast, Settings } from "lucide-react";
import Link from "next/link";

export function UserSidebar() {
  const newPodcastUrl = "/dashboard/podcasts/new";
  const podcastsUrl = "/dashboard/podcasts";
  const dashboardUrl = "/dashboard";
  const profileUrl = "/dashboard/profile";
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
                <Link href={podcastsUrl}>
                  <Podcast size={20} />
                  <span>Manage Podcasts</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href={newPodcastUrl}>
                  <PlusCircle size={20} />
                  <span>New Podcast</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarSeparator />

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
                  <span>Sign Out</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
