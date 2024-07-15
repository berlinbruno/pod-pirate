"use client";
import SidebarMenu, {
  SidebarMenuItem,
  SidebarMenuSeperator,
} from "@/components/menu/SidebarMenu";

import {
  LockIcon,
  LogOutIcon,
  MonitorIcon,
  User2Icon,
} from "lucide-react";

const AdminSidebar = () => {
  const accountUrl = "/admin/account";
  const logoutUrl = "/logout";


  return (
    <SidebarMenu>
      {/* home */}

      <SidebarMenuItem
        icon={<MonitorIcon size={20} />}
        text="Podcasts"
        link={"/admin"}
        active={true}
        alert={false}
      />
      <SidebarMenuItem
        icon={<LockIcon size={20} />}
        text="Locked"
        link={"/admin/locked"}
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
export default AdminSidebar;
