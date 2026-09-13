import * as React from "react";
import { WidgetTypeLoadError } from "trailblazer-ui";

export const NotFound = () => (
  <div className="p-2"><WidgetTypeLoadError slug="clip-shoutout" reason="not-found" /></div>
);

export const FetchFailed = () => (
  <div className="p-2"><WidgetTypeLoadError slug="clip-shoutout" reason="fetch-failed" /></div>
);
