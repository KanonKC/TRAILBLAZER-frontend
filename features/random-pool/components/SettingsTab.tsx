"use client";

import { RandomPoolController } from "../hooks/useRandomPool";
import { ConfigEditor } from "./ConfigEditor";

export function SettingsTab({
  controller,
}: {
  controller: RandomPoolController;
}) {
  return <ConfigEditor controller={controller} />;
}
