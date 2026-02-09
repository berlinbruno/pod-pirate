"use client";

import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { getInitials } from "@/utils/format";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { ModeToggle } from "../menu/ModeToggle";
import LogoutButton from "../ui/logout-button";

interface HeaderUserMenuProps {
  user?: {
    userName: string;
    profileUrl: string | null;
    roles: string[];
  } | null;
  compact: boolean;
}

export default function HeaderUserMenu({ user, compact }: HeaderUserMenuProps) {
  const isUser = user?.roles.includes("USER") && !user?.roles.includes("ADMIN");
  const isAdmin = user?.roles.includes("ADMIN");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "rounded-full",
            "transition-[width,height] duration-200 ease-out",
            compact ? "h-9 w-9" : "h-10 w-10 sm:h-11 sm:w-11",
          )}
          aria-label="Open user menu"
          aria-haspopup="menu"
        >
          <Avatar
            className={cn(
              "transition-transform duration-200 ease-out",
              compact ? "scale-90" : "scale-100",
            )}
          >
            {user?.profileUrl ? (
              <AvatarImage src={user.profileUrl} alt={`${user.userName}'s avatar`} />
            ) : null}
            <AvatarFallback aria-hidden>{getInitials(user?.userName)}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-52">
        {user && (
          <>
            <DropdownMenuLabel className="truncate">{`@${user.userName}`}</DropdownMenuLabel>
            <DropdownMenuSeparator />
          </>
        )}

        {isUser && (
          <DropdownMenuGroup>
            <DropdownMenuItem asChild>
              <Link href="/dashboard">Dashboard</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/dashboard/podcasts">Manage Podcasts</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/dashboard/podcasts/new">New Podcast</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/dashboard/profile">Settings</Link>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        )}

        {isAdmin && (
          <>
            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <Link href="/admin">Dashboard</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/admin/users">Manage Users</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/admin/podcasts">Moderate Podcasts</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/admin/profile">Settings</Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </>
        )}

        {user && <DropdownMenuSeparator />}

        <DropdownMenuItem asChild>
          <ModeToggle />
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {user ? (
          <DropdownMenuItem asChild>
            <LogoutButton />
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem asChild>
            <Link href="/auth/login">Sign In</Link>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
