import { convertSecondsToHMS } from "@/utils/format";
import { PauseIcon, PlayIcon } from "lucide-react";
import { Badge } from "../ui/badge";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";

const EpisodeCard = (({ episode, play }) => {
  const time = convertSecondsToHMS(episode?.duration);
  return (
    <Card>
      <div className="flex sm:flex-row">
        <CardHeader className="items-center flex-shrink-0">
          {play ? (
            <PauseIcon
              size={45}
              className="bg-slate-100 dark:bg-slate-800 rounded-full p-1"
              aria-label="Pause"
            />
          ) : (
            <PlayIcon
              size={45}
              className="bg-slate-100 dark:bg-slate-800 rounded-full p-1 pl-2"
              aria-label="Play"
            />
          )}
          <Badge variant="secondary">{time}</Badge>
        </CardHeader>

        <CardHeader className="flex flex-col gap-2 w-full overflow-hidden">
          <CardTitle>{episode?.title}</CardTitle>
          <CardDescription className="line-clamp-6 hidden sm:block">
            {episode?.description}
          </CardDescription>
        </CardHeader>
      </div>
    </Card>
  );
});

export default EpisodeCard;
