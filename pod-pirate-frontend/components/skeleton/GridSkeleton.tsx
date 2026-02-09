import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardHeader } from "@/components/ui/card";
import { Separator } from "../ui/separator";

export default function GridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid w-full grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <Card key={i} className="h-full overflow-hidden pt-0">
          <CardHeader className="space-y-0 p-0">
            {/* Cover Image */}
            <Skeleton className="aspect-square w-full rounded-t-lg rounded-b-none" />

            {/* Content */}
            <div className="space-y-2 p-3">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Separator />
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </CardHeader>
        </Card>
      ))}
    </div>
  );
}
