import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

export default function EpisodeFormSkeleton() {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-6">
          {/* Title and Category Grid */}
          <div>
            {/* Title */}
            <div className="space-y-2">
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Skeleton className="h-5 w-24" />
            <div className="space-y-2">
              <Skeleton className="h-32 w-full rounded-md" />
              <Skeleton className="ml-auto h-4 w-28" />
            </div>
          </div>

          {/* Images Section */}
          <div className="flex flex-col gap-6 lg:flex-row">
            {/* Cover Image */}
            <div className="space-y-2">
              <Skeleton className="h-6 w-48" />
              <div className="space-y-3">
                <div className="bg-muted flex justify-center overflow-hidden rounded-lg border">
                  <Skeleton className="size-52 lg:size-60" />
                </div>
                <Skeleton className="h-10 w-full lg:w-60" />
                <Skeleton className="h-3 w-48" />
              </div>
            </div>

            {/* Banner Image */}
            <div className="flex-1 space-y-2">
              <Skeleton className="h-6 w-48" />
              <div className="space-y-3">
                <Skeleton className="h-52 w-full rounded-lg lg:h-60" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-3 w-52" />
              </div>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex gap-3">
        <Skeleton className="h-10 w-10 rounded-md" />
        <Skeleton className="h-10 flex-1 rounded-md" />
      </CardFooter>
    </Card>
  );
}
