import { redirect } from "next/navigation";

// Config editing now lives in the Settings tab of the single Random Pool page.
export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  redirect(
    `/dashboard/widgets/random-pool?tab=settings&config=${encodeURIComponent(id)}`,
  );
}
