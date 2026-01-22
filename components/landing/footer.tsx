import { Flame } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export function Footer() {
    return (
        <footer className="py-12 px-4 relative">
            <div className="max-w-6xl mx-auto">
                <Separator className="mb-12 bg-border/50" />

                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    {/* Logo & brand */}
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg blaze-gradient">
                            <Flame className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-lg font-semibold">Blaze</span>
                    </div>

                    {/* Links */}
                    <nav className="flex items-center gap-6 text-sm text-muted-foreground">
                        <a href="#" className="hover:text-foreground transition-colors">
                            เอกสาร
                        </a>
                        <a href="#" className="hover:text-foreground transition-colors">
                            API อ้างอิง
                        </a>
                        <a href="#" className="hover:text-foreground transition-colors">
                            ช่วยเหลือ
                        </a>
                        <a href="#" className="hover:text-foreground transition-colors">
                            GitHub
                        </a>
                    </nav>

                    {/* Copyright */}
                    <p className="text-sm text-muted-foreground">
                        © {new Date().getFullYear()} Blaze. สงวนลิขสิทธิ์
                    </p>
                </div>
            </div>
        </footer>
    );
}
