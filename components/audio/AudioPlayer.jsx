import { convertSecondsToHMS } from "@/utils/format";
import { Volume1Icon, Volume2Icon, VolumeXIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

const AudioPlayer = ({ src, play, totalTime }) => {
  const audioRef = useRef(null);
  const currentTimeSliderRef = useRef(null);
  const volumeSliderRef = useRef(null);
  const [volume, setVolume] = useState(() => {
    if (typeof window !== "undefined") {
      const storedVolume = parseFloat(localStorage.getItem("volume"));
      return isNaN(storedVolume) ? 1 : storedVolume;
    }
    return 1;
  });
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [volumeBeforeMute, setVolumeBeforeMute] = useState(null);

  useEffect(() => {
    const audioElement = audioRef.current;

    const handleTimeUpdate = () => {
      setCurrentTime(audioElement.currentTime);
    };

    const handleLoadedMetadata = () => {
      if (audioElement.duration !== Infinity) {
        setDuration(audioElement.duration);
      } else {
        setDuration(totalTime);
      }
    };

    audioElement.addEventListener("timeupdate", handleTimeUpdate);
    audioElement.addEventListener("loadedmetadata", handleLoadedMetadata);

    return () => {
      audioElement.removeEventListener("timeupdate", handleTimeUpdate);
      audioElement.removeEventListener("loadedmetadata", handleLoadedMetadata);
    };
  }, [totalTime]);

  useEffect(() => {
    const audioElement = audioRef.current;

    if (play) {
      audioElement.play();
      audioElement.volume = volume;
    } else {
      audioElement.pause();
    }
  }, [play, volume]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("volume", volume.toString());
    }
  }, [volume]);

  const handleSliderChange = (event) => {
    const newTime = event.target.value;
    setCurrentTime(newTime);
    audioRef.current.currentTime = newTime;
  };

  const handleVolumeChange = (event) => {
    const newVolume = parseFloat(event.target.value);
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const handleMuteToggle = () => {
    if (isMuted) {
      setIsMuted(false);
      setVolume(volumeBeforeMute);
    } else {
      setIsMuted(true);
      setVolumeBeforeMute(volume);
      setVolume(0);
    }
  };

  return (
    <section>
      <audio ref={audioRef} src={src} />
      <div className="grid grid-cols-7">
        <div className="flex items-center col-span-6 justify-between w-full">
          <span>{convertSecondsToHMS(currentTime)}</span>
          <Input
            ref={currentTimeSliderRef}
            type="range"
            min={0}
            max={duration}
            value={currentTime}
            onChange={handleSliderChange}
            step={0.01}
            className="p-0 w-full"
          />
          <span>{convertSecondsToHMS(duration)}</span>
        </div>
        <div className="flex">
          <Button onClick={handleMuteToggle} size="icon" variant="ghost">
            {isMuted ? (
              <VolumeXIcon />
            ) : volume < 0.5 ? (
              <Volume1Icon />
            ) : (
              <Volume2Icon />
            )}
          </Button>
          <Input
            ref={volumeSliderRef}
            type="range"
            min={0}
            max={1}
            value={isMuted ? 0 : volume}
            onChange={handleVolumeChange}
            step={0.01}
            className="p-0 hidden sm:block"
          />
        </div>
      </div>
    </section>
  );
};

export default AudioPlayer;
