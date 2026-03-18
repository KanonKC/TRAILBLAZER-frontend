"use client"
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useUser } from "@/components/user-context";
import { Check } from "lucide-react";
import SelectPlanButton from "./SelectPlanButton";

const PricingClient = () => {

    const { user } = useUser()

    const calculateButtonStatus = (tierRequired: number) => {
        const tier = user?.tier || 0
        if (tier === tierRequired) {
            return "current"
        } else if (tier < tierRequired) {
            return "upper"
        }
        return "lower"
    }

    return (
        <div className="container mx-auto py-20 px-4 max-w-2xl">
            <div className="text-center mb-12 space-y-4">
                <h1 className="text-4xl font-bold tracking-tight">เลือกแผนที่เหมาะกับคุณ</h1>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                {/* Free Plan */}
                <Card className="flex flex-col relative border-2 border-muted">
                    <CardHeader className="text-center pb-8 border-b">
                        <CardTitle className="text-2xl font-bold mb-2">Free</CardTitle>
                        <CardDescription>สำหรับผู้ที่เริ่มต้นใช้งาน</CardDescription>
                        <div className="mt-4 flex items-baseline justify-center gap-1">
                            <span className="text-4xl font-bold">0</span>
                            <span className="text-muted-foreground">บาท / เดือน</span>
                        </div>
                    </CardHeader>
                    <CardContent className="flex-1 pt-6">
                        <ul className="space-y-4">
                            <li className="flex items-center gap-3">
                                <span className="bg-primary/20 text-primary p-1 rounded-full"><Check className="h-4 w-4" /></span>
                                <span>สามารถใช้งานได้ 1 Widget</span>
                            </li>
                        </ul>
                    </CardContent>
                    <CardFooter className="pt-6">
                        <SelectPlanButton status={calculateButtonStatus(0)} />
                    </CardFooter>
                </Card>

                {/* Pro Plan */}
                <Card className="flex flex-col relative border-2 border-amber-500 shadow-lg shadow-amber-500/20">
                    {/* <div className="absolute top-0 right-0 transform translate-x-2 -translate-y-3">
                        <span className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                            ยอดนิยม
                        </span>
                    </div> */}
                    <CardHeader className="text-center pb-8 border-b">
                        <CardTitle className="text-2xl font-bold mb-2 text-amber-500">Pro</CardTitle>
                        <CardDescription>ปลดล็อกทุกความสามารถ</CardDescription>
                        <div className="mt-4 flex items-baseline justify-center gap-1">
                            <span className="text-4xl font-bold">69</span>
                            <span className="text-muted-foreground">บาท / เดือน</span>
                        </div>
                    </CardHeader>
                    <CardContent className="flex-1 pt-6">
                        <ul className="space-y-4">
                            <li className="flex items-center gap-3">
                                <span className="bg-amber-500/20 text-amber-500 p-1 rounded-full"><Check className="h-4 w-4" /></span>
                                <span className="font-semibold">ใช้งาน Widget ได้อย่างไร้ขีดจำกัด</span>
                            </li>
                        </ul>
                    </CardContent>
                    <CardFooter className="pt-6">
                        <SelectPlanButton status={calculateButtonStatus(1)} />
                    </CardFooter>
                </Card>
            </div>
        </div>
    )
}

export default PricingClient