import * as React from "react";
import { SaveWidgetButton } from "trailblazer-ui";

export const Idle = () => (
  <div className="p-6"><SaveWidgetButton onSave={() => {}} isLoading={false} /></div>
);

export const Loading = () => (
  <div className="p-6"><SaveWidgetButton onSave={() => {}} isLoading /></div>
);
