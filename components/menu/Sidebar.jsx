"use client";
import SidebarMenu, {
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSeperator,
} from "@/components/menu/SidebarMenu";
import { deleteCookie } from "@/utils/cookies";

import {
  HomeIcon,
  LogOutIcon,
  LucidePodcast,
  MicIcon,
  MonitorIcon,
  User2Icon,
} from "lucide-react";

const Sidebar = ({ userid }) => {
  const newEpisodeUrl = "/user/" + userid + "/new-episode";
  const homeUrl = "/user/" + userid + "/home";
  const accountUrl = "/user/" + userid + "/account";
  const channelUrl = "/user/" + userid + "/";
  const logoutUrl = "/logout";


  return (
    <SidebarMenu>
      {/* home */}
      <SidebarMenuItem
        icon={<HomeIcon size={20} />}
        text="Home"
        link={homeUrl}
        active={true}
        alert={false}
      />
      <SidebarMenuItem
        icon={<LucidePodcast size={20} />}
        text="New Episode"
        link={newEpisodeUrl}
        active={true}
        alert={false}
      />
      <SidebarMenuItem
        icon={<MonitorIcon size={20} />}
        text="Your Podcast"
        link={channelUrl}
        active={true}
        alert={false}
      />

      <SidebarMenuSeperator />
      <SidebarMenuItem
        icon={<User2Icon size={20} />}
        text="Account"
        link={accountUrl}
        active={true}
        alert={false}
      />
      <SidebarMenuItem
        icon={<LogOutIcon size={20} />}
        text="Log Out"
        link={logoutUrl}
        active={true}
        alert={false}
      />

    </SidebarMenu>
  );
};
export default Sidebar;
