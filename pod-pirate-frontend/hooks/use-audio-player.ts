import { useRef, useState, useEffect, useCallback } from "react";

export interface UseAudioPlayerReturn {
  audioRef: React.RefObject<HTMLAudioElement | null>;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  setSource: (src: string | null) => void;
  play: () => void;
  pause: () => void;
  togglePlay: () => void;
  seek: (time: number) => void;
  startSeeking: () => void;
  commitSeek: (time: number) => void;
  setVolume: (vol: number) => void;
  toggleMute: () => void;
}

interface UseAudioPlayerOptions {
  onEnded?: () => void;
}

export function useAudioPlayer(options?: UseAudioPlayerOptions): UseAudioPlayerReturn {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isSeeking, setIsSeeking] = useState(false);
  const [wasPlayingBeforeSeek, setWasPlayingBeforeSeek] = useState(false);

  const [volume, setVolumeState] = useState(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("volume");
      return stored ? parseFloat(stored) : 1;
    }
    return 1;
  });

  const [isMuted, setIsMuted] = useState(false);
  const [volumeBeforeMute, setVolumeBeforeMute] = useState(1);

  // Set source and reset state
  const setSource = useCallback(
    (src: string | null) => {
      const audio = audioRef.current;
      if (!audio) return;

      const shouldResume = isPlaying;

      if (isPlaying) {
        audio.pause();
      }

      audio.src = src || "";
      setCurrentTime(0);
      setDuration(0);

      if (src) {
        audio.load();
        if (shouldResume) {
          const playPromise = audio.play();
          if (playPromise) {
            playPromise.catch(() => {
              setIsPlaying(false);
            });
          }
        }
      } else {
        setIsPlaying(false);
      }
    },
    [isPlaying],
  );

  // Play
  const play = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || !audio.src) return;

    const playPromise = audio.play();
    if (playPromise) {
      playPromise.then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    }
  }, []);

  // Pause
  const pause = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.pause();
    setIsPlaying(false);
  }, []);

  // Toggle play/pause
  const togglePlay = useCallback(() => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  }, [isPlaying, play, pause]);

  // Seek (immediate)
  const seek = useCallback((time: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = time;
    setCurrentTime(time);
  }, []);

  // Start seeking (pause if playing)
  const startSeeking = useCallback(() => {
    setIsSeeking(true);
    setWasPlayingBeforeSeek(isPlaying);
    if (isPlaying) {
      pause();
    }
  }, [isPlaying, pause]);

  // Commit seek (resume if was playing)
  const commitSeek = useCallback(
    (time: number) => {
      const audio = audioRef.current;
      if (!audio) return;

      audio.currentTime = time;
      setCurrentTime(time);
      setIsSeeking(false);

      if (wasPlayingBeforeSeek) {
        play();
      }
    },
    [wasPlayingBeforeSeek, play],
  );

  // Set volume
  const setVolume = useCallback((vol: number) => {
    const audio = audioRef.current;
    if (!audio) return;

    const clampedVol = Math.max(0, Math.min(1, vol));
    audio.volume = clampedVol;
    setVolumeState(clampedVol);
    setIsMuted(clampedVol === 0);

    if (typeof window !== "undefined") {
      localStorage.setItem("volume", clampedVol.toString());
    }
  }, []);

  // Toggle mute
  const toggleMute = useCallback(() => {
    if (isMuted) {
      setVolume(volumeBeforeMute);
      setIsMuted(false);
    } else {
      setVolumeBeforeMute(volume);
      setVolume(0);
      setIsMuted(true);
    }
  }, [isMuted, volume, volumeBeforeMute, setVolume]);

  // Audio event listeners
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      if (!isSeeking) {
        setCurrentTime(audio.currentTime);
      }
    };

    const handleLoadedMetadata = () => {
      if (audio.duration && audio.duration !== Infinity) {
        setDuration(audio.duration);
      }
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
      if (options?.onEnded) {
        options.onEnded();
      }
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);

    // Initialize volume
    audio.volume = volume;

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
    };
  }, [isSeeking, volume, options]);

  return {
    audioRef,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    setSource,
    play,
    pause,
    togglePlay,
    seek,
    startSeeking,
    commitSeek,
    setVolume,
    toggleMute,
  };
}
