import * as React from "react";
import { OverlayUrlInput } from "trailblazer-ui";

const url = "https://trailblazer.app/overlays/clip-shoutout/8f3a2c9e-1b7d-4e6a-9c2f-5d8b1a3e7f04";

export const WithLabel = () => (
  <div className="p-6 max-w-lg"><OverlayUrlInput url={url} /></div>
);

export const WithRefresh = () => (
  <div className="p-6 max-w-lg"><OverlayUrlInput url={url} showRefresh onRefresh={() => {}} hideLabel /></div>
);

export const Disabled = () => (
  <div className="p-6 max-w-lg"><OverlayUrlInput url={url} disabled hideLabel /></div>
);
