import { Button } from "@/components/ui/button";
import { PlayIcon, PauseIcon, XIcon, SkipBackIcon, SkipForwardIcon } from "lucide-react";

interface MiniPlayerProps {
  title: string;
  subtitle: string;
  isPlaying: boolean;
  onPlayPause: () => void;
  onNext: () => void;
  onPrevious: () => void;
  hasNext: boolean;
  hasPrevious: boolean;
  onExpand: () => void;
  onClose: () => void;
}

export default function MiniPlayer({
  title,
  subtitle,
  isPlaying,
  onPlayPause,
  onNext,
  onPrevious,
  hasNext,
  hasPrevious,
  onExpand,
  onClose,
}: MiniPlayerProps) {
  return (
    <div
      onClick={onExpand}
      className="border-border bg-background cursor-pointer border-t shadow-lg transition-colors"
    >
      <div className="container mx-auto px-4 py-3">
        <div className="grid grid-cols-3 items-center gap-4">
          <div className="flex min-w-0 flex-col">
            <p className="line-clamp-1 text-sm font-medium">{title}</p>
            <p className="text-muted-foreground line-clamp-1 text-xs">{subtitle}</p>
          </div>
          <div className="flex items-center justify-center gap-2">
            <Button
              onClick={(e) => {
                e.stopPropagation();
                onPrevious();
              }}
              size="icon"
              variant="outline"
              disabled={!hasPrevious}
              className="h-9 w-9"
            >
              <SkipBackIcon className="h-4 w-4" />
            </Button>
            <Button
              onClick={(e) => {
                e.stopPropagation();
                onPlayPause();
              }}
              size="icon"
              className="h-10 w-10"
            >
              {isPlaying ? <PauseIcon className="h-5 w-5" /> : <PlayIcon className="h-5 w-5" />}
            </Button>
            <Button
              onClick={(e) => {
                e.stopPropagation();
                onNext();
              }}
              size="icon"
              variant="outline"
              disabled={!hasNext}
              className="h-9 w-9"
            >
              <SkipForwardIcon className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex justify-end">
            <Button
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
              size="icon"
              variant="ghost"
              className="h-9 w-9"
            >
              <XIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
