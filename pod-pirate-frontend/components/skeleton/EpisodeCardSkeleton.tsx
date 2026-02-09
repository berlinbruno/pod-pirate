import { Skeleton } from "../ui/skeleton";
import { Separator } from "../ui/separator";
import { Card } from "../ui/card";

export default function EpisodeCardSkeleton() {
  return (
    <Card className="border-border/50 overflow-hidden p-0">
      <div className="xs:flex-row flex flex-col">
        {/* Cover Image */}
        <div className="bg-muted xs:size-50 xs:rounded-br-lg relative overflow-hidden md:shrink-0 lg:size-56">
          <Skeleton className="aspect-square h-full w-full" />
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col justify-between space-y-3 p-4 pb-0 md:p-6 md:pb-0">
          <div>
            {/* Title */}
            <Skeleton className="mb-2 h-4 w-3/4 md:h-5 lg:h-6" />

            {/* Description */}
            <Skeleton className="h-3 w-full md:h-4" />
            <Skeleton className="mt-1 h-3 w-5/6 md:h-4" />
            <Skeleton className="mt-1 h-3 w-4/5 md:h-4" />
          </div>

          {/* Duration */}
          <div className="flex items-center gap-1.5">
            <Skeleton className="h-3.5 w-3.5 md:h-4 md:w-4" />
            <Skeleton className="h-3 w-16 md:h-4 md:w-20" />
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="flex flex-row flex-wrap items-center gap-x-4 gap-y-2 p-4 pt-3 md:p-6 md:pt-4">
        <Separator aria-hidden="true" />
        {/* Published Date */}
        <div className="flex items-center gap-1.5">
          <Skeleton className="h-3.5 w-3.5 md:h-4 md:w-4" />
          <Skeleton className="h-3 w-40 md:h-4 md:w-48" />
        </div>
      </div>
    </Card>
  );
}
