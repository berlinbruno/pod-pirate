"use client";
import { getCookie } from "@/utils/cookies";
import { generateUUID } from "@/utils/format";
import { ResetIcon } from "@radix-ui/react-icons";
import { useState } from "react";
import { toast } from "sonner";
import AudioPlayer from "../audio/AudioPlayer";
import PreviewEpisodeCard from "../card/PreviewEpisodeCard";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";

const EpisodeForm = ({ userId }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    audio: null,
    audioPreview: null,
    duration: null,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [play, setPlay] = useState(false);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleAudioFileChange = (event) => {
    const { name, files } = event.target;
    const file = files[0];
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

      const fileName = generateUUID();
      // Get pre-signed URL for audio file
      const uploadAudioUrlRequestOption = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
      };

      const audioUrlResponse = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/get/episode/uploadAudioUrl/${userId}/${fileName}`,
        uploadAudioUrlRequestOption
      );
      const audioUploadUrl = await audioUrlResponse.text();

      if (!audioUrlResponse.ok) {
        return;
      }

      // Upload audio file to pre-signed URL
      const audioFileUploadResponse = await fetch(audioUploadUrl, {
        method: "PUT",
        body: formData.audio, // Assuming formData.audio contains the audio file
        headers: {
          "Content-Type": "application/octet-stream", // or "audio/mpeg" if more appropriate
          "x-ms-blob-type": "BlockBlob",
        },
      });
      

      if (!audioFileUploadResponse.ok) {
        return;
      }

      // Now, submit episode details along with the audio file URL
      const formdata = new FormData();
      formdata.append("title", formData.title);
      formdata.append("description", formData.description);
      formdata.append("audioFile", fileName);
      formdata.append("duration", parseInt(formData.duration));

      const episodeRequestOptions = {
        method: "POST",
        headers: myHeaders,
        body: formdata,
        redirect: "follow",
      };

      const episodeCreationResponse = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/create/episode/${userId}`,
        episodeRequestOptions
      );

      if (episodeCreationResponse.ok) {
        const result = await episodeCreationResponse.text();
        window.location.href = `/user`;
        toast(result);
        console.info(result);
      } else {
        const result = await episodeCreationResponse.text();
        setError(result);
        console.error(result);
      }
    } catch (error) {
      console.error("Error creating episode:", error);
    } finally {
      setLoading(false);
    }
  };

  const togglePlay = () => {
    setPlay(!play);
  };

  return (
    <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
      <h1 className="title place-self-center">Create Episode</h1>
      <Label htmlFor="title">Title</Label>
      <Input
        name="title"
        type="text"
        value={formData.title}
        placeholder="Title"
        minLength="3"
        maxLength="50"
        onChange={handleInputChange}
        required
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
        required
        className=" h-[200px] md:h-[100px]"
      />
      <Label htmlFor="audio">Audio</Label>
      <Input
        type="file"
        accept="audio/wav , audio/mp3 , audio/webm"
        name="audio"
        onChange={handleAudioFileChange}
        required
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
              title: "",
              description: "",
              audio: null,
              audioPreview: null,
              duration: null,
            });
            setError(null);
          }}
        >
          <ResetIcon />
        </Button>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Creating..." : "Create"}
        </Button>
      </div>
    </form>
  );
};

export default EpisodeForm;
