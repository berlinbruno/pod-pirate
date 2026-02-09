import PodcastCardSkeleton from "@/components/skeleton/PodcastCardSkeleton";
import EpisodeListSkeleton from "@/components/skeleton/EpisodeListSkeleton";
import { Separator } from "@/components/ui/separator";
import { PageSection } from "@/components/layout/PageSection";
import Headerskeleton from "@/components/skeleton/Headerskeleton";

export default function PublicPodcastDetailLoading() {
  return (
    <PageSection>
      <PodcastCardSkeleton />

      <Separator className="hidden sm:block" />

      <Headerskeleton />

      <EpisodeListSkeleton />
    </PageSection>
  );
}
