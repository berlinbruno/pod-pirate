import type { Metadata } from "next";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Construction } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const revalidate = 0;

export const metadata: Metadata = {
  title: "Admin Dashboard - Pod Pirate",
  description:
    "Admin dashboard for Pod Pirate platform. Manage users, podcasts, and platform settings.",
};

export default async function AdminDashboardPage() {
  return (
    <div className="container flex min-h-screen items-center justify-center px-4 py-8">
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Construction />
          </EmptyMedia>
          <EmptyTitle>Dashboard Coming Soon</EmptyTitle>
          <EmptyDescription>
            The admin dashboard is currently under development. Use the sidebar to manage users and
            podcasts.
          </EmptyDescription>
        </EmptyHeader>
        <div className="flex gap-4">
          <Button asChild variant="default">
            <Link href="/admin/users">Manage Users</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/admin/podcasts">Manage Podcasts</Link>
          </Button>
        </div>
      </Empty>
    </div>
  );
}
