"use client";
import { categories } from "@/utils/data";
import { ResetIcon } from "@radix-ui/react-icons";
import { ArrowLeft, SearchIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import PinCard from "../card/PinCard";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";

const PinList = ({ category }) => {
  const [podcasts, setPodcasts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const router = useRouter();

  const getAllPodcasts = useCallback(async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/public/get/podcasts/all`
      );
      if (res.ok) {
        const data = await res.json();
        setPodcasts(data);
      } else {
        console.error("Error fetching all podcasts:", res.statusText);
      }
    } catch (error) {
      console.error("Error fetching all podcasts:", error);
    }
  }, []);

  const getAllPodcastsByQuery = async (userQuery) => {
    try {
      const requestOptions = {
        method: "GET",
        redirect: "follow",
      };

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/public/get/podcasts/query/${userQuery}`,
        requestOptions
      );

      if (!res.ok) {
        console.error("Error fetching podcasts by query:", res.statusText);
        return [];
      }

      const data = await res.json();
      return data;
    } catch (error) {
      console.error("Error fetching podcasts by query:", error);
      throw new Error(error);
    }
  };

  const getAllPodcastsByCategory = async (category) => {
    try {
      const requestOptions = {
        method: "GET",
        redirect: "follow",
      };

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/public/get/podcasts/category/${category}`,
        requestOptions
      );

      if (!res.ok) {
        console.error("Error fetching podcasts by category:", res.statusText);
        return [];
      }

      const data = await res.json();
      return data;
    } catch (error) {
      console.error("Error fetching podcasts by category:", error);
      throw new Error(error);
    }
  };

  const handleCategory = useCallback(async (selectedCategory) => {
    try {
      const data = await getAllPodcastsByCategory(selectedCategory);
      setPodcasts(data);
    } catch (error) {
      console.error("Error fetching podcasts by category:", error);
    }
  }, []);

  useEffect(() => {
    if (category === null) {
      getAllPodcasts();
    } else {
      handleCategory(category);
    }
  }, [category, getAllPodcasts, handleCategory]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (searchQuery.trim() !== "") {
      try {
        const data = await getAllPodcastsByQuery(searchQuery);
        setPodcasts(data);
      } catch (error) {
        console.error("Error fetching podcasts by query:", error);
      }
    } else {
      try {
        const data = await getAllPodcasts();
        setPodcasts(data);
      } catch (error) {
        console.error("Error fetching podcasts:", error);
      }
    }
  };

  const handleReset = () => {
    getAllPodcasts();
  };

  const handleChange = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <menu className="flex flex-col gap-2 mt-4">
      <form onSubmit={handleSearch} className="flex gap-2">
        <Button
          variant="outline"
          type="button"
          className="rounded-full"
          onClick={() => {
            router.back();
            handleReset();
          }}
        >
          <ArrowLeft />
          Back
        </Button>
        <span className="flex rounded-3xl border border-border px-4 w-full">
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={handleChange}
            className="h-10 w-full border-none bg-background focus:outline-none"
          />
          <button className="border-l pl-2" type="submit">
            <SearchIcon />
          </button>
        </span>
      </form>
      <Separator className="hidden sm:block" />
      <div className="flex-wrap justify-start w-full gap-2 hidden sm:flex">
        {categories.map((cat, index) => (
          <Button
            key={index}
            onClick={() => handleCategory(cat)}
            variant="secondary"
          >
            {cat}
          </Button>
        ))}
        <Button type="button" onClick={handleReset} variant="outline">
          <ResetIcon />
        </Button>
      </div>
      <Separator />
      {/* Pins */}
      <article className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 w-full gap-2">
        {podcasts?.map((podcast, index) => (
          <PinCard podcast={podcast} key={index} />
        ))}
      </article>
    </menu>
  );
};

export default PinList;
