"use client";

import { SearchIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { Separator } from "../ui/separator";
import { Button } from "../ui/button";
import { categories } from "@/utils/data";
import { ButtonGroup } from "../ui/button-group";
import { Input } from "../ui/input";

interface PodcastDiscoveryFilterProps {
  initialSearch: string;
  initialCategory: string;
}

export default function PodcastDiscoveryFilter({
  initialSearch,
  initialCategory,
}: PodcastDiscoveryFilterProps) {
  const router = useRouter();
  const searchRef = useRef<HTMLInputElement>(null);

  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [activeCategory, setActiveCategory] = useState(initialCategory);

  /* ------------------------------------------------
   * URL = SOURCE OF TRUTH
   * ------------------------------------------------ */

  const updateURL = (updates: { search?: string; category?: string; page?: number }) => {
    const params = new URLSearchParams();

    if (updates.search) params.set("search", updates.search);
    if (updates.category) params.set("category", updates.category);
    if (updates.page) params.set("page", updates.page.toString());

    const queryString = params.toString();
    router.push(queryString ? `?${queryString}` : "?");
  };

  /* ------------------------------------------------
   * Actions
   * ------------------------------------------------ */

  const handleSearch = (query: string) => {
    const trimmed = query.trim();

    setSearchQuery(trimmed);
    setActiveCategory("");

    // 🔑 empty search must REMOVE ALL params
    if (!trimmed) {
      router.push("?");
      return;
    }

    updateURL({ search: trimmed, page: 0 });
  };

  const handleCategoryClick = (category: string) => {
    setSearchQuery("");
    setActiveCategory(category);

    updateURL({ category, page: 0 });
  };

  const handleReset = () => {
    setSearchQuery("");
    setActiveCategory("");
    router.push("?");
  };

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleSearch(searchQuery);
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);

    // 🔑 auto-fetch ALL when cleared
    if (value.trim() === "") {
      setActiveCategory("");
      router.push("?");
    }
  };

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      // Ctrl / Cmd + K → focus search
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        searchRef.current?.focus();
        searchRef.current?.select();
        return;
      }

      // Escape → reset (fetch all)
      if (e.key === "Escape") {
        setSearchQuery("");
        setActiveCategory("");
        router.push("?");
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [router]);

  return (
    <section aria-labelledby="podcast-discovery-filters" className="space-y-4">
      <h2 id="podcast-discovery-filters" className="sr-only">
        Podcast discovery filters
      </h2>

      {/* Search */}
      <form role="search" aria-label="Search podcasts" onSubmit={handleSearchSubmit}>
        <ButtonGroup className="w-full">
          <Input
            ref={searchRef}
            type="text"
            placeholder="Search podcasts..."
            aria-label="Search podcasts"
            aria-keyshortcuts="Control+K Meta+K"
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
          />

          <Button type="submit" variant="outline" aria-label="Submit search">
            <SearchIcon className="h-4 w-4" aria-hidden />
          </Button>
        </ButtonGroup>
      </form>

      <Separator className="hidden sm:block" />

      {/* Category filters */}
      <nav aria-label="Podcast categories">
        <div className="scrollbar-none [WebkitOverflowScrolling:touch] flex flex-nowrap overflow-x-auto whitespace-nowrap [-ms-overflow-style:none] [scrollbar-width:none]">
          <ButtonGroup>
            <Button
              onClick={handleReset}
              variant={activeCategory === "" && searchQuery === "" ? "default" : "secondary"}
              size="sm"
              aria-current={activeCategory === "" && searchQuery === "" ? "true" : undefined}
            >
              All
            </Button>

            {Object.entries(categories).map(([key, value]) => (
              <Button
                key={key}
                onClick={() => handleCategoryClick(key)}
                variant={activeCategory === key ? "default" : "secondary"}
                size="sm"
                aria-current={activeCategory === key ? "true" : undefined}
              >
                {value}
              </Button>
            ))}
          </ButtonGroup>
        </div>
      </nav>
    </section>
  );
}
