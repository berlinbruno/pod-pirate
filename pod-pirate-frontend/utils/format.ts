// Function to convert seconds to h:mm:ss format
export const convertSecondsToHMS = (durationInSeconds: number): string => {
  const hours = Math.floor(durationInSeconds / 3600);
  const minutes = Math.floor((durationInSeconds % 3600) / 60);
  const seconds = Math.floor(durationInSeconds % 60);

  if (hours < 1) {
    return `${minutes}:${String(seconds).padStart(2, "0")}`;
  } else {
    const formattedHours = String(hours).padStart(2, "0");
    const formattedMinutes = String(minutes).padStart(2, "0");
    const formattedSeconds = String(seconds).padStart(2, "0");
    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
  }
};

// Function to format duration in seconds to a human-readable string
export const formatDuration = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}m ${secs}s`;
  }
  return `${minutes}m ${secs}s`;
};

// Function to get user initials from username
export const getInitials = (username?: string | null): string => {
  if (!username?.trim()) return "CN";

  return username
    .trim()
    .split(/\s+/)
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

type DateFormatStyle = "relative" | "short" | "long" | "auto";

interface FormatDateOptions {
  style?: DateFormatStyle;
  relativeThresholdDays?: number;
  locale?: string;
}

const DEFAULT_LOCALE = "en-US";

export function formatDate(
  input: Date | string | number | undefined,
  { style = "auto", relativeThresholdDays = 7, locale = DEFAULT_LOCALE }: FormatDateOptions = {},
): string {
  if (!input) return "N/A";

  const date = new Date(input);
  const now = new Date();

  if (Number.isNaN(date.getTime())) return "";

  const diffMs = date.getTime() - now.getTime();
  const diffSeconds = Math.round(diffMs / 1000);
  const diffMinutes = Math.round(diffSeconds / 60);
  const diffHours = Math.round(diffMinutes / 60);
  const diffDays = Math.round(diffHours / 24);

  if (style === "relative" || style === "auto") {
    const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });

    if (Math.abs(diffMinutes) < 60) {
      return rtf.format(diffMinutes, "minute");
    }

    if (Math.abs(diffHours) < 24) {
      return rtf.format(diffHours, "hour");
    }

    if (style === "relative" || Math.abs(diffDays) <= relativeThresholdDays) {
      return rtf.format(diffDays, "day");
    }
  }

  if (style === "short") {
    return date.toLocaleDateString(locale, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  return date.toLocaleDateString(locale, {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}
