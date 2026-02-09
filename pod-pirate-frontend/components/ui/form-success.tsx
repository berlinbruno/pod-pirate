import { CircleCheck } from "lucide-react";

interface FormSuccessProps {
  message?: string | null | undefined;
}

export const FormSuccess = ({ message }: FormSuccessProps) => {
  return (
    <div className="flex items-center gap-x-2 rounded-md bg-emerald-500/15 p-3 text-sm text-emerald-500">
      <CircleCheck className="h-4 w-4" />
      <p>{message}</p>
    </div>
  );
};
