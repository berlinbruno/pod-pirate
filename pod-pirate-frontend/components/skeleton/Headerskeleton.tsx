import { Skeleton } from "../ui/skeleton";
import { cn } from "@/lib/utils";

type HeaderSkeletonVariant = "header" | "stacked";

interface HeaderSkeletonProps {
  variant?: HeaderSkeletonVariant;
  className?: string;
}

export default function HeaderSkeleton({ variant = "header", className }: HeaderSkeletonProps) {
  if (variant === "stacked") {
    return (
      <div className={cn("space-y-1 sm:space-y-2", className)}>
        <Skeleton className="h-7 w-64 sm:h-8 md:h-9" />
        <Skeleton className="h-5 w-80 sm:h-6" />
      </div>
    );
  }

  // header (default)
  return (
    <div className={cn("flex items-center gap-2 sm:gap-3", className)}>
      <Skeleton className="h-9 w-9 shrink-0 rounded-full sm:h-10 sm:w-24" />
      <Skeleton className="h-6 w-48 sm:h-7 sm:w-64" />
    </div>
  );
}
