import { EditIcon, PlusIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";

const EditPodcastList = ({ podcast }) => {
  const newEpisodeUrl = `/user/${podcast?.podcastId}/new-episode`;
  const editPodcastUrl = `/user/${podcast?.podcastId}/account`;

  return (
    <article className="flex flex-col gap-2">
      <Separator className="my-2" />
      <div className="flex gap-2 ml-2">
        <Link href={newEpisodeUrl}>
          <Button className="w-full">
            <PlusIcon />
            <p className="hidden md:block">Add Episode</p>
          </Button>
        </Link>
        <Link href={editPodcastUrl}>
          <Button className="w-full">
            <EditIcon />
            <p className="hidden md:block">Edit Podcast</p>
          </Button>
        </Link>
      </div>
      <Separator className="my-2" />
    </article>
  );
};

export default EditPodcastList;
