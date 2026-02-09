import { Skeleton } from "@/components/ui/skeleton";

export default function UserProfilePageHeaderSkeleton() {
  return (
    <div className="space-y-1 sm:space-y-2">
      <Skeleton className="h-7 w-48 sm:h-8 md:h-9" />
      <Skeleton className="h-5 w-80 sm:h-6" />
    </div>
  );
}
