import { Metadata } from "next";
import Link from "next/link";
import { WifiOff } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Offline - Pod Pirate",
  description: "You are currently offline. Please check your internet connection.",
};

export default function OfflinePage() {
  return (
    <div className="container mx-auto flex min-h-[calc(100vh-72px)] flex-col items-center justify-center px-4 py-16">
      <div className="max-w-md space-y-6 text-center">
        <div className="flex justify-center">
          <div className="bg-muted rounded-full p-6">
            <WifiOff className="text-muted-foreground h-16 w-16" />
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-4xl font-bold">You&apos;re Offline</h1>
          <p className="text-muted-foreground text-lg">
            It looks like you&apos;ve lost your internet connection. Please check your network
            settings and try again.
          </p>
        </div>

        <div className="space-y-3 pt-4">
          <Button asChild variant="outline" className="w-full" size="lg">
            <Link href="/">Go to Homepage</Link>
          </Button>
        </div>

        <p className="text-muted-foreground pt-4 text-sm">
          Some content may still be available from your cache while offline.
        </p>
      </div>
    </div>
  );
}
