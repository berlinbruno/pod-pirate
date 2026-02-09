"use client";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface PaginatorProps {
  currentPage: number;
  totalPages: number;
  maxVisiblePages?: number;
}

export default function Paginator({
  currentPage,
  totalPages,
  maxVisiblePages = 5,
}: PaginatorProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());

    if (page > 0) {
      params.set("page", page.toString());
    } else {
      params.delete("page");
    }

    const queryString = params.toString();
    router.push(queryString ? `?${queryString}` : window.location.pathname, {
      scroll: false,
    });
  };
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages: number[] = [];
    const maxPages = Math.min(maxVisiblePages, totalPages);

    if (totalPages <= maxVisiblePages) {
      // Show all pages
      for (let i = 0; i < totalPages; i++) {
        pages.push(i);
      }
    } else if (currentPage < Math.floor(maxVisiblePages / 2)) {
      // Show first pages
      for (let i = 0; i < maxPages; i++) {
        pages.push(i);
      }
    } else if (currentPage > totalPages - Math.ceil(maxVisiblePages / 2)) {
      // Show last pages
      for (let i = totalPages - maxPages; i < totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show middle pages centered around current page
      const start = currentPage - Math.floor(maxVisiblePages / 2);
      for (let i = start; i < start + maxPages; i++) {
        pages.push(i);
      }
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={() => currentPage > 0 && handlePageChange(currentPage - 1)}
            aria-disabled={currentPage === 0}
            className={currentPage === 0 ? "pointer-events-none opacity-50" : "cursor-pointer"}
          />
        </PaginationItem>

        {pageNumbers.map((pageNum) => (
          <PaginationItem key={pageNum}>
            <PaginationLink
              onClick={() => handlePageChange(pageNum)}
              isActive={currentPage === pageNum}
              className="cursor-pointer"
            >
              {pageNum + 1}
            </PaginationLink>
          </PaginationItem>
        ))}

        <PaginationItem>
          <PaginationNext
            onClick={() => currentPage < totalPages - 1 && handlePageChange(currentPage + 1)}
            aria-disabled={currentPage === totalPages - 1}
            className={
              currentPage === totalPages - 1 ? "pointer-events-none opacity-50" : "cursor-pointer"
            }
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
