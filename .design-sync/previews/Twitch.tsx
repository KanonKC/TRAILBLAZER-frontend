import * as React from "react";
import { Twitch, Button } from "trailblazer-ui";

export const Sizes = () => (
  <div className="p-6 flex items-center gap-6">
    <Twitch className="size-4" />
    <Twitch className="size-6" />
    <Twitch className="size-8" />
    <Twitch className="size-12 " />
  </div>
);

export const InButton = () => (
  <div className="p-6 flex items-center gap-3">
    <Button variant="twitch"><Twitch className="size-4" /> Twitch</Button>
    <Button variant="ghost" size="icon" aria-label="Twitch"><Twitch /></Button>
  </div>
);
