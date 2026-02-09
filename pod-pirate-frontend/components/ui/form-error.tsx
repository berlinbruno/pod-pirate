import { ShieldAlert } from "lucide-react";

interface FormErrorProps {
  message?: string | null | undefined;
}

export const FormError = ({ message }: FormErrorProps) => {
  if (!message) {
    return null;
  }
  return (
    <div className="bg-destructive text-destructive-foreground flex items-center gap-x-2 rounded-md p-3 text-sm">
      <ShieldAlert className="h-4 w-4" />
      <p>{message}</p>
    </div>
  );
};
