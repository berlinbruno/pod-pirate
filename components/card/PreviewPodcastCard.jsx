import { BookPlus, User2Icon } from "lucide-react";
import Image from "next/image";
import { AspectRatio } from "../ui/aspect-ratio";
import { Card, CardDescription, CardHeader, CardTitle } from "../ui/card";

const PreviewPodcastCard = ({ user }) => {
  const imagePreview = user?.imagePreview || "/defaultImage.jpg";
  const bannerPreview = user?.bannerPreview || "/defaultBanner.jpg";
  const title = user?.title || "Podcast Title";
  const description = user?.description || "No description available";
  const name = user?.name || "Channel Name";
  const category = user?.category || "Category";

  return (
    <Card className="relative">
      <div className="flex flex-col sm:flex-row items-center sm:items-stretch">
        <CardHeader className="z-10 w-full max-w-[250px]">
          <AspectRatio ratio={1}>
            <Image
              src={imagePreview}
              fill
              alt="Image Preview"
              className="rounded-md object-cover bg-muted"
            />
          </AspectRatio>
        </CardHeader>

        <CardHeader className="flex flex-col gap-2 w-full justify-between overflow-hidden z-50">
          <article>
            <CardTitle>{title}</CardTitle>
            <CardDescription className="line-clamp-6 hidden sm:block">
              {description}
            </CardDescription>
          </article>
          <article className="flex flex-row w-full justify-between">
            <span className="flex gap-2 capitalize">
              <User2Icon className="hidden sm:block" />
              {name}
            </span>
            <span className="flex gap-2">
              <BookPlus className="hidden sm:block" />
              {category}
            </span>
          </article>
        </CardHeader>
      </div>
      <Image
        src={bannerPreview}
        fill
        alt="Banner Preview"
        className="rounded-md object-cover absolute top-0 left-0 -z-0"
      />
    </Card>
  );
};

export default PreviewPodcastCard;
