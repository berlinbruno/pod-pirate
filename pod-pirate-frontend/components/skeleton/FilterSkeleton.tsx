import { Separator } from "../ui/separator";
import { Skeleton } from "../ui/skeleton";

export default function FilterSkeleton() {
  return (
    <div className="space-y-4">
      {/* Search form skeleton */}
      <div className="flex w-full gap-0.5">
        <Skeleton className="h-10 flex-1 rounded-r-none" />
        <Skeleton className="h-10 w-10 rounded-l-none" />
      </div>

      <Separator className="hidden sm:block" />

      {/* Category buttons skeleton */}
      <div className="scrollbar-none [WebkitOverflowScrolling:touch] flex flex-nowrap gap-0.5 overflow-x-auto whitespace-nowrap [-ms-overflow-style:none] [scrollbar-width:none]">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton
            key={i}
            className="h-7 w-20 shrink-0 rounded-none first:rounded-l-lg last:rounded-r-lg"
          />
        ))}
      </div>
    </div>
  );
}
