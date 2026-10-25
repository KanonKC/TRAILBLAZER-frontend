"use client";

import { OBSSetupHelp } from "@/components/widget/OBSSetupHelp";
import { SmartOverlayUrlInput } from "@/components/widget/SmartOverlayUrlInput";
import { overlayPath } from "../api/randomPool.api";
import { Config } from "../types";

export function OverlayUrlField({
  config,
  showLabel = false,
  onRefreshed,
}: {
  config?: Config;
  /** Show the shared label and usage hint above the field (Settings). Quick Start hides them because its step text says it. */
  showLabel?: boolean;
  onRefreshed: () => unknown;
}) {
  if (!config)
    return (
      <p className="text-muted-foreground text-sm">
        บันทึกการตั้งค่าก่อน แล้ว Overlay URL ของการตั้งค่านี้จะแสดงที่นี่
      </p>
    );
  const url =
    typeof window === "undefined"
      ? overlayPath(config)
      : `${window.location.origin}${overlayPath(config)}`;
  return (
    <div className="grid gap-2">
      <SmartOverlayUrlInput
        url={url}
        slug={`random-pool/configs/${config.id}`}
        onSuccess={() => void onRefreshed()}
        hideLabel={!showLabel}
      />
      <OBSSetupHelp className="mt-0" />
    </div>
  );
}
