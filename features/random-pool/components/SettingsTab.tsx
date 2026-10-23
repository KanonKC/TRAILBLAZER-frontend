"use client";

import { RandomPoolController } from "../hooks/useRandomPool";
import { ConfigEditor } from "./ConfigEditor";
import { ConfigList } from "./ConfigList";

export function SettingsTab({
  controller,
}: {
  controller: RandomPoolController;
}) {
  return controller.settingsView === "list" ? (
    <ConfigList controller={controller} />
  ) : (
    <ConfigEditor controller={controller} />
  );
}
