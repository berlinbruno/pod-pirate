"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import HeaderUserMenu from "./HeaderUserMenu";

interface HeaderWrapperProps {
  user?: {
    userName: string;
    profileUrl: string | null;
    roles: string[];
  } | null;
}

export default function HeaderWrapper({ user }: HeaderWrapperProps) {
  const [compact, setCompact] = useState(false);

  /* --------------------------------
   * Edge-triggered scroll handling
   * -------------------------------- */
  useEffect(() => {
    let last = false;

    const onScroll = () => {
      const next = window.scrollY > 16;
      if (next !== last) {
        last = next;
        setCompact(next);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "bg-accent sticky top-0 z-50 mb-3 border-b md:mb-4",
        "transition-shadow duration-200 ease-out",
        compact ? "shadow-sm" : "shadow-md",
      )}
    >
      {/* 
        FIXED HEIGHT NAV — NO ANIMATION HERE
        This prevents layout shifts entirely
      */}
      <nav
        aria-label="Main navigation"
        className="container mx-auto flex h-14 items-center justify-between px-3 sm:h-16 sm:px-4 lg:h-18 lg:px-0"
      >
        {/* Logo */}
        <Link href="/" aria-label="Go to homepage" className="flex items-center focus:outline-none">
          <Image
            src="/logo/logo-full-light.png"
            alt="Pod Pirate logo"
            className={cn(
              "w-auto origin-left dark:hidden",
              "transition-transform duration-200 ease-out",
              compact ? "scale-90" : "scale-100",
            )}
            sizes="(max-width: 768px) 150px, 192px"
            width={192}
            height={68}
            priority
          />

          <Image
            src="/logo/logo-full-dark.png"
            alt="Pod Pirate logo"
            className={cn(
              "hidden w-auto origin-left dark:block",
              "transition-transform duration-200 ease-out",
              compact ? "scale-90" : "scale-100",
            )}
            sizes="(max-width: 768px) 150px, 192px"
            width={192}
            height={68}
            priority
          />
        </Link>

        {/* User menu */}
        <div className="flex items-center">
          <HeaderUserMenu user={user} compact={compact} />
        </div>
      </nav>
    </header>
  );
}
