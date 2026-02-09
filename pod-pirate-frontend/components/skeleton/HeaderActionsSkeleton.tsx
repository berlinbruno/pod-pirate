import { Skeleton } from "@/components/ui/skeleton";

export default function HeaderActionsSkeleton() {
  return (
    <div className="space-y-4">
      {/* Header skeleton */}
      <div className="flex items-center gap-2 sm:gap-3">
        <Skeleton className="h-9 w-9 shrink-0 rounded-full sm:h-10 sm:w-24" />
        <Skeleton className="h-6 w-48 sm:h-7 sm:w-64" />
      </div>

      {/* Action Bar skeleton */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Left button group */}
        <Skeleton className="h-10 w-10 md:w-32" />
        <Skeleton className="h-10 w-10 lg:w-32" />

        <div className="flex-1"></div>

        {/* Right button group */}
        <Skeleton className="h-10 w-10 lg:w-40" />
        <Skeleton className="h-10 w-10 lg:w-40" />
        <Skeleton className="h-10 w-10 md:w-28" />
      </div>
    </div>
  );
}
