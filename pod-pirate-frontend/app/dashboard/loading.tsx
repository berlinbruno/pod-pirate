import { PageSection } from "@/components/layout/PageSection";
import CreatorCardSkeleton from "@/components/skeleton/CreatorCardSkeleton";
import HeaderSkeleton from "@/components/skeleton/Headerskeleton";
import { Separator } from "@/components/ui/separator";

export default function UserDashboardLoading() {
  return (
    <PageSection>
      <HeaderSkeleton variant="stacked" />
      <Separator className="hidden sm:block" />
      <CreatorCardSkeleton />

      <Separator className="hidden sm:block" />
    </PageSection>
  );
}
