import type { AdminUserResponse } from "@/types/api";
import UserGridCard from "../card/grid/UserGridCard";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "../ui/empty";
import { Users } from "lucide-react";

interface AdminUserGridProps {
  users: ReadonlyArray<AdminUserResponse>;
}

export default function AdminUserGrid({ users }: AdminUserGridProps) {
  if (users.length === 0) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Users />
          </EmptyMedia>
          <EmptyTitle>No Users Found</EmptyTitle>
          <EmptyDescription>Try adjusting your search or filters.</EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  return (
    <article className="grid w-full grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-4">
      {users.map((user) => (
        <UserGridCard key={user.userId} user={user} />
      ))}
    </article>
  );
}
