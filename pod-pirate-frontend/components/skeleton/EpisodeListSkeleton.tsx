import EpisodeCardSkeleton from "./EpisodeCardSkeleton";

export default function EpisodeListSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <EpisodeCardSkeleton key={i} />
      ))}
    </div>
  );
}
