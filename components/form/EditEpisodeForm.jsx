"use client";
import { getCookie } from "@/utils/cookies";
import { ResetIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import AudioPlayer from "../audio/AudioPlayer";
import PreviewEpisodeCard from "../card/PreviewEpisodeCard";
import PopupMenu from "../menu/PopupMenu";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";

const EditEpisodeForm = ({ episode }) => {
  const [formData, setFormData] = useState({
    title: episode.title,
    description: episode.description,
    audio: null,
    audioPreview: episode?.audioUrl,
    duration: null
  });
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState(null);
  const [play, setPlay] = useState(false);

  const router = useRouter();

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleImageFileChange = (event) => {
    const { name, files } = event.target;
    const file = files[0];
    setFormData({
      ...formData,
      [name]: file,
      [`${name}Preview`]: URL.createObjectURL(file),
    });
  };

  const handleAudioFileChange = (event) => {
    const { name, files } = event.target;
    const file = files[0];
    const contentType = file.type; // Extract contentType from the selected file
    const audioElement = new Audio(URL.createObjectURL(file)); // Create an audio element to get the duration

    audioElement.onloadedmetadata = () => {
      setFormData({
        ...formData,
        [name]: file,
        [`${name}Preview`]: URL.createObjectURL(file),
        duration: audioElement.duration, // Set audio duration
      });
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      if (formData.duration >= 3600) {
        setError("Audio Must Be Less than One Hour");
        return;
      }

      const jwtToken = getCookie("accessToken");
      const myHeaders = new Headers();
      myHeaders.append("Authorization", "Bearer " + jwtToken);

      // Get pre-signed URL for updating the audio file only if audio exists
      let audioUpdateUrl = null;
      if (formData.audio) {
        const updateAudioUrlRequestOption = {
          method: "GET",
          headers: myHeaders,
          redirect: "follow",
        };

        const audioUrlResponse = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/get/episode/updateAudioUrl/${episode.podcastId}/${episode.episodeId}`,
          updateAudioUrlRequestOption
        );

        if (!audioUrlResponse.ok) {
          // Handle error if getting pre-signed URL fails
          return;
        }

        audioUpdateUrl = await audioUrlResponse.text();
      }

      // If audio exists, upload audio file to pre-signed URL
      if (audioUpdateUrl) {
        const audioFileUpdateResponse = await fetch(audioUpdateUrl, {
          method: "PUT",
          body: formData.audio, // Assuming formData.audio contains the audio file
          headers: {
            "Content-Type": "application/octet-stream",
          },
        });

        if (!audioFileUpdateResponse.ok) {
          // Handle error if uploading audio file fails
          return;
        }
      }

      // Submit episode details along with the audio file URL
      const formdata = new FormData();
      formdata.append("title", formData.title);
      formdata.append("description", formData.description);

      const episodeRequestOptions = {
        method: "PUT",
        headers: myHeaders,
        body: formdata,
        redirect: "follow",
      };

      const episodeUpdationResponse = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/update/episode/${episode.podcastId}/${episode.episodeId}`,
        episodeRequestOptions
      );

      if (episodeUpdationResponse.ok) {
        const result = await episodeUpdationResponse.text();
        window.location.href = `/user/${episode.podcastId}`;
        toast(result);
        console.info(result);
      } else {
        const result = await episodeUpdationResponse.text();
        setError(result);
        console.error(result);
      }
    } catch (error) {
      console.error("Error updating episode:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (e) => {
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
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/delete/episode/${episode.podcastId}/${episode.episodeId}`,
        requestOptions
      );
      if (res.ok) {
        const result = await res.text();
        window.location.href = `/user/${episode.podcastId}`;
        toast(result);
        console.info(result);
      } else {
        const result = await res.text();
        setError(result);
        console.error(result);
      }
    } catch (error) {
      console.error("Error deleting episode:", error);
      setError(error);
    } finally {
      setDeleting(false);
    }
  };

  const togglePlay = () => {
    setPlay(!play);
  };

  return (
    <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
      <h1 className="title place-self-center">Edit Episode</h1>
      <Label htmlFor="title">Title</Label>
      <Input
        name="title"
        type="text"
        value={formData.title}
        placeholder="Title"
        minLength={5}
      maxLength={20}
        onChange={handleInputChange}
      />
      <Label htmlFor="description">Description</Label>
      <Textarea
        type="text"
        name="description"
        placeholder="Description about your episode"
        minLength="20"
        maxLength="250"
        value={formData.description}
        onChange={handleInputChange}
        className=" h-[200px] md:h-[100px]"
      />
      <Label htmlFor="audio">Audio</Label>
      <Input
        type="file"
        accept="audio/wav , audio/mp3 , audio/webm"
        name="audio"
        onChange={handleAudioFileChange}
      />
      {error && (
        <div className=" text-right text-sm text-destructive">{error}*</div>
      )}
      <Label>Preview</Label>
      <div onClick={togglePlay}>
        <PreviewEpisodeCard episode={formData} play={play} />
      </div>
      {formData.audioPreview && (
        <AudioPlayer src={formData.audioPreview} play={play} />
      )}
      <div className="flex gap-2">
        <Button
          type="reset"
          variant="outline"
          size="icon"
          onClick={() => {
            setFormData({
              title: episode?.title,
              description: episode?.description,
              audio: null,
              audioPreview: episode?.audioUrl,
              duration: null
            });
            setError(null);
          }}
        >
          <ResetIcon />
        </Button>
        <PopupMenu callfunction={handleDelete} status={deleting} text={"Delete Episode"} />
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Upadting..." : "Update"}
        </Button>
      </div>
    </form>
  );
};

export default EditEpisodeForm;
