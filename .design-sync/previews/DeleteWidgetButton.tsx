import * as React from "react";
import { DeleteWidgetButton } from "trailblazer-ui";

export const Idle = () => (
  <div className="p-6"><DeleteWidgetButton onDelete={() => {}} isLoading={false} /></div>
);

export const Loading = () => (
  <div className="p-6"><DeleteWidgetButton onDelete={() => {}} isLoading /></div>
);
