import * as React from "react";
import { YouTube, Button } from "trailblazer-ui";

export const Sizes = () => (
  <div className="p-6 flex items-center gap-6">
    <YouTube className="size-4" />
    <YouTube className="size-6" />
    <YouTube className="size-8" />
    <YouTube className="size-12 text-red-500" />
  </div>
);

export const InButton = () => (
  <div className="p-6 flex items-center gap-3">
    <Button variant="outline"><YouTube className="size-4" /> YouTube</Button>
    <Button variant="ghost" size="icon" aria-label="YouTube"><YouTube /></Button>
  </div>
);
