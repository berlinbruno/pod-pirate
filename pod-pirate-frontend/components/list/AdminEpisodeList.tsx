"use client";
import { useEffect } from "react";
import { useGlobalAudioPlayer } from "@/components/provider/audio-player-provider";
import AdminEpisodeCard from "../card/episode/AdminEpisodeCard";
import AdminEpisodeActionsMenu from "../action/AdminEpisodeActionsMenu";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "../ui/empty";
import { ListChecks } from "lucide-react";
import { EpisodeDetailResponse } from "@/types/api";

interface AdminEpisodeListProps {
  episodes: EpisodeDetailResponse[];
  podcastId: string;
}

export default function AdminEpisodeList({ episodes = [], podcastId }: AdminEpisodeListProps) {
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
          <EmptyDescription>This podcast doesn&apos;t have any episodes yet.</EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  return (
    <section className="space-y-3">
      {episodes.map((episode) => (
        <div key={episode.episodeId} className="flex flex-col gap-3 md:flex-row md:items-start">
          {/* Episode Card - Clickable to play */}
          <div className="flex-1 cursor-pointer">
            <AdminEpisodeCard
              episode={episode}
              play={currentEpisode?.episodeId === episode.episodeId && isPlaying}
              onPlayClick={() =>
                playEpisode({
                  episodeId: episode.episodeId,
                  title: episode.title,
                  audioUrl: episode.audioUrl,
                  description: episode.description,
                })
              }
            />
          </div>
          {/* Actions Menu */}
          <AdminEpisodeActionsMenu episode={episode} podcastId={podcastId} />
        </div>
      ))}
    </section>
  );
}
