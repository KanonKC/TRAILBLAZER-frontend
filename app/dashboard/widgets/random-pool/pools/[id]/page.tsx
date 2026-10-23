import { redirect } from "next/navigation";

// Pools are managed from the Settings tab now.
export default function Page() {
  redirect("/dashboard/widgets/random-pool?tab=settings");
}
