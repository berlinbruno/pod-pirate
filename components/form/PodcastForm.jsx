"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ResetIcon } from "@radix-ui/react-icons";
import { Textarea } from "../ui/textarea";
import { categories } from "@/utils/data";
import { getCookie } from "@/utils/cookies";
import { toast } from "sonner";
import PreviewPodcastCard from "../card/PreviewPodcastCard";
import { useRouter } from "next/navigation";

const PodcastForm = ({ userid }) => {
  // State object to store form data
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    userName: "Your UserName",
    image: null,
    imagePreview: "/podcast.jpg", // Added state for image preview
  });

  const [loading, setLoading] = useState(false);
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
    e.preventDefault();
    try {
      setLoading(true);

      const jwtToken = getCookie("accessToken");
      const myHeaders = new Headers();
      myHeaders.append("Authorization", "Bearer " + jwtToken);

      const formdata = new FormData();
      formdata.append("title", formData.title);
      formdata.append("description", formData.description);
      formdata.append("category", formData.category);
      formdata.append("imageFile", formData.image);

      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: formdata,
        redirect: "follow",
      };

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/create/podcast/${userid}`,
        requestOptions
      );

      if (res.ok) {
        const form = e.target;
        form.reset();
        const result = await res.text();
        window.location.href = `/user/${userid}`;
        toast(result);
        console.info(result);
      } else {
        const result = await res.text();
        setError(result);
        console.error(result);
      }
    } catch (error) {
      console.error("Error creating podcast:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
      <h1 className="title place-self-center">Create Podcast</h1>
      <Label htmlFor="title">Title</Label>
      <Input
        id="title"
        name="title"
        type="text"
        value={formData.title}
        placeholder="Title"
        minLength="3"
        maxLength="20"
        onChange={handleInputChange}
        required
      />
      <Label htmlFor="description">Description</Label>
      <Textarea
        type="text"
        name="description"
        placeholder="Description about your podcast"
        minLength="20"
        maxLength="250"
        value={formData.description}
        onChange={handleInputChange}
        required
        className=" h-[200px] md:h-[100px]"
      />
      <Label htmlFor="image">Image</Label>
      <Input
        type="file"
        accept="image/jpeg, image/png, image/webp"
        name="image"
        onChange={handleFileChange}
        required
      />
      <Label htmlFor="category">Category</Label>
      <Select
        id="category"
        name="category"
        onValueChange={(e) => {
          setFormData({
            ...formData,
            category: e,
          });
        }}
        required
        className="block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select a Category" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Categories</SelectLabel>
            {categories.map((title) => (
              <SelectItem key={title} value={title}>
                {title}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      {error && (
        <div className=" text-right text-sm text-destructive">{error}*</div>
      )}
      <Label>Preview</Label>
      <PreviewPodcastCard podcast={formData} />
      <div className="flex gap-2">
        <Button
          type="reset"
          variant="outline"
          size="icon"
          onClick={() => {
            setFormData({
              title: "",
              description: "",
              category: "",
              userName: "Your UserName",
              image: null,
              imagePreview: "/podcast.jpg", // Added state for image preview
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

export default PodcastForm;
