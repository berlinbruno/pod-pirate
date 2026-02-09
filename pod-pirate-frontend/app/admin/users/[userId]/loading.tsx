import { PageSection } from "@/components/layout/PageSection";
import CreatorCardSkeleton from "@/components/skeleton/CreatorCardSkeleton";
import HeaderActionsSkeleton from "@/components/skeleton/HeaderActionsSkeleton";
import HeaderSkeleton from "@/components/skeleton/Headerskeleton";
import { Separator } from "@/components/ui/separator";

export default function AdminUserDetailLoading() {
  return (
    <PageSection>
      <HeaderSkeleton variant="stacked" />
      <Separator className="hidden sm:block" />
      <HeaderActionsSkeleton />
      <CreatorCardSkeleton />
    </PageSection>
  );
}
