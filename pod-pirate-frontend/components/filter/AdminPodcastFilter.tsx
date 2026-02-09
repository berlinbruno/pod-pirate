"use client";

import { SearchIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { Separator } from "../ui/separator";
import { Button } from "../ui/button";
import { ButtonGroup } from "../ui/button-group";
import { Input } from "../ui/input";

interface AdminPodcastFilterProps {
  initialSearch: string;
  initialStatus: string;
}

export default function AdminPodcastFilter({
  initialSearch,
  initialStatus,
}: AdminPodcastFilterProps) {
  const router = useRouter();
  const searchRef = useRef<HTMLInputElement>(null);

  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [activeStatus, setActiveStatus] = useState(initialStatus);

  const statuses = [
    { key: "DRAFT", label: "Draft" },
    { key: "FLAGGED", label: "Flagged" },
    { key: "ARCHIVED", label: "Archived" },
    { key: "PUBLISHED", label: "Published" },
  ];

  /* ------------------------------------------------
   * URL = SOURCE OF TRUTH
   * ------------------------------------------------ */

  const updateURL = (updates: { search?: string; status?: string; page?: number }) => {
    const params = new URLSearchParams();

    if (updates.search) params.set("search", updates.search);
    if (updates.status) params.set("status", updates.status);
    if (updates.page) params.set("page", updates.page.toString());

    const queryString = params.toString();
    router.push(queryString ? `/admin/podcasts?${queryString}` : "/admin/podcasts", {
      scroll: false,
    });
  };

  /* ------------------------------------------------
   * Actions
   * ------------------------------------------------ */

  const handleSearch = (query: string) => {
    const trimmed = query.trim();

    setSearchQuery(trimmed);
    setActiveStatus("");

    // 🔑 empty search must REMOVE ALL params
    if (!trimmed) {
      router.push("/admin/podcasts", { scroll: false });
      return;
    }

    updateURL({ search: trimmed, page: 0 });
  };

  const handleStatusClick = (status: string) => {
    setSearchQuery("");
    setActiveStatus(status);

    updateURL({ status, page: 0 });
  };

  const handleReset = () => {
    setSearchQuery("");
    setActiveStatus("");
    router.push("/admin/podcasts", { scroll: false });
  };

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleSearch(searchQuery);
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);

    // 🔑 auto-fetch ALL when cleared
    if (value.trim() === "") {
      setActiveStatus("");
      router.push("/admin/podcasts", { scroll: false });
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
        setActiveStatus("");
        router.push("/admin/podcasts", { scroll: false });
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [router]);

  return (
    <section aria-labelledby="podcast-filters" className="space-y-4">
      <h2 id="podcast-filters" className="sr-only">
        Podcast filters
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

      {/* Status filters */}
      <nav aria-label="Podcast status filters">
        <div className="scrollbar-none [WebkitOverflowScrolling:touch] flex flex-nowrap overflow-x-auto whitespace-nowrap [-ms-overflow-style:none] [scrollbar-width:none]">
          <ButtonGroup>
            <Button
              onClick={handleReset}
              variant={activeStatus === "" && searchQuery === "" ? "default" : "secondary"}
              size="sm"
              aria-current={activeStatus === "" && searchQuery === "" ? "true" : undefined}
            >
              All
            </Button>

            {statuses.map(({ key, label }) => (
              <Button
                key={key}
                onClick={() => handleStatusClick(key)}
                variant={activeStatus === key ? "default" : "secondary"}
                size="sm"
                aria-current={activeStatus === key ? "true" : undefined}
              >
                {label}
              </Button>
            ))}
          </ButtonGroup>
        </div>
      </nav>
    </section>
  );
}
