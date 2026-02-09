import { cn } from "@/lib/utils";

type PageSectionProps = {
  children: React.ReactNode;
  className?: string;
};

export function PageSection({ children, className }: PageSectionProps) {
  return (
    <section
      className={cn(
        "mx-auto w-full max-w-350 space-y-4 px-3 sm:space-y-6 sm:px-4 md:px-6 lg:space-y-8 lg:px-8",
        className,
      )}
    >
      {children}
    </section>
  );
}
