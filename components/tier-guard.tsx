"use client";

import React from "react";
import { useUser } from "@/components/user-context";
import { Lock, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";

interface TierGuardProps {
    requiredTier: number;
    children: React.ReactNode;
    featureName?: string;
}

export function TierGuard({ requiredTier, children, featureName = "This feature" }: TierGuardProps) {
    const { user, isLoading } = useUser();

    if (isLoading) {
        return (
            <div className="w-full h-[400px] flex items-center justify-center">
                <Skeleton className="w-full max-w-md h-[300px] rounded-xl" />
            </div>
        );
    }

    const currentTier = user?.tier || 0;

    if (currentTier >= requiredTier) {
        return <>{children}</>;
    }

    return (
        <div className="w-full h-[60vh] flex flex-col items-center justify-center p-4">
            <Card className="max-w-md w-full border-amber-500/20 shadow-lg shadow-amber-500/5 overflow-hidden">
                <div className="h-2 w-full bg-gradient-to-r from-amber-400 to-orange-500" />
                <CardHeader className="text-center pt-8">
                    <div className="mx-auto w-16 h-16 bg-amber-500/10 rounded-full flex items-center justify-center mb-4">
                        <Lock className="w-8 h-8 text-amber-500" />
                    </div>
                    <CardTitle className="text-2xl font-bold">Premium Feature</CardTitle>
                    <CardDescription className="text-base mt-2">
                        {featureName} is only available on our Pro tier.
                        Upgrade your account to unlock this and many other advanced features.
                    </CardDescription>
                </CardHeader>
                <CardContent className="px-8 pb-8">
                    <ul className="space-y-3 mt-4">
                        {['Access to all premium widgets', 'Priority support', 'Custom widget styles', 'Higher usage limits'].map((benefit, i) => (
                            <li key={i} className="flex items-center gap-3 text-sm text-muted-foreground">
                                <Sparkles className="w-4 h-4 text-amber-500" />
                                <span>{benefit}</span>
                            </li>
                        ))}
                    </ul>
                </CardContent>
                <CardFooter className="bg-muted/50 p-6 flex-col gap-3">
                    <Button asChild className="w-full bg-amber-500 hover:bg-amber-600 text-white border-0">
                        <Link href="/dashboard/billing">
                            Upgrade to Pro
                        </Link>
                    </Button>
                    <Button asChild variant="ghost" className="w-full">
                        <Link href="/dashboard/widgets">
                            Back to Widgets
                        </Link>
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
