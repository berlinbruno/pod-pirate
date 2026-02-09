import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { Separator } from "../ui/separator";

export default function PodcastCardSkeleton() {
  return (
    <Card className="border-border/50 overflow-hidden p-0">
      {/* Banner */}
      <Skeleton className="h-32 w-full rounded-b-none sm:h-40 md:h-48" />

      {/* Cover Image */}
      <div className="relative px-4 pt-0 pb-0 md:px-6">
        <Skeleton className="border-background relative -mt-22.75 h-32 w-32 rounded-lg border-4 sm:-mt-28.5 sm:h-40 sm:w-40 md:-mt-34.25 md:h-48 md:w-48" />
      </div>

      {/* Content */}
      <div className="space-y-3 p-4 pt-3 md:p-6 md:pt-4">
        {/* Title & Description */}
        <div className="space-y-2">
          <Skeleton className="h-7 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>

        {/* Metadata */}
        <div className="space-y-2 text-xs md:text-sm">
          <div className="flex flex-col items-start gap-x-4 gap-y-2 md:flex-row">
            {/* Creator */}
            <Skeleton className="h-4 w-32 md:h-5" />
            {/* Category */}
            <Skeleton className="h-4 w-24 md:h-5" />
            {/* Episode count */}
            <Skeleton className="h-4 w-28 md:h-5" />
          </div>

          <Separator />

          {/* Stats */}
          <div className="flex flex-col items-start gap-x-4 gap-y-2 md:flex-row">
            <Skeleton className="h-4 w-40 md:h-5" />
            <Skeleton className="h-4 w-40 md:h-5" />
          </div>
        </div>
      </div>
    </Card>
  );
}
