import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { Separator } from "../ui/separator";

export default function CreatorCardSkeleton() {
  return (
    <Card className="border-border/50 overflow-hidden p-0 sm:flex sm:flex-row">
      {/* Profile Picture */}
      <div className="bg-muted flex w-full items-center justify-center sm:w-fit">
        <div className="size-48">
          <Skeleton className="h-full w-full rounded-full" />
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col space-y-2.5 p-3 md:p-6">
        <div className="flex-1 space-y-2">
          {/* Title */}
          <Skeleton className="h-5 w-48 md:h-7 lg:h-8" />

          {/* Bio */}
          <Skeleton className="h-3.5 w-full md:h-4" />
          <Skeleton className="h-3.5 w-3/4 md:h-4" />
          <Skeleton className="hidden h-4 w-2/3 md:block" />
        </div>

        {/* Metadata */}
        <div className="mt-auto flex flex-wrap items-center gap-4">
          {/* Podcast Count */}
          <div className="flex items-center gap-1.5">
            <Skeleton className="h-3.5 w-3.5 md:h-4 md:w-4" />
            <Skeleton className="h-3.5 w-20 md:h-4 md:w-24" />
          </div>

          <Separator orientation="vertical" className="h-4 md:h-5" />

          {/* Join Date */}
          <div className="flex items-center gap-1.5">
            <Skeleton className="h-3.5 w-3.5 md:h-4 md:w-4" />
            <Skeleton className="h-3.5 w-28 md:h-4 md:w-32" />
          </div>
        </div>
      </div>
    </Card>
  );
}
