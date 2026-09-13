import * as React from "react";
import { Skeleton } from "trailblazer-ui";

export const UserRow = () => (
  <div className="flex items-center gap-4 p-6">
    <Skeleton className="size-12 rounded-full" />
    <div className="grid gap-2">
      <Skeleton className="h-4 w-48" />
      <Skeleton className="h-4 w-32" />
    </div>
  </div>
);

export const CardPlaceholder = () => (
  <div className="p-6 max-w-sm grid gap-3">
    <Skeleton className="aspect-video w-full rounded-xl" />
    <Skeleton className="h-5 w-2/3" />
    <Skeleton className="h-4 w-full" />
    <Skeleton className="h-4 w-5/6" />
  </div>
);
