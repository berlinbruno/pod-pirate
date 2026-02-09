import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import AudioPlayer from "./AudioPlayer";
import { UseAudioPlayerReturn } from "@/hooks/use-audio-player";

interface AudioDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  audioPlayer: UseAudioPlayerReturn;
  onNext: () => void;
  onPrevious: () => void;
  hasNext: boolean;
  hasPrevious: boolean;
  autoPlayNext: boolean;
  onAutoPlayChange: (value: boolean) => void;
}

export default function AudioDrawer({
  open,
  onOpenChange,
  title,
  audioPlayer,
  onNext,
  onPrevious,
  hasNext,
  hasPrevious,
  autoPlayNext,
  onAutoPlayChange,
}: AudioDrawerProps) {
  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[85vh]">
        <DrawerHeader>
          <DrawerTitle className="text-center">{title}</DrawerTitle>
        </DrawerHeader>
        <div className="px-4 pb-4">
          <AudioPlayer
            audioPlayer={audioPlayer}
            onNext={onNext}
            onPrevious={onPrevious}
            hasNext={hasNext}
            hasPrevious={hasPrevious}
            autoPlayNext={autoPlayNext}
            onAutoPlayChange={onAutoPlayChange}
          />
        </div>
      </DrawerContent>
    </Drawer>
  );
}
