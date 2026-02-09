"use client";
import { useEffect } from "react";
import type { EpisodePublicResponse } from "@/types/api";
import EpisodeCard from "../card/episode/EpisodeCard";
import { useGlobalAudioPlayer } from "@/components/provider/audio-player-provider";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "../ui/empty";
import { ListChecks } from "lucide-react";

interface EpisodeListProps {
  episodes: EpisodePublicResponse[];
}

export default function EpisodeList({ episodes = [] }: EpisodeListProps) {
  const { playEpisode, currentEpisode, isPlaying, setPlaylist } = useGlobalAudioPlayer();

  useEffect(() => {
    if (episodes.length > 0) {
      setPlaylist(episodes);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [episodes]);

  if (episodes.length === 0) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <ListChecks />
          </EmptyMedia>
          <EmptyTitle>No Episodes Yet</EmptyTitle>
          <EmptyDescription>
            This podcast doesn&apos;t have any episodes yet. Check back later for new content.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  return (
    <section className="space-y-4">
      {episodes.map((episode) => (
        <EpisodeCard
          key={episode.episodeId}
          episode={episode}
          play={currentEpisode?.episodeId === episode.episodeId && isPlaying}
          onPlayClick={() => playEpisode(episode)}
        />
      ))}
    </section>
  );
}
