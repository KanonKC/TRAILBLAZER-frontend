import { RandomPoolPage } from "@/features/random-pool/components/RandomPoolPage";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string; config?: string }>;
}) {
  const { tab, config } = await searchParams;
  return <RandomPoolPage tab={tab} configId={config} />;
}
