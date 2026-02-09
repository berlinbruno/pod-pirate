"use client";
import { signOut } from "next-auth/react";
import { Button } from "./button";

export default function LogoutButton() {
  const onClick = () => {
    signOut();
  };
  return (
    <Button
      variant={"ghost"}
      onClick={onClick}
      className="focus:bg-accent focus:text-accent-foreground flex w-full cursor-default items-center justify-start gap-2 rounded-sm px-2 py-1.5 text-sm transition-colors outline-none select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&>svg]:size-4 [&>svg]:shrink-0"
    >
      Log out
    </Button>
  );
}
