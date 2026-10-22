import { RandomPoolPage } from "@/features/random-pool/components/RandomPoolPage";
export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <RandomPoolPage view="config" configId={id} />;
}
