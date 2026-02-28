"use client";

import Image, { ImageProps } from "next/image";
import { useState, useCallback } from "react";
import { revalidatePathAction } from "@/actions/cache/revalidate";
import { usePathname } from "next/navigation";

interface RefreshableImageProps extends ImageProps {
  /**
   * Maximum number of retry attempts (default: 2)
   */
  maxRetries?: number;
  /**
   * Custom path to revalidate. If not provided, uses current pathname
   */
  revalidatePath?: string;
  /**
   * Delay in milliseconds before retrying after revalidation (default: 1500ms)
   */
  retryDelay?: number;
}

/**
 * Image component that automatically retries loading when it fails (e.g., due to expired signed URLs).
 * On error, it triggers cache revalidation to fetch fresh URLs and retries loading the image.
 */
export default function RefreshableImage({
  maxRetries = 2,
  revalidatePath,
  retryDelay = 1500,
  onError,
  ...props
}: RefreshableImageProps) {
  const pathname = usePathname();
  const [retryCount, setRetryCount] = useState(0);
  const [key, setKey] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);

  const handleError = useCallback(
    async (event: React.SyntheticEvent<HTMLImageElement, Event>) => {
      // Call custom onError handler if provided
      onError?.(event);

      // Don't retry if already retrying or max retries exceeded
      if (isRetrying || retryCount >= maxRetries) {
        if (!isRetrying && retryCount >= maxRetries) {
          console.warn(
            `Image failed to load after ${maxRetries} retries:`,
            props.src
          );
        }
        return;
      }

      console.log(
        `Image load failed (attempt ${retryCount + 1}/${maxRetries}), revalidating cache...`,
        props.src
      );

      setIsRetrying(true);

      try {
        // Revalidate the cache to get fresh signed URLs
        const pathToRevalidate = revalidatePath || pathname;
        await revalidatePathAction(pathToRevalidate);

        // Wait for the cache to be refreshed and new data to be fetched
        await new Promise((resolve) => setTimeout(resolve, retryDelay));

        // Increment retry count and force remount with new key
        setRetryCount((prev) => prev + 1);
        setKey((prev) => prev + 1);
        setIsRetrying(false);
      } catch (error) {
        console.error("Failed to revalidate on image error:", error);
        setIsRetrying(false);
      }
    },
    [retryCount, maxRetries, isRetrying, retryDelay, props.src, revalidatePath, pathname, onError]
  );

  // eslint-disable-next-line jsx-a11y/alt-text -- alt prop is required in ImageProps and passed via props spread
  return <Image {...props} key={key} onError={handleError} />;
}
