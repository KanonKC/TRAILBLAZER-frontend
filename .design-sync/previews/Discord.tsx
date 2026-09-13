import * as React from "react";
import { Discord, Button } from "trailblazer-ui";

export const Sizes = () => (
  <div className="p-6 flex items-center gap-6">
    <Discord className="size-4" />
    <Discord className="size-6" />
    <Discord className="size-8" />
    <Discord className="size-12 text-discord" />
  </div>
);

export const InButton = () => (
  <div className="p-6 flex items-center gap-3">
    <Button variant="outline"><Discord className="size-4" /> Discord</Button>
    <Button variant="ghost" size="icon" aria-label="Discord"><Discord /></Button>
  </div>
);
