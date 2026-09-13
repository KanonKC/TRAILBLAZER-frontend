import * as React from "react";
import { OBSSetupHelp } from "trailblazer-ui";

export const AudioOpen = () => (
  <div className="p-6 max-w-md"><OBSSetupHelp type="audio" defaultOpen /></div>
);

export const ImageOpen = () => (
  <div className="p-6 max-w-md"><OBSSetupHelp type="image" defaultOpen /></div>
);

export const DefaultVariantClosed = () => (
  <div className="p-6 max-w-md"><OBSSetupHelp variant="default" /></div>
);
