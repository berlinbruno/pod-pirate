import { SidebarTrigger } from "../ui/sidebar";

interface PageHeaderProps {
  title?: string;
  description?: string;
}

export default function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <div className="space-y-1 sm:space-y-2">
      <div className="flex items-center gap-2">
        <SidebarTrigger />
        <h1 className="line-clamp-1 text-xl font-bold sm:text-2xl md:text-3xl">{title}</h1>
      </div>
      <p className="text-muted-foreground line-clamp-1 text-sm sm:text-base">{description}</p>
    </div>
  );
}
