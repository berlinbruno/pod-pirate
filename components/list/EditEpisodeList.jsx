"use client";
import { EditIcon } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import AudioPlayer from "../audio/AudioPlayer";
import EpisodeCard from "../card/EpisodeCard";
import { Button } from "../ui/button";

const EditEpisodeList = ({ episodes }) => {
  const [selectedEpisode, setSelectedEpisode] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [play, setPlay] = useState(false);
  const [duration, setDuration] = useState(null);

  const router = useRouter();
  const pathname = usePathname();

  const handleEpisodeClick = (episode) => {
    if (selectedEpisode === episode?.episodeId) {
      setPlay(!play); // Toggle play state
    } else {
      setSelectedEpisode(episode?.episodeId);
      setAudioUrl(`${episode?.audioUrl}`);
      setPlay(true);
      setDuration(episode?.duration);
    }
  };

  const handleClick = (episodeId) => {
    const url = `${pathname}/${episodeId}`; // Construct edit URL
    router.push(url); // Navigate to edit page
  };

  return (
    <section>
      <h1 className="title">EPISODES</h1>

      {episodes?.map((episode) => (
        <div key={episode?.episodeId} className="cursor-pointer my-1">
          <div onClick={() => handleEpisodeClick(episode)}>
            <EpisodeCard
              episode={episode}
              play={selectedEpisode === episode?.episodeId && play}
            />
            <Button
              onClick={(e) => {
                e.stopPropagation(); // Prevent event bubbling
                handleClick(episode?.episodeId); // Navigate to episode edit page
              }}
              className="my-2"
            >
              <EditIcon />
              <p className="hidden md:block">Edit Episode {episode.episodeId + 1}</p>
            </Button>
          </div>

          {/* Render AudioPlayer only if the episode is selected and is playing */}
          {selectedEpisode === episode?.episodeId && (
            <AudioPlayer src={audioUrl} play={play} totalTime={duration} />
          )}
        </div>
      ))}
    </section>
  );
};

export default EditEpisodeList;
