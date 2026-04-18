import { Flame } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export function Footer() {
    return (
        <footer className="py-12 px-4 relative">
            <div className="max-w-6xl mx-auto">
                <Separator className="mb-12 bg-border/50" />

                <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative">
                    {/* Logo & brand */}
                    <div className="flex items-center gap-3">
                        <span className="text-lg font-semibold">TRAILBLAZER</span>
                    </div>

                    {/* Links */}
                    <nav className="flex items-center gap-6 text-sm text-muted-foreground absolute z-10 left-1/2 -translate-x-1/2">
                        <a href="https://discord.gg/aH4X6PJ3kt" target="_blank" className="hover:text-foreground transition-colors">
                            Discord
                        </a>
                        <a href="https://github.com/kanonkc" target="_blank" className="hover:text-foreground transition-colors">
                            GitHub
                        </a>
                        <a href="https://twitch.tv/kanonkc" target="_blank" className="hover:text-foreground transition-colors">
                            Twitch
                        </a>
                    </nav>

                    {/* Copyright */}
                    <p className="text-sm text-muted-foreground">
                        TRAILBLAZER © {new Date().getFullYear()}. All Rights Reserved
                    </p>
                </div>
            </div>
        </footer>
    );
}
