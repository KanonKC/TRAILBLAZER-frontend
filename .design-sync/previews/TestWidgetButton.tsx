import * as React from "react";
import { TestWidgetButton } from "trailblazer-ui";

export const Idle = () => (
  <div className="p-6"><TestWidgetButton onTest={() => {}} isLoading={false} /></div>
);

export const Loading = () => (
  <div className="p-6"><TestWidgetButton onTest={() => {}} isLoading /></div>
);

export const Disabled = () => (
  <div className="p-6"><TestWidgetButton onTest={() => {}} isLoading={false} disabled /></div>
);
