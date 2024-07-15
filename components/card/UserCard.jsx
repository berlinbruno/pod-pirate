"use client";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getCookie } from "@/utils/cookies";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";
import PopupMenu from "../menu/PopupMenu";
import { AspectRatio } from "../ui/aspect-ratio";
import { Button } from "../ui/button";

const UserCard = ({ user }) => {
  const [loading, setLoading] = useState(false);
  const userId = user?.podcastId;

  const authorProfileUrl =
    user?.authorProfileUrl !== null
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/cloud/download/${user?.authorProfileUrl}`
      : "/podcast.jpg";

  const handleAction = async (
    endpoint,
    successMessage,
    redirectUrl = "/admin/"
  ) => {
    setLoading(true);
    const jwtToken = getCookie("accessToken");
    const myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + jwtToken);

    const requestOptions = {
      method: "POST", // Adjust the method as needed (POST/DELETE)
      headers: myHeaders,
      redirect: "follow",
    };

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/users/${userId}/${endpoint}`,
        requestOptions
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      toast(successMessage); // Notify success
      window.location.href = redirectUrl; // Redirect after action
    } catch (error) {
      console.error("Error:", error);
      toast("An error occurred"); // Notify error
    } finally {
      setLoading(false);
    }
  };

  const handelLock = () => {
    handleAction("lock", "User locked successfully", "/admin/locked");
  };

  const handelUnLock = () => {
    handleAction("unlock", "User unlocked successfully", "/admin/");
  };

  const handleDelete = () => {
    handleAction("delete", "User deleted successfully", "/admin/");
  };

  return (
    <Card className="h-full z-10">
      <CardHeader>
        <div className="flex justify-center w-full">
          <AspectRatio ratio={1 / 1}>
            <Image
              src={authorProfileUrl}
              fill
              priority
              sizes="(max-width: 600px) 100vw, (max-width: 1200px) 50vw, 250px"
              alt="imagePreview"
              className="rounded-md object-cover bg-muted"
            />
          </AspectRatio>
        </div>
        <div className="flex flex-col gap-2">
          <CardTitle className="line-clamp-2 min-h-12">
            {user?.podcastTitle}
          </CardTitle>
          <span className="flex justify-between min-h-8">
            <CardDescription className=" line-clamp-2">
              {user?.authorName}
            </CardDescription>
            <CardDescription className=" line-clamp-2">
              {user?.category}
            </CardDescription>
          </span>
          <span className="flex">
            <CardDescription className=" line-clamp-1">
              No. of Episodes: {user?.noOfEpisodes}
            </CardDescription>
          </span>
          <span className="flex w-full gap-2">
            {user?.locked ? (
              <Button
                className="w-full"
                onClick={handelUnLock}
                disabled={loading}
              >
                Unlock
              </Button>
            ) : (
              <Button
                className="w-full"
                onClick={handelLock}
                disabled={loading}
              >
                Lock
              </Button>
            )}
            <PopupMenu
              callfunction={handleDelete}
              status={loading}
              text={"Delete user"}
            />
          </span>
        </div>
      </CardHeader>
    </Card>
  );
};

export default UserCard;
