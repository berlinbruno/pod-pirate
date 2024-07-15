"use client";
import { getCookie } from "@/utils/cookies";
import { ResetIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import PreviewPodcastCard from "../card/PreviewPodcastCard";
import PopupMenu from "../menu/PopupMenu";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";

const ProfileForm = ({ user }) => {
  const [formData, setFormData] = useState({
    name: user?.authorName,
    title: user?.podcastTitle,
    description: user?.podcastDescription,
    category: user?.category,
    image: null,
    banner: null,
    imagePreview:
      user.authorProfileUrl === null
        ? "/podcast.jpg"
        : `${process.env.NEXT_PUBLIC_BACKEND_URL}/cloud/download/${user?.authorProfileUrl}`,
    bannerPreview:
      user.authorBannerUrl === null
        ? "/banner.jpg"
        : `${process.env.NEXT_PUBLIC_BACKEND_URL}/cloud/download/${user?.authorBannerUrl}`,
  });

  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState(null);

  const router = useRouter();

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (event) => {
    const { name, files } = event.target;
    const file = files[0];
    setFormData({
      ...formData,
      [name]: file,
      [`${name}Preview`]: URL.createObjectURL(file),
    });
  };

  const handleSubmit = async (e) => {
    try {
      setLoading(true);
      e.preventDefault();

      const jwtToken = getCookie("accessToken");
      const myHeaders = new Headers();
      myHeaders.append("Authorization", "Bearer " + jwtToken);

      const formdata = new FormData();
      formdata.append("name", formData?.name);
      formdata.append("title", formData?.title);
      formdata.append("description", formData?.description);
      formdata.append("imageFile", formData?.image);
      formdata.append("bannerFile", formData?.banner);

      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: formdata,
        redirect: "follow",
      };

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/update/profile/${user?.podcastId}`,
        requestOptions
      );
      if (res.ok) {
        const result = await res.text();
        router.refresh();
        toast(result);
        console.info(result);
      } else {
        const result = await res.text();
        setError(result);
        console.error(result);
      }

      router.back();
    } catch (error) {
      console.error("Error updating user details:", error);
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileImageDelete = async (e) => {
    try {
      setDeleting(true);
      const jwtToken = getCookie("accessToken");

      const myHeaders = new Headers();
      myHeaders.append("Authorization", "Bearer " + jwtToken);

      const requestOptions = {
        method: "DELETE",
        headers: myHeaders,
        redirect: "follow",
      };

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/delete/profileImage/${user?.podcastId}`,
        requestOptions
      );
      if (res.ok) {
        const result = await res.text();
        router.refresh();
        toast(result);
        console.info(result);
      } else {
        const result = await res.text();
        console.error(result);
        setError(result);
      }

      router.refresh();
    } catch (error) {
      console.error("Error deleting profileImage:", error);
    } finally {
      setDeleting(false);
    }
  };

  const handleBannerImageDelete = async (e) => {
    try {
      setDeleting(true);
      const jwtToken = getCookie("accessToken");

      const myHeaders = new Headers();
      myHeaders.append("Authorization", "Bearer " + jwtToken);

      const requestOptions = {
        method: "DELETE",
        headers: myHeaders,
        redirect: "follow",
      };

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/delete/bannerImage/${user?.podcastId}`,
        requestOptions
      );
      if (res.ok) {
        const result = await res.text();
        router.refresh();
        toast(result);
        console.info(result);
      } else {
        const result = await res.text();
        console.error(result);
        setError(result);
      }

      router.refresh();
    } catch (error) {
      console.error("Error deleting bannerImage:", error);
    } finally {
      setDeleting(false);
    }
  };
  return (
    <form className=" flex flex-col gap-2" onSubmit={handleSubmit}>
      <h1 className="title place-self-center">Profile Details</h1>
      <Label htmlFor="name">Name</Label>
      <Input
        type="text"
        name="name"
        placeholder="name"
        value={formData?.name}
        onChange={handleInputChange}
        minLength="2"
        maxLength="20"
        required
      />
      <Label htmlFor="title">Title</Label>
      <Input
        type="text"
        name="title"
        placeholder="title"
        value={formData?.title}
        onChange={handleInputChange}
        minLength="2"
        maxLength="20"
        required
      />
      <Label htmlFor="description">Description</Label>
      <Textarea
        type="text"
        name="description"
        placeholder="description"
        value={formData?.description}
        onChange={handleInputChange}
        minLength="2"
        maxLength="50"
        className=" min-h-20"
        required
      />
      <Label htmlFor="image">Profile Image</Label>
      <Input
        type="file"
        name="image"
        accept="image/jpeg, image/png, image/webp"
        onChange={handleFileChange}
      />
      <Label htmlFor="banner">Banner</Label>
      <Input
        type="file"
        name="banner"
        accept="image/jpeg, image/png, image/webp"
        onChange={handleFileChange}
      />
      <Label>Preview</Label>
      <PreviewPodcastCard user={formData} />
      {error && (
        <div className=" text-right text-sm text-destructive">{error}*</div>
      )}
      <div className=" flex flex-wrap gap-2 w-full">
        <Button
          variant="outline"
          size="icon"
          type="reset"
          onClick={() => {
            setFormData({
              name: user?.authorName,
              title: user?.podcastTitle,
              description: user?.podcastDescription,
              category: user?.category,
              image: null,
              banner: null,
              imagePreview:
                user.authorProfileUrl === null
                  ? "/podcast.jpg"
                  : `${process.env.NEXT_PUBLIC_BACKEND_URL}/cloud/download/${user?.authorProfileUrl}`,
              bannerPreview:
                user.authorBannerUrl === null
                  ? "/banner.jpg"
                  : `${process.env.NEXT_PUBLIC_BACKEND_URL}/cloud/download/${user?.authorBannerUrl}`,
            });
            setError(null);
          }}
        >
          <ResetIcon />
        </Button>
        <PopupMenu
          callfunction={handleProfileImageDelete}
          status={deleting}
          text={"Remove Profile Image"}
        />
        <PopupMenu
          callfunction={handleBannerImageDelete}
          status={deleting}
          text={"Remove Banner Image"}
        />
        <Button className="w-full" type="submit" disabled={loading}>
          {loading ? "Updating..." : "Update"}
        </Button>
      </div>
    </form>
  );
};

export default ProfileForm;
