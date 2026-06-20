import { Hero } from "@/components/landing/hero";
import { ShowcaseItem, StreamerShowcase } from "@/components/landing/streamer-showcase";
import { fetchData } from "@/lib/data-access";

export default async function Page() {
    let showcase: ShowcaseItem[] = [];

    try {
        const response = await fetchData<ShowcaseItem[]>("/api/v1/users/showcase");
        if (response) {
            showcase = response
        }
    } catch { }

    return (
        <main className="min-h-screen">
            <Hero />
            <StreamerShowcase streamers={showcase || []} />
            <script data-name="BMC-Widget" data-cfasync="false" src="https://cdnjs.buymeacoffee.com/1.0.0/widget.prod.min.js" data-id="kanonkc" data-description="Support me on Buy me a coffee!" data-message="Support This Project!" data-color="#ff9b19ff" data-position="Right" data-x_margin="18" data-y_margin="18"></script>
        </main>
    );
}