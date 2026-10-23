"use client";

import { usePathname } from "next/navigation";
import { Footer } from "@/components/landing/footer";

export function ConditionalFooter() {
  const pathname = usePathname();
  return pathname?.startsWith("/overlays/") ? null : <Footer />;
}
