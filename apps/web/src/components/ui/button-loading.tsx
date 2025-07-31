import { Button } from "@/web/components/ui/button";
import { cn } from "@/web/lib/utils";
import { Loader2Icon } from "lucide-react";

export function ButtonLoading({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  return (
    <Button
      size="sm"
      disabled
      className={cn("flex items-center justify-center gap-2", className)}
    >
      <Loader2Icon className="animate-spin" />
      {text}
    </Button>
  );
}
