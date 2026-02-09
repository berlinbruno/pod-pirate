import type { AdminPodcastResponse } from "@/types/api";
import AdminPodcastGridCard from "../card/grid/AdminPodcastGridCard";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "../ui/empty";
import { Mic2 } from "lucide-react";

interface AdminPodcastGridProps {
  podcasts: ReadonlyArray<AdminPodcastResponse>;
}

export default function AdminPodcastGrid({ podcasts }: AdminPodcastGridProps) {
  if (podcasts.length === 0) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Mic2 />
          </EmptyMedia>
          <EmptyTitle>No Podcasts Found</EmptyTitle>
          <EmptyDescription>Try adjusting your search or filters.</EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  return (
    <article className="grid w-full grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-4">
      {podcasts.map((podcast) => (
        <AdminPodcastGridCard key={podcast.podcastId} podcast={podcast} />
      ))}
    </article>
  );
}
