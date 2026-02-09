import { convertSecondsToHMS } from "@/utils/format";
import {
  Volume1Icon,
  Volume2Icon,
  VolumeXIcon,
  PlayIcon,
  PauseIcon,
  SkipForwardIcon,
  SkipBackIcon,
} from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";
import { Slider } from "../ui/slider";
import { Switch } from "../ui/switch";
import { UseAudioPlayerReturn } from "@/hooks/use-audio-player";

interface AudioPlayerProps {
  audioPlayer: UseAudioPlayerReturn;
  onNext: () => void;
  onPrevious: () => void;
  hasNext: boolean;
  hasPrevious: boolean;
  autoPlayNext: boolean;
  onAutoPlayChange: (value: boolean) => void;
}

export default function AudioPlayer({
  audioPlayer,
  onNext,
  onPrevious,
  hasNext,
  hasPrevious,
  autoPlayNext,
  onAutoPlayChange,
}: AudioPlayerProps) {
  const [isSeeking, setIsSeeking] = useState<boolean>(false);
  const [seekValue, setSeekValue] = useState<number>(0);

  const handleSliderChange = (value: number[]) => {
    setSeekValue(value[0]);
  };

  const handleSliderCommit = (value: number[]) => {
    setIsSeeking(false);
    audioPlayer.commitSeek(value[0]);
  };

  const handleSliderStart = () => {
    setIsSeeking(true);
    setSeekValue(audioPlayer.currentTime);
    audioPlayer.startSeeking();
  };

  const displayTime = isSeeking ? seekValue : audioPlayer.currentTime;

  return (
    <div className="flex flex-col gap-6">
      {/* Progress Section */}
      <div className="space-y-2">
        <Slider
          value={[displayTime]}
          max={audioPlayer.duration > 0 ? audioPlayer.duration : 100}
          step={0.01}
          onValueChange={handleSliderChange}
          onValueCommit={handleSliderCommit}
          onPointerDown={handleSliderStart}
          className="cursor-pointer"
          disabled={audioPlayer.duration === 0}
        />
        <div className="text-muted-foreground flex justify-between text-xs">
          <span className="font-medium">{convertSecondsToHMS(displayTime)}</span>
          <span className="font-medium">{convertSecondsToHMS(audioPlayer.duration)}</span>
        </div>
      </div>

      {/* Controls Section */}
      <div className="flex items-center justify-center gap-2">
        <Button
            onClick={onPrevious}
            size="icon"
            variant="outline"
            disabled={!hasPrevious}
            className="h-9 w-9"
          >
            <SkipBackIcon className="h-4 w-4" />
          </Button>
          <Button onClick={audioPlayer.togglePlay} size="icon" className="h-10 w-10">
            {audioPlayer.isPlaying ? (
              <PauseIcon className="h-5 w-5" />
            ) : (
              <PlayIcon className="h-5 w-5" />
            )}
          </Button>
          <Button
            onClick={onNext}
            size="icon"
            variant="outline"
            disabled={!hasNext}
            className="h-9 w-9"
          >
            <SkipForwardIcon className="h-4 w-4" />
        </Button>
      </div>

      {/* Volume and Auto-play Section */}
      <div className="flex items-center justify-between gap-8">
        {/* Volume Control */}
        <div className="flex w-56 items-center gap-3">
          <Button onClick={audioPlayer.toggleMute} size="icon" variant="ghost" className="shrink-0">
            {audioPlayer.isMuted ? (
              <VolumeXIcon className="h-4 w-4" />
            ) : audioPlayer.volume < 0.5 ? (
              <Volume1Icon className="h-4 w-4" />
            ) : (
              <Volume2Icon className="h-4 w-4" />
            )}
          </Button>
          <div className="flex-1">
            <Slider
              value={[audioPlayer.isMuted ? 0 : audioPlayer.volume]}
              max={1}
              step={0.01}
              onValueChange={(value: number[]) => audioPlayer.setVolume(value[0])}
              className="cursor-pointer"
            />
          </div>
          <span className="text-muted-foreground min-w-10 text-right text-xs font-medium">
            {Math.round((audioPlayer.isMuted ? 0 : audioPlayer.volume) * 100)}%
          </span>
        </div>

        {/* Auto-play Control */}
        <div className="flex items-center gap-3">
          <span className="text-muted-foreground text-xs font-medium">Auto-play</span>
          <Switch checked={autoPlayNext} onCheckedChange={onAutoPlayChange} />
        </div>
      </div>
    </div>
  );
}
