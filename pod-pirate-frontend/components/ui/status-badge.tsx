import {
  CheckCircle2,
  FileText,
  Archive,
  Flag,
  Lock,
  ShieldCheck,
  ShieldOff,
  HelpCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type Status =
  | "PUBLISHED"
  | "DRAFT"
  | "ARCHIVED"
  | "FLAGGED"
  | "LOCKED"
  | "VERIFIED"
  | "UNVERIFIED"
  | string;

type BadgeVariant = "success" | "default" | "secondary" | "destructive";

interface StatusConfig {
  label: string;
  variant: BadgeVariant;
  Icon: React.ElementType;
}

const STATUS_CONFIG: Record<string, StatusConfig> = {
  PUBLISHED: { label: "Published", variant: "success", Icon: CheckCircle2 },
  DRAFT: { label: "Draft", variant: "default", Icon: FileText },
  ARCHIVED: { label: "Archived", variant: "secondary", Icon: Archive },
  FLAGGED: { label: "Flagged", variant: "destructive", Icon: Flag },
  LOCKED: { label: "Locked", variant: "secondary", Icon: Lock },
  VERIFIED: { label: "Verified", variant: "success", Icon: ShieldCheck },
  UNVERIFIED: { label: "Unverified", variant: "default", Icon: ShieldOff },
};

function formatFallback(status: string) {
  return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
}

interface StatusBadgeProps {
  status: Status;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status];

  const label = config?.label ?? formatFallback(status);
  const Icon = config?.Icon ?? HelpCircle;
  const variant = config?.variant ?? "secondary";

  return (
    <Badge
      role="status"
      aria-label={`Status: ${label}`}
      variant={variant}
      className={cn("flex items-center gap-1.5", className)}
    >
      <Icon className="h-3.5 w-3.5" aria-hidden="true" />
      <span>{label}</span>
    </Badge>
  );
}
