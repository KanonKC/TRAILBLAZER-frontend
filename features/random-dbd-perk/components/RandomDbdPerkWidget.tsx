"use client"

import { Button } from "@/components/ui/button";
import { WidgetTestControl } from "@/components/widget/WidgetTestControl";
import { MaxPerkSelector } from "./MaxPerkSelector";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PerkConfigItem } from "./PerkConfigItem";
import { cn } from "@/lib/utils";
import { Dices, Gift, Play, ChevronDown } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { TwitchRewardSelector } from "@/components/widget/TwitchRewardSelector";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { WidgetStepper } from "@/components/widget/WidgetStepper/WidgetStepper";
import WidgetStepperItems from "@/components/widget/WidgetStepper/WidgetStepperItems/WidgetStepperItems";
import WidgetOverviewCard from "@/components/widget/widget-tab-card/WidgetOverviewCard";
import WidgetQuickStartCard from "@/components/widget/widget-tab-card/WidgetQuickStartCard";
import WidgetSettingsCard from "@/components/widget/widget-tab-card/WidgetSettingsCard/WidgetSettingsCard";
import WidgetSettingsCardContent from "@/components/widget/widget-tab-card/WidgetSettingsCard/WidgetSettingsCardContent";
import WidgetSettingsCardFooter from "@/components/widget/widget-tab-card/WidgetSettingsCard/WidgetSettingsCardFooter";
import { DeleteWidgetButton } from "@/components/button/DeleteWidgetButton";
import { SaveWidgetButton } from "@/components/button/SaveWidgetButton";
import RandomFormatInfo from "./RandomFormatInfo";

import { useRandomDbdPerk, PERKS_PER_PAGE } from "../hooks/useRandomDbdPerk";
import { RandomDbdPerkConfig } from "../types";
import WidgetEnabledBadge from "@/components/widget/WidgetEnabledBadge";

export function RandomDbdPerkWidget({ initialConfig }: { initialConfig: RandomDbdPerkConfig | null }) {
    const {
        user,
        config,
        isEnabled,
        isSaving,
        isTesting,
        isUserLoading,
        activeTab,
        perkClasses,
        survivorUnit,
        killerUnit,
        wizardType,
        setWizardType,
        setSurvivorUnit,
        setKillerUnit,
        setActiveTab,
        handleEnable,
        handleDelete,
        handleSave,
        handleTest,
        handleStatusChange,
        updatePerkClass
    } = useRandomDbdPerk(initialConfig);

    if (isUserLoading) {
        return (
            <div className="container mx-auto py-10">
                <Skeleton className="h-[300px] w-full max-w-2xl mx-auto rounded-xl" />
            </div>
        )
    }

    return (
        <div className="container mx-auto py-10 flex flex-col items-center">
            <div className="w-full max-w-2xl mb-8">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500">
                        <Dices className="w-6 h-6" />
                    </div>
                    <h1 className="text-3xl font-bold">Random DBD Perk</h1>
                </div>
                <p className="text-muted-foreground text-lg">
                    สุ่ม Perk Dead by Daylight สำหรับ Survivor และ Killer ผ่านการแลกแต้มช่อง หรือคำสั่งแชท
                </p>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full max-w-2xl">
                <TabsList className={cn("grid w-full mb-4", config ? "grid-cols-3" : "grid-cols-1")}>
                    <TabsTrigger value="overview" className="cursor-pointer">Overview</TabsTrigger>
                    {config && (
                        <>
                            <TabsTrigger value="quick-start" className="cursor-pointer">Quick Start</TabsTrigger>
                            <TabsTrigger value="settings" className="cursor-pointer">Settings</TabsTrigger>
                        </>
                    )}
                </TabsList>

                <TabsContent value="overview">
                    <WidgetOverviewCard showLoginButton={!user} showEnableButton={!!user && !config} onClickEnable={handleEnable} isLoading={isSaving}>
                        <p className="text-gray-200 text-base leading-relaxed">
                            วิดเจ็ตนี้ช่วยให้ผู้ชมใช้แต้มช่องของคุณ เพื่อสุ่ม Perk โดยแยกการตั้งค่าระหว่าง Survivor และ Killer ได้อย่างอิสระ
                        </p>
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="p-4 border rounded-xl bg-card hover:bg-accent/5 transition-colors">
                                <div className="p-2 w-fit rounded-lg bg-emerald-500/10 text-emerald-500 mb-3"><Dices className="w-5 h-5" /></div>
                                <h3 className="font-semibold mb-1">Randomizer</h3>
                                <p className="text-sm text-muted-foreground">สุ่มได้ทั้งราย Perk หรือรายหน้า</p>
                            </div>
                            <div className="p-4 border rounded-xl bg-card hover:bg-accent/5 transition-colors">
                                <div className="p-2 w-fit rounded-lg bg-purple-500/10 text-purple-500 mb-3"><Gift className="w-5 h-5" /></div>
                                <h3 className="font-semibold mb-1">Channel Points</h3>
                                <p className="text-sm text-muted-foreground">เชื่อมต่อกับแต้มช่อง Twitch โดยตรง</p>
                            </div>
                        </div>
                    </WidgetOverviewCard>
                </TabsContent>

                <TabsContent value="quick-start">
                    <WidgetQuickStartCard>
                        <WidgetStepper>
                            <WidgetStepperItems
                                items={[
                                    {
                                        step: 1,
                                        title: "เปิดใช้งาน Widget",
                                        description: <WidgetEnabledBadge />
                                    },
                                    {
                                        step: 2,
                                        title: "เลือกประเภท Perk",
                                        description: (
                                            <RadioGroup value={wizardType} onValueChange={(val) => setWizardType(val as "survivor" | "killer")} className="flex gap-4">
                                                <div className={cn("flex items-center space-x-2 border rounded-lg p-3 w-full", wizardType === "survivor" ? "bg-blue-500/10 border-blue-500/50" : "bg-transparent border-white/10")}><RadioGroupItem value="survivor" id="r-survivor" /><Label htmlFor="r-survivor" className="flex-1 text-blue-400">Survivor</Label></div>
                                                <div className={cn("flex items-center space-x-2 border rounded-lg p-3 w-full", wizardType === "killer" ? "bg-red-500/10 border-red-500/50" : "bg-transparent border-white/10")}><RadioGroupItem value="killer" id="r-killer" /><Label htmlFor="r-killer" className="flex-1 text-red-400">Killer</Label></div>
                                            </RadioGroup>
                                        )
                                    },
                                    {
                                        step: 3,
                                        title: "เลือกแต้มช่อง",
                                        description: (
                                            <div className="space-y-3">
                                                <p className="text-sm text-white/70">ช่องเชื่อมต่อแต้มช่อง</p>
                                                <TwitchRewardSelector
                                                    value={perkClasses.find(c => c.type === wizardType)?.twitch_reward_id || null}
                                                    onValueChange={(val) => {
                                                        const index = perkClasses.findIndex(c => c.type === wizardType);
                                                        if (index !== -1) updatePerkClass(index, 'twitch_reward_id', val);
                                                    }}
                                                    userInputRequired={false}
                                                    placeholder="เลือก Reward..."
                                                />
                                            </div>
                                        )
                                    },
                                    {
                                        step: 4,
                                        title: "กำหนดจำนวน Perk",
                                        description: (
                                            <div className="border p-4 rounded-xl bg-muted/20">
                                                {(() => {
                                                    const currentLimitClass = perkClasses.find(c => c.type === wizardType);
                                                    const totalPerks = wizardType === 'killer' ? (config?.totalKillerPerks || 0) : (config?.totalSurvivorPerks || 0);
                                                    const unit = wizardType === 'survivor' ? survivorUnit : killerUnit;
                                                    const maxValue = unit === 'perk' ? totalPerks : Math.ceil(totalPerks / PERKS_PER_PAGE);
                                                    const effectiveMaxSize = Math.min(currentLimitClass?.maximum_random_size || 0, totalPerks);
                                                    const currentValue = unit === 'perk' ? effectiveMaxSize : Math.ceil(effectiveMaxSize / PERKS_PER_PAGE);

                                                    return (
                                                        <MaxPerkSelector
                                                            maxValue={maxValue}
                                                            currentValue={currentValue}
                                                            unit={unit}
                                                            onUnitChange={wizardType === 'survivor' ? (v) => { setSurvivorUnit(v); localStorage.setItem("random-dbd-perk-unit-preference-survivor", v); } : (v) => { setKillerUnit(v); localStorage.setItem("random-dbd-perk-unit-preference-killer", v); }}
                                                            onCountChange={(val) => {
                                                                let newValue = unit === 'page' ? val * PERKS_PER_PAGE : val;
                                                                if (newValue > totalPerks) newValue = totalPerks;
                                                                const index = perkClasses.findIndex(c => c.type === wizardType);
                                                                if (index !== -1) updatePerkClass(index, 'maximum_random_size', newValue);
                                                            }}
                                                        />
                                                    );
                                                })()}
                                            </div>
                                        )
                                    },
                                    {
                                        step: 5,
                                        title: "บันทึกและทดสอบ",
                                        description: (
                                            <div className="space-y-3">
                                                <WidgetTestControl isSaving={isSaving} isTesting={isTesting} onSave={handleSave} onTest={() => handleTest(wizardType)} canTest={!!perkClasses.find(c => c.type === wizardType)?.twitch_reward_id} />
                                                <RandomFormatInfo />
                                            </div>
                                        )
                                    }
                                ]}
                            />
                        </WidgetStepper>
                    </WidgetQuickStartCard>
                </TabsContent>

                <TabsContent value="settings">
                    <WidgetSettingsCard widgetId={config?.widget?.id} isEnabled={isEnabled} onStatusChange={handleStatusChange}>
                        <WidgetSettingsCardContent>
                            <RandomFormatInfo />
                            {perkClasses.map((item, index) => (
                                <PerkConfigItem
                                    key={item.id}
                                    item={item}
                                    index={index}
                                    updatePerkClass={updatePerkClass}
                                    totalPerks={item.type === 'killer' ? (config?.totalKillerPerks || 0) : (config?.totalSurvivorPerks || 0)}
                                    unit={item.type === 'survivor' ? survivorUnit : killerUnit}
                                    onUnitChange={item.type === 'survivor' ? setSurvivorUnit : setKillerUnit}
                                />
                            ))}
                        </WidgetSettingsCardContent>
                        <WidgetSettingsCardFooter>
                            <DeleteWidgetButton onDelete={handleDelete} isLoading={isSaving} />
                            <div className="flex gap-2">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild><Button variant="outline" disabled={isTesting}>{isTesting ? "Testing..." : <><Play className="mr-2 h-4 w-4" /> Test <ChevronDown className="ml-2 h-3 w-3 opacity-50" /></>}</Button></DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem onClick={() => handleTest('survivor')}>Test Survivor</DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => handleTest('killer')}>Test Killer</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                                <SaveWidgetButton onSave={handleSave} isLoading={isSaving} />
                            </div>
                        </WidgetSettingsCardFooter>
                    </WidgetSettingsCard>
                </TabsContent>
            </Tabs>
        </div>
    );
}
