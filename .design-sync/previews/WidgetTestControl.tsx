import * as React from "react";
import { WidgetTestControl } from "trailblazer-ui";

export const Ready = () => (
  <div className="p-6"><WidgetTestControl isSaving={false} isTesting={false} canTest onSave={() => {}} onTest={() => {}} /></div>
);

export const Saving = () => (
  <div className="p-6"><WidgetTestControl isSaving isTesting={false} canTest onSave={() => {}} onTest={() => {}} /></div>
);

export const Testing = () => (
  <div className="p-6"><WidgetTestControl isSaving={false} isTesting canTest onSave={() => {}} onTest={() => {}} /></div>
);

export const CannotTest = () => (
  <div className="p-6"><WidgetTestControl isSaving={false} isTesting={false} canTest={false} onSave={() => {}} onTest={() => {}} /></div>
);
