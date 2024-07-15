import { BookPlus, User2Icon } from "lucide-react";
import Image from "next/image";
import { AspectRatio } from "../ui/aspect-ratio";
import { Card, CardDescription, CardHeader, CardTitle } from "../ui/card";

const PodcastCard = ({ podcast }) => {
  const authorProfileUrl =
    podcast?.authorProfileUrl !== null
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/cloud/download/${podcast?.authorProfileUrl}`
      : "/podcast.jpg";

  const authorBannerUrl =
    podcast?.authorBannerUrl !== null
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/cloud/download/${podcast?.authorBannerUrl}`
      : "/banner.jpg";

  return (
    <Card className="relative">
      <div className="flex flex-col sm:flex-row items-center sm:items-stretch">
        <CardHeader className="z-10 w-full max-w-[250px]">
          <AspectRatio ratio={1 / 1}>
            <Image
              src={authorProfileUrl}
              fill
              alt="imagePreview"
              className="rounded-md object-cover bg-muted"
              sizes="(max-width: 600px) 100vw, (max-width: 1200px) 50vw, 250px"
            />
          </AspectRatio>
        </CardHeader>
        <CardHeader className="flex flex-col gap-2 w-full justify-between overflow-hidden z-50">
          <article>
            <CardTitle className="text-white">
              {podcast?.podcastTitle}
            </CardTitle>
            <CardDescription className="line-clamp-6 hidden sm:block text-slate-50">
              {podcast?.podcastDescription}
            </CardDescription>
          </article>
          <article className="flex flex-row w-full justify-between text-white">
            <span className="flex gap-2 capitalize">
              <User2Icon className="hidden sm:block" />
              {podcast?.authorName}
            </span>
            <span className="flex gap-2">
              <BookPlus className="hidden sm:block" />
              {podcast?.category}
            </span>
          </article>
        </CardHeader>
      </div>
      <Image
        src={authorBannerUrl}
        fill
        alt="imagePreview"
        className="rounded-md object-cover absolute top-0 left-0 -z-0"
        priority
      />
    </Card>
  );
};

export default PodcastCard;
