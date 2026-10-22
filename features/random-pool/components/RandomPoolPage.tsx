import { fetchData } from "@/lib/data-access";
import { InitialData } from "../types";
import { RandomPoolDashboard } from "./RandomPoolDashboard";
export async function RandomPoolPage({
  view,
  configId,
  poolId,
}: {
  view?: "list" | "pool" | "config";
  configId?: string;
  poolId?: string;
}) {
  const [pools, configs] = await Promise.all([
    fetchData<InitialData["pools"]>("/api/v1/random-pool/pools"),
    fetchData<InitialData["configs"]>("/api/v1/random-pool/configs"),
  ]);
  if (!pools?.data || !configs?.data)
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold">Random Pool</h1>
        <p className="mt-3">
          โหลดข้อมูลไม่สำเร็จ กรุณาเข้าสู่ระบบใหม่หรือรีเฟรชหน้า
        </p>
      </div>
    );
  return (
    <RandomPoolDashboard
      initial={{ pools, configs }}
      view={view}
      configId={configId}
      poolId={poolId}
    />
  );
}
