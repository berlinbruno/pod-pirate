import PodcastCardSkeleton from "@/components/skeleton/PodcastCardSkeleton";
import { Separator } from "@/components/ui/separator";
import { PageSection } from "@/components/layout/PageSection";
import EpisodeListSkeleton from "@/components/skeleton/EpisodeListSkeleton";
import HeaderActionsSkeleton from "@/components/skeleton/HeaderActionsSkeleton";
import HeaderSkeleton from "@/components/skeleton/Headerskeleton";

export default function DashboardPodcastDetailLoading() {
  return (
    <PageSection>
      <HeaderSkeleton variant="stacked" />

      <Separator className="hidden sm:block" />
      <PodcastCardSkeleton />

      <HeaderActionsSkeleton />

      <EpisodeListSkeleton />
    </PageSection>
  );
}
