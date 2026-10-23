import { fetchData, getWidgetTypeMeta } from "@/lib/data-access";
import { WidgetTypeLoadError } from "@/components/widget/WidgetTypeLoadError";
import { InitialData } from "../types";
import { RandomPoolTab } from "../hooks/useRandomPool";
import { RandomPoolWidget } from "./RandomPoolWidget";

const SLUG = "random-pool";
const tabs: RandomPoolTab[] = ["overview", "quick-start", "settings"];

export async function RandomPoolPage({
  tab,
  configId,
}: {
  tab?: string;
  configId?: string;
}) {
  const [pools, configs, widgetType] = await Promise.all([
    fetchData<InitialData["pools"]>("/api/v1/random-pool/pools"),
    fetchData<InitialData["configs"]>("/api/v1/random-pool/configs"),
    getWidgetTypeMeta(SLUG),
  ]);
  if (widgetType === undefined)
    return <WidgetTypeLoadError slug={SLUG} reason="fetch-failed" />;
  if (widgetType === null)
    return <WidgetTypeLoadError slug={SLUG} reason="not-found" />;

  // Without a session the API refuses both lists, so show the public overview.
  const initial = pools?.data && configs?.data ? { pools, configs } : null;
  const startTab = tabs.find((candidate) => candidate === tab);

  return (
    <RandomPoolWidget
      initial={initial}
      widgetType={widgetType}
      start={{ tab: startTab, configId }}
    />
  );
}
