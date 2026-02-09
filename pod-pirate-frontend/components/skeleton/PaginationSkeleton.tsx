import { Skeleton } from "../ui/skeleton";

export default function PaginationSkeleton() {
  return (
    <div className="flex justify-center">
      <Skeleton className="h-10 w-64" />
    </div>
  );
}
