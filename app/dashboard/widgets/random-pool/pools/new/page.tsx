import { redirect } from "next/navigation";

export default function Page() {
  redirect("/dashboard/widgets/random-pool?tab=settings");
}
