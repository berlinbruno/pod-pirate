import { Button } from "../ui/button";
import Link from "next/link";
import { PlusCircle } from "lucide-react";

export default function DashboardPageHeader() {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      {/* Title */}
      <div className="space-y-1">
        <h1 className="scroll-m-20 text-2xl font-semibold tracking-tight">My Podcasts</h1>
        <p className="text-muted-foreground text-sm">Manage your podcast content</p>
      </div>

      {/* Action */}
      <Button asChild className="w-full sm:w-auto">
        <Link href="/dashboard/podcasts/new" className="flex items-center justify-center">
          <PlusCircle className="mr-2 h-4 w-4" />
          Create Podcast
        </Link>
      </Button>
    </div>
  );
}
