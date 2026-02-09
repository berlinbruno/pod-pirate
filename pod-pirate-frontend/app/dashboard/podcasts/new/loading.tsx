import PodcastFormSkeleton from "@/components/skeleton/PodcastFormSkeleton";
import { Separator } from "@/components/ui/separator";
import { PageSection } from "@/components/layout/PageSection";
import HeaderSkeleton from "@/components/skeleton/Headerskeleton";

export default function DashboardNewPodcastLoading() {
  return (
    <PageSection>
      <HeaderSkeleton variant="stacked" />
      <Separator className="hidden sm:block" />
      <PodcastFormSkeleton />
    </PageSection>
  );
}
