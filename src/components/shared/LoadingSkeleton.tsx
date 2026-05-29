// src/components/shared/LoadingSkeleton.tsx
"use client";

import { Skeleton } from "@/components/ui/skeleton";

interface LoadingSkeletonProps {
  type?: "table" | "card" | "form";
  count?: number;
  columns?: number;
  showHeader?: boolean;
  title?: string;
  description?: string;
  showAction?: boolean;
}

export function LoadingSkeleton({
  type = "table",
  count = 5,
  columns = 4,
  showHeader = true,
  title = "Carregando...",
  description = "Aguarde enquanto carregamos os dados.",
  showAction = false,
}: LoadingSkeletonProps) {
  return (
    <div className="space-y-6 p-4 sm:p-6">
      {showHeader && (
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Skeleton className="h-8 w-48" />
            <Skeleton className="mt-1 h-4 w-64" />
          </div>
          {showAction && <Skeleton className="h-10 w-32" />}
        </div>
      )}

      {type === "table" && (
        <div className="rounded-lg border border-border animate-pulse">
          <div className="border-b border-border bg-muted/30 p-4">
            <div className="flex gap-4">
              {Array.from({ length: columns }).map((_, i) => (
                <Skeleton key={i} className="h-5 w-24" />
              ))}
            </div>
          </div>
          <div className="divide-y divide-border">
            {Array.from({ length: count }).map((_, i) => (
              <div key={i} className="flex gap-4 p-4">
                {Array.from({ length: columns }).map((_, j) => (
                  <Skeleton key={j} className="h-5 w-24" />
                ))}
              </div>
            ))}
          </div>
        </div>
      )}

      {type === "card" && (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: count }).map((_, i) => (
            <div
              key={i}
              className="rounded-lg border border-border p-6 space-y-4 animate-pulse"
            >
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-20 w-full" />
            </div>
          ))}
        </div>
      )}

      {type === "form" && (
        <div className="space-y-6 animate-pulse">
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-10 w-full" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>
      )}
    </div>
  );
}
