"use client"

// TODO notice this: All platforms share a single callback page.
// If you need separate callback pages per platform in the future,
// create /callback/youtube/page.tsx, /callback/discord/page.tsx instead.

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";
import { bindAccount } from "@/features/account-binding/api/linkedAccount.api";
import { tbToast } from "@/utils/tbToast";
import { Skeleton } from "@/components/ui/skeleton";

function CallbackHandler() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [status, setStatus] = useState<"processing" | "success" | "error">("processing");

    useEffect(() => {
        const handleCallback = async () => {
            const code = searchParams.get("code");
            const state = searchParams.get("state");

            if (!code) {
                setStatus("error");
                tbToast.error({ title: "ไม่พบ OAuth code" });
                setTimeout(() => router.replace("/my/account-binding"), 2000);
                return;
            }

            // Validate state
            const savedState = sessionStorage.getItem("oauth_state");
            const platform = sessionStorage.getItem("oauth_platform");
            const codeVerifier = sessionStorage.getItem("oauth_code_verifier");

            if (!platform) {
                setStatus("error");
                tbToast.error({ title: "ไม่พบข้อมูลแพลตฟอร์ม" });
                setTimeout(() => router.replace("/my/account-binding"), 2000);
                return;
            }

            if (savedState && state !== savedState) {
                setStatus("error");
                tbToast.error({ title: "State ไม่ถูกต้อง กรุณาลองใหม่" });
                setTimeout(() => router.replace("/my/account-binding"), 2000);
                return;
            }

            try {
                await bindAccount(platform, code, codeVerifier || undefined);
                setStatus("success");
                tbToast.success({ title: "เชื่อมต่อบัญชีสำเร็จ" });
            } catch (error) {
                console.error("Failed to bind account", error);
                setStatus("error");
                tbToast.error({ title: "ไม่สามารถเชื่อมต่อบัญชีได้" });
            } finally {
                // Clean up sessionStorage
                sessionStorage.removeItem("oauth_state");
                sessionStorage.removeItem("oauth_platform");
                sessionStorage.removeItem("oauth_code_verifier");
                setTimeout(() => router.replace("/my/account-binding"), 1500);
            }
        };

        handleCallback();
    }, [searchParams, router]);

    return (
        <div className="container mx-auto py-16 px-4 max-w-md text-center space-y-4">
            {status === "processing" && (
                <>
                    <div className="flex justify-center">
                        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                    </div>
                    <p className="text-muted-foreground">กำลังเชื่อมต่อบัญชี...</p>
                </>
            )}
            {status === "success" && (
                <>
                    <div className="text-4xl">✅</div>
                    <p className="text-emerald-400 font-medium">เชื่อมต่อบัญชีสำเร็จ!</p>
                    <p className="text-sm text-muted-foreground">กำลังนำคุณกลับ...</p>
                </>
            )}
            {status === "error" && (
                <>
                    <div className="text-4xl">❌</div>
                    <p className="text-red-400 font-medium">เชื่อมต่อบัญชีไม่สำเร็จ</p>
                    <p className="text-sm text-muted-foreground">กำลังนำคุณกลับ...</p>
                </>
            )}
        </div>
    );
}

export default function AccountBindingCallbackPage() {
    return (
        <Suspense fallback={
            <div className="container mx-auto py-16 px-4 max-w-md text-center space-y-4">
                <Skeleton className="h-10 w-10 rounded-full mx-auto" />
                <Skeleton className="h-4 w-48 mx-auto" />
            </div>
        }>
            <CallbackHandler />
        </Suspense>
    );
}
