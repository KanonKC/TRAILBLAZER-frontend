import * as React from "react";
import { WidgetStatusControl } from "trailblazer-ui";

export const NotEnabled = () => (
  <div className="p-6"><WidgetStatusControl isEnabled={false} isSaving={false} onEnable={() => {}} /></div>
);

export const Saving = () => (
  <div className="p-6"><WidgetStatusControl isEnabled={false} isSaving onEnable={() => {}} /></div>
);

export const Enabled = () => (
  <div className="p-6"><WidgetStatusControl isEnabled isSaving={false} onEnable={() => {}} /></div>
);
