import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface FormCardSkeletonProps {
  titleWidth?: string;
  descriptionWidth?: string;
  contentType?: "image" | "input" | "textarea" | "double-input";
  footerButtons?: number;
}

export default function FormCardSkeleton({
  titleWidth = "w-32",
  descriptionWidth = "w-64",
  contentType = "input",
  footerButtons = 2,
}: FormCardSkeletonProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <Skeleton className={`h-6 ${titleWidth}`} />
        </CardTitle>
        <CardDescription>
          <Skeleton className={`h-4 ${descriptionWidth}`} />
        </CardDescription>
      </CardHeader>
      <CardContent>
        {contentType === "image" && (
          <div className="flex items-center gap-4 sm:gap-6">
            <Skeleton className="h-20 w-20 shrink-0 rounded-full sm:h-24 sm:w-24" />
            <Skeleton className="h-10 w-32" />
          </div>
        )}

        {contentType === "input" && (
          <div className="space-y-2">
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-4 w-72" />
          </div>
        )}

        {contentType === "textarea" && (
          <div className="space-y-2">
            <Skeleton className="h-5 w-16" />
            <div className="space-y-2">
              <Skeleton className="h-32 w-full rounded-md" />
              <Skeleton className="ml-auto h-4 w-28" />
            </div>
            <Skeleton className="h-4 w-96" />
          </div>
        )}

        {contentType === "double-input" && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-5 w-28" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex gap-3">
        <Skeleton className="h-10 w-10" />
        {Array.from({ length: footerButtons - 1 }).map((_, i) => (
          <Skeleton key={i} className="h-10 w-24" />
        ))}
      </CardFooter>
    </Card>
  );
}
