import FormCardSkeleton from "@/components/skeleton/FormCardSkeleton";
import { Separator } from "@/components/ui/separator";
import { PageSection } from "@/components/layout/PageSection";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import HeaderSkeleton from "@/components/skeleton/Headerskeleton";

export default function AdminProfileLoading() {
  return (
    <PageSection>
      <HeaderSkeleton variant="stacked" />

      <Separator className="hidden sm:block" />

      {/* Profile Image */}
      <FormCardSkeleton contentType="image" footerButtons={3} />

      {/* Username */}
      <FormCardSkeleton contentType="input" />

      {/* Bio */}
      <FormCardSkeleton titleWidth="w-16" contentType="textarea" footerButtons={3} />

      {/* Change Password */}
      <FormCardSkeleton titleWidth="w-40" descriptionWidth="w-72" contentType="double-input" />

      {/* Sign Out */}
      <FormCardSkeleton titleWidth="w-24" descriptionWidth="w-80" contentType="input" />

      {/* Account Deletion */}
      <Card>
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-6 w-40" />
          </CardTitle>
          <CardDescription>
            <Skeleton className="h-4 w-96" />
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Skeleton className="h-10 w-full rounded-md" />
        </CardFooter>
      </Card>
    </PageSection>
  );
}
