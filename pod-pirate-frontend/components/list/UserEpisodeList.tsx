"use client";
import { useEffect } from "react";
import type { EpisodeDetailResponse } from "@/types/api";
import { useGlobalAudioPlayer } from "@/components/provider/audio-player-provider";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { Plus, ListChecks } from "lucide-react";
import UserEpisodeCard from "../card/episode/UserEpisodeCard";
import EpisodeActionsMenu from "../action/EpisodeActionsMenu";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "../ui/empty";

interface UserEpisodeListProps {
  episodes: EpisodeDetailResponse[];
  podcastId: string;
}

export default function UserEpisodeList({ episodes = [], podcastId }: UserEpisodeListProps) {
  const { playEpisode, currentEpisode, isPlaying, setPlaylist } = useGlobalAudioPlayer();
  const router = useRouter();

  useEffect(() => {
    if (episodes.length > 0) {
      const playableEpisodes = episodes.map((ep) => ({
        episodeId: ep.episodeId,
        title: ep.title,
        audioUrl: ep.audioUrl,
        description: ep.description,
      }));
      setPlaylist(playableEpisodes);
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
        <Button
          onClick={() => router.push(`/dashboard/podcasts/${podcastId}/episodes/new`)}
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          Create Your First Episode
        </Button>
      </Empty>
    );
  }

  return (
    <section className="space-y-4">
      {episodes.map((episode) => (
        <div key={episode.episodeId} className="flex flex-col gap-3 md:flex-row md:items-start">
          <div className="flex-1">
            <UserEpisodeCard
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
          <EpisodeActionsMenu episode={episode} podcastId={podcastId} />
        </div>
      ))}
    </section>
  );
}
