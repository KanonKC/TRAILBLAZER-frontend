import * as React from "react";
import { Spotify, Button } from "trailblazer-ui";

export const Sizes = () => (
  <div className="p-6 flex items-center gap-6">
    <Spotify className="size-4" />
    <Spotify className="size-6" />
    <Spotify className="size-8" />
    <Spotify className="size-12 spotify" />
  </div>
);

export const InButton = () => (
  <div className="p-6 flex items-center gap-3">
    <Button variant="outline"><Spotify className="size-4" /> Spotify</Button>
    <Button variant="ghost" size="icon" aria-label="Spotify"><Spotify /></Button>
  </div>
);
