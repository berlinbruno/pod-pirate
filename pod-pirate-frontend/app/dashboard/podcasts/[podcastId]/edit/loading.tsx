import { Separator } from "@/components/ui/separator";
import { PageSection } from "@/components/layout/PageSection";
import PodcastFormSkeleton from "@/components/skeleton/PodcastFormSkeleton";
import HeaderSkeleton from "@/components/skeleton/Headerskeleton";

export default function DashboardEditPodcastLoading() {
  return (
    <PageSection>
      <HeaderSkeleton variant="stacked" />
      <Separator className="hidden sm:block" />
      <PodcastFormSkeleton />
    </PageSection>
  );
}
