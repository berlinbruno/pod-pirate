"use client";
import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
  useEffect,
  useRef,
} from "react";
import MiniPlayer from "@/components/audio/MiniPlayer";
import AudioDrawer from "@/components/audio/AudioDrawer";
import { useAudioPlayer } from "@/hooks/use-audio-player";

interface Episode {
  episodeId: number;
  title: string;
  audioUrl: string;
  description?: string;
}

interface AudioPlayerContextType {
  currentEpisode: Episode | null;
  isPlaying: boolean;
  autoPlayNext: boolean;
  setAutoPlayNext: (value: boolean) => void;
  playEpisode: (episode: Episode) => void;
  togglePlay: () => void;
  playNext: () => void;
  playPrevious: () => void;
  setPlaylist: (episodes: Episode[], currentIndex?: number) => void;
  clearPlaylist: () => void;
}

const AudioPlayerContext = createContext<AudioPlayerContextType | undefined>(undefined);

export function AudioPlayerProvider({ children }: { children: ReactNode }) {
  const [currentEpisode, setCurrentEpisode] = useState<Episode | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [playlist, setPlaylistState] = useState<Episode[]>([]);
  const [autoPlayNext, setAutoPlayNext] = useState(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("autoPlayNext");
      return stored ? stored === "true" : true;
    }
    return true;
  });
  const prevEpisodeRef = useRef<Episode | null>(null);

  const handleEnded = useCallback(() => {
    if (autoPlayNext) {
      const currentIdx = playlist.findIndex((ep) => ep.episodeId === currentEpisode?.episodeId);
      if (currentIdx >= 0 && currentIdx < playlist.length - 1) {
        const nextEpisode = playlist[currentIdx + 1];
        setCurrentEpisode(nextEpisode);
      }
    }
  }, [autoPlayNext, playlist, currentEpisode]);

  const audioPlayer = useAudioPlayer({ onEnded: handleEnded });
  const {
    isPlaying,
    audioRef,
    togglePlay: audioTogglePlay,
    play: audioPlay,
    pause: audioPause,
    setSource: audioSetSource,
  } = audioPlayer;

  // Handle auto-play when episode changes due to handleEnded
  useEffect(() => {
    if (
      currentEpisode &&
      prevEpisodeRef.current &&
      currentEpisode.episodeId !== prevEpisodeRef.current.episodeId
    ) {
      // Episode changed, check if it was from auto-play (ending of previous track)
      const prevIdx = playlist.findIndex(
        (ep) => ep.episodeId === prevEpisodeRef.current?.episodeId,
      );
      const currentIdx = playlist.findIndex((ep) => ep.episodeId === currentEpisode.episodeId);

      if (prevIdx >= 0 && currentIdx === prevIdx + 1) {
        // This is auto-play to next episode
        audioSetSource(currentEpisode.audioUrl);
        audioPlay();
      }
    }
    prevEpisodeRef.current = currentEpisode;
  }, [currentEpisode, playlist, audioSetSource, audioPlay]);

  const currentIndex =
    currentEpisode && playlist.length > 0
      ? playlist.findIndex((ep) => ep.episodeId === currentEpisode.episodeId)
      : -1;

  const hasNext = currentIndex >= 0 && currentIndex < playlist.length - 1;
  const hasPrevious = currentIndex > 0;

  const playEpisode = useCallback(
    (episode: Episode) => {
      if (currentEpisode?.episodeId === episode.episodeId) {
        if (!isDrawerOpen) {
          setIsDrawerOpen(true);
        } else {
          audioTogglePlay();
        }
      } else {
        setCurrentEpisode(episode);
        audioSetSource(episode.audioUrl);
        audioPlay();

        if (currentEpisode === null) {
          setIsDrawerOpen(true);
        }
      }
    },
    [currentEpisode, isDrawerOpen, audioTogglePlay, audioSetSource, audioPlay],
  );

  const togglePlay = useCallback(() => {
    audioTogglePlay();
  }, [audioTogglePlay]);

  const playNext = useCallback(() => {
    if (currentIndex < 0 || currentIndex >= playlist.length - 1) return;

    const nextEpisode = playlist[currentIndex + 1];
    setCurrentEpisode(nextEpisode);
    audioSetSource(nextEpisode.audioUrl);
    audioPlay();
  }, [currentIndex, playlist, audioSetSource, audioPlay]);

  const playPrevious = useCallback(() => {
    if (currentIndex <= 0) return;

    const prevEpisode = playlist[currentIndex - 1];
    setCurrentEpisode(prevEpisode);
    audioSetSource(prevEpisode.audioUrl);
    audioPlay();
  }, [currentIndex, playlist, audioSetSource, audioPlay]);

  const setPlaylist = useCallback(
    (episodes: Episode[], currentIdx?: number) => {
      setPlaylistState(episodes);
      if (currentIdx !== undefined && episodes[currentIdx]) {
        playEpisode(episodes[currentIdx]);
      }
    },
    [playEpisode],
  );

  const clearPlaylist = useCallback(() => {
    setPlaylistState([]);
    setCurrentEpisode(null);
    audioSetSource(null);
    setIsDrawerOpen(false);
  }, [audioSetSource]);

  const toggleAutoPlayNext = useCallback((value: boolean) => {
    setAutoPlayNext(value);
    if (typeof window !== "undefined") {
      localStorage.setItem("autoPlayNext", value.toString());
    }
  }, []);

  const handleClose = useCallback(() => {
    audioPause();
    setCurrentEpisode(null);
    audioSetSource(null);
  }, [audioPause, audioSetSource]);

  const showMiniPlayer = currentEpisode && !isDrawerOpen;

  return (
    <AudioPlayerContext.Provider
      value={{
        currentEpisode,
        isPlaying,
        autoPlayNext,
        setAutoPlayNext: toggleAutoPlayNext,
        playEpisode,
        togglePlay,
        playNext,
        playPrevious,
        setPlaylist,
        clearPlaylist,
      }}
    >
      <div className={showMiniPlayer ? "pb-20" : ""}>{children}</div>

      {showMiniPlayer && (
        <div className="fixed right-0 bottom-0 left-0 z-40">
          <MiniPlayer
            title={currentEpisode.title}
            subtitle={`Episode ${currentEpisode.episodeId + 1}`}
            isPlaying={isPlaying}
            onPlayPause={audioTogglePlay}
            onNext={playNext}
            onPrevious={playPrevious}
            hasNext={hasNext}
            hasPrevious={hasPrevious}
            onExpand={() => setIsDrawerOpen(true)}
            onClose={handleClose}
          />
        </div>
      )}

      <audio ref={audioRef} />

      <AudioDrawer
        open={isDrawerOpen}
        onOpenChange={setIsDrawerOpen}
        title={currentEpisode?.title || "Now Playing"}
        audioPlayer={audioPlayer}
        onNext={playNext}
        onPrevious={playPrevious}
        hasNext={hasNext}
        hasPrevious={hasPrevious}
        autoPlayNext={autoPlayNext}
        onAutoPlayChange={toggleAutoPlayNext}
      />
    </AudioPlayerContext.Provider>
  );
}

export function useGlobalAudioPlayer() {
  const context = useContext(AudioPlayerContext);
  if (context === undefined) {
    throw new Error("useGlobalAudioPlayer must be used within AudioPlayerProvider");
  }
  return context;
}
