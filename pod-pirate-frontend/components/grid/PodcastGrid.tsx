import type { PodcastPublicResponse } from "@/types/api";
import PodcastGridCard from "../card/grid/PodcastGridCard";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "../ui/empty";
import { Mic2 } from "lucide-react";

interface PodcastGridProps {
  podcasts: ReadonlyArray<PodcastPublicResponse>;
}

export default function PodcastGrid({ podcasts }: PodcastGridProps) {
  if (podcasts.length === 0) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Mic2 />
          </EmptyMedia>
          <EmptyTitle>No Podcasts Yet</EmptyTitle>
        </EmptyHeader>
        <EmptyContent>
          <EmptyDescription>There are no podcasts available at the moment.</EmptyDescription>
        </EmptyContent>
      </Empty>
    );
  }

  return (
    <article className="grid w-full grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-4">
      {podcasts.map((podcast) => (
        <PodcastGridCard key={podcast.podcastId} podcast={podcast} />
      ))}
    </article>
  );
}
