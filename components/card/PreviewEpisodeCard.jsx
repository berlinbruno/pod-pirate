import { convertSecondsToHMS } from "@/utils/format";
import { PauseIcon, PlayIcon } from "lucide-react";
import { Badge } from "../ui/badge";
import { Card, CardDescription, CardHeader, CardTitle } from "../ui/card";

const PreviewEpisodeCard = ({ episode, play }) => {
  const time = convertSecondsToHMS(episode?.duration);

  return (
    <Card>
      <div className="flex flex-col sm:flex-row items-center sm:items-stretch">
        <CardHeader className="items-center flex-shrink-0">
          {play ? (
            <PauseIcon
              size={40}
              className="bg-slate-800 rounded-full p-1"
              aria-label="Pause"
            />
          ) : (
            <PlayIcon
              size={40}
              className="bg-slate-800 rounded-full p-1 pl-2"
              aria-label="Play"
            />
          )}
          <Badge variant="secondary">{time}</Badge>
        </CardHeader>
        <CardHeader className="flex flex-col gap-2 w-full overflow-hidden">
          <CardTitle>{episode?.title || "Episode Title"}</CardTitle>
          <CardDescription className="line-clamp-6 hidden sm:block">
            {episode?.description ||
              "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."}
          </CardDescription>
        </CardHeader>
      </div>
    </Card>
  );
};

export default PreviewEpisodeCard;
