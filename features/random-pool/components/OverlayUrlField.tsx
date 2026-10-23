"use client";

import { OBSSetupHelp } from "@/components/widget/OBSSetupHelp";
import { SmartOverlayUrlInput } from "@/components/widget/SmartOverlayUrlInput";
import { overlayPath } from "../api/randomPool.api";
import { Config } from "../types";

export function OverlayUrlField({
  config,
  description,
  onRefreshed,
}: {
  config?: Config;
  description: string;
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
        hideLabel
      />
      <p className="text-muted-foreground text-sm">{description}</p>
      <OBSSetupHelp variant="default" className="mt-0" />
      <p className="text-muted-foreground text-sm">
        ขนาดแนะนำ 800 × 600 · พื้นหลังโปร่งใส
      </p>
    </div>
  );
}
