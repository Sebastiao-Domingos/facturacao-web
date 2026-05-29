import { Loader2 } from "lucide-react";

export function Loader({ message }: { message?: string }) {
  return (
    <div className="flex h-[60vh] w-full flex-col items-center justify-center gap-2">
      <Loader2 size={40} className="h-10 w-10 animate-spin text-primary" />
      <p className="text-sm font-medium text-muted-foreground animate-pulse">
        {message ? message : "A carregar dados..."}
      </p>
    </div>
  );
}
