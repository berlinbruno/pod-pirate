"use client";

import { Button } from "../ui/button";
import { ArrowLeftIcon } from "lucide-react";
import { useRouter } from "next/navigation";

interface BackPageHeaderProps {
  title: string;
  highlight?: string;
  count?: number;
}

export default function BackPageHeader({ title, highlight, count }: BackPageHeaderProps) {
  const router = useRouter();

  return (
    <div className="flex items-center gap-2 sm:gap-3">
      <Button
        variant="outline"
        size="icon"
        className="h-9 w-9 shrink-0 rounded-full sm:h-10 sm:w-auto sm:px-4"
        onClick={() => router.back()}
        aria-label="Go back"
      >
        <ArrowLeftIcon className="h-4 w-4" />
        <span className="ml-2 hidden sm:inline">Back</span>
      </Button>

      <h1 className="line-clamp-2 text-sm leading-tight font-semibold sm:text-base md:text-lg lg:text-xl">
        {title} {highlight && <span className="text-primary">{highlight}</span>}{" "}
        {typeof count === "number" && <span className="text-muted-foreground">({count})</span>}
      </h1>
    </div>
  );
}
