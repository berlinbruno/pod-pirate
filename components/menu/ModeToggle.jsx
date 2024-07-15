"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import {
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu";
import { Monitor, MoonIcon, SunIcon, SunMoonIcon } from "lucide-react";

export function ModeToggle() {
  const { setTheme } = useTheme();

  return (
    <DropdownMenuSub>
      <DropdownMenuSubTrigger className=" whitespace-nowrap">
        Toggle theme
      </DropdownMenuSubTrigger>
      <DropdownMenuSubContent align="center">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          Light{" "}
          <DropdownMenuShortcut>
            <SunIcon />
          </DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          Dark{" "}
          <DropdownMenuShortcut>
            {" "}
            <MoonIcon />
          </DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          System{" "}
          <DropdownMenuShortcut>
            <Monitor />
          </DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuSubContent>
    </DropdownMenuSub>
  );
}
