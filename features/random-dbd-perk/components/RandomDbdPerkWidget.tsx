"use client"

import { useRandomDbdPerk, PERKS_PER_PAGE } from "../hooks/useRandomDbdPerk";
import { Skeleton } from "@/components/ui/skeleton";
import { 
    Dices, 
    Gift, 
    Play, 
    ChevronDown
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import GoToSettingsButton from "@/components/widget/GoToSettingsButton";

import WidgetOverviewCard from "@/components/widget/widget-tab-card/WidgetOverviewCard";
import WidgetQuickStartCard from "@/components/widget/widget-tab-card/WidgetQuickStartCard";
import { WidgetStepper } from "@/components/widget/WidgetStepper/WidgetStepper";
import WidgetStepperItems from "@/components/widget/WidgetStepper/WidgetStepperItems/WidgetStepperItems";
import WidgetEnabledBadge from "@/components/widget/WidgetEnabledBadge";
import { SaveWidgetButton } from "@/components/button/SaveWidgetButton";
import { DeleteWidgetButton } from "@/components/button/DeleteWidgetButton";
import WidgetSettingsCard from "@/components/widget/widget-tab-card/WidgetSettingsCard/WidgetSettingsCard";
import WidgetSettingsCardContent from "@/components/widget/widget-tab-card/WidgetSettingsCard/WidgetSettingsCardContent";
import WidgetSettingsCardFooter from "@/components/widget/widget-tab-card/WidgetSettingsCard/WidgetSettingsCardFooter";
import { TwitchRewardSelector } from "@/components/widget/TwitchRewardSelector";
import { MaxPerkSelector } from "./MaxPerkSelector";
import { WidgetTestControl } from "@/components/widget/WidgetTestControl";
import { PerkConfigItem } from "./PerkConfigItem";
import { RandomDbdPerkConfig } from "../types";
import { WidgetConfigLayout } from "@/components/widget/layout/WidgetConfigLayout";
import { WidgetTypeMeta } from "@/services/widget.service";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import RandomFormatInfo from "./RandomFormatInfo";

export function RandomDbdPerkWidget({ initialConfig, widgetType }: { initialConfig: RandomDbdPerkConfig | null; widgetType: WidgetTypeMeta }) {
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
        <WidgetConfigLayout widgetType={widgetType}>
            {({ triggerRefresh, refreshKey }) => (
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className={cn("grid w-full mb-4", config ? "grid-cols-3" : "grid-cols-1")}>
                        <TabsTrigger value="overview" className="cursor-pointer">ภาพรวม</TabsTrigger>
                        {config && (
                            <>
                                <TabsTrigger value="quick-start" className="cursor-pointer">เริ่มต้นใช้งาน</TabsTrigger>
                                <TabsTrigger value="settings" className="cursor-pointer">ตั้งค่า</TabsTrigger>
                            </>
                        )}
                    </TabsList>

                    <TabsContent value="overview">
                        <WidgetOverviewCard 
                            showLoginButton={!user} 
                            showEnableButton={!!user && !config} 
                            onClickEnable={async () => {
                                await handleEnable();
                                triggerRefresh();
                            }} 
                            isLoading={isSaving}
                        >
                            <p className="text-foreground text-base leading-relaxed">
                                วิดเจ็ตนี้ช่วยให้ผู้ชมใช้แต้มช่องของคุณ เพื่อสุ่ม Perk โดยแยกการตั้งค่าระหว่าง Survivor และ Killer ได้อย่างอิสระ
                            </p>
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="p-4 border rounded-xl bg-card">
                                    <div className="p-2 w-fit rounded-lg bg-violet/10 text-violet mb-3"><Dices className="w-5 h-5" /></div>
                                    <h3 className="font-semibold mb-1">Randomizer</h3>
                                    <p className="text-sm text-muted-foreground">สุ่มได้ทั้งราย Perk หรือรายหน้า</p>
                                </div>
                                <div className="p-4 border rounded-xl bg-card">
                                    <div className="p-2 w-fit rounded-lg bg-teal/10 text-teal mb-3"><Gift className="w-5 h-5" /></div>
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
                                            title: "เปิดใช้งานวิดเจ็ต",
                                            description: (<div className="space-y-3">
                                                <p className="text-sm text-muted-foreground">เปิดวิดเจ็ตนี้เพื่อให้ผู้ชมแลกแต้มช่องแล้วสุ่ม Perk ขึ้นหน้าจอสตรีมของคุณ</p>
                                                <WidgetEnabledBadge />
                                            </div>)
                                        },
                                        {
                                            step: 2,
                                            title: "เลือกประเภท Perk",
                                            description: (
                                                <div className="space-y-3">
                                                <p className="text-sm text-muted-foreground">เลือกว่าจะตั้งค่าการสุ่ม Perk ของฝั่งไหนก่อน แต่ละฝั่งตั้งค่าแต้มช่องและจำนวน Perk แยกกัน</p>
                                                <RadioGroup value={wizardType} onValueChange={(val) => setWizardType(val as "survivor" | "killer")} className="flex gap-4">
                                                    <div className={cn("flex items-center space-x-2 border rounded-lg p-3 w-full", wizardType === "survivor" ? "bg-info/10 border-info/50" : "bg-transparent border-border")}><RadioGroupItem value="survivor" id="r-survivor" /><Label htmlFor="r-survivor" className="flex-1 text-info">Survivor</Label></div>
                                                    <div className={cn("flex items-center space-x-2 border rounded-lg p-3 w-full", wizardType === "killer" ? "bg-violet/10 border-violet/50" : "bg-transparent border-border")}><RadioGroupItem value="killer" id="r-killer" /><Label htmlFor="r-killer" className="flex-1 text-violet">Killer</Label></div>
                                                </RadioGroup>
                                                </div>
                                            )
                                        },
                                        {
                                            step: 3,
                                            title: "เลือกแต้มช่อง",
                                            description: (
                                                <div className="space-y-3">
                                                    <p className="text-sm text-muted-foreground">เลือก Channel Points Reward บน Twitch ที่ผู้ชมจะแลกเพื่อสุ่ม Perk ของฝั่งที่เลือกไว้</p>
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
                                                <div className="space-y-3">
                                                <p className="text-sm text-muted-foreground">กำหนดว่าผู้ชมแต่ละคนจะสุ่มได้สูงสุดกี่ Perk ต่อครั้ง สามารถนับเป็นจำนวน Perk หรือเป็นหน้าได้</p>
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
</div>
                                            )
                                        },
                                        {
                                            step: 5,
                                            title: "บันทึกและทดสอบ",
                                            description: (
                                                <div className="space-y-3">
                                                    <p className="text-sm text-muted-foreground">กดบันทึก แล้วลองกดปุ่ม Test เพื่อดูตัวอย่างผลการสุ่ม Perk บนหน้าจอสตรีมของคุณ</p>
                                                    <WidgetTestControl isSaving={isSaving} isTesting={isTesting} onSave={handleSave} onTest={() => handleTest(wizardType)} canTest={!!perkClasses.find(c => c.type === wizardType)?.twitch_reward_id} />
                                                    <RandomFormatInfo />
                                                </div>
                                            )
                                        },
                                        {
                                            step: 6,
                                            title: "การตั้งค่าเพิ่มเติม",
                                            description: (
                                                <div className="space-y-3">
                                                    <p className="text-sm text-muted-foreground">ปรับจำนวน Perk ที่จะสุ่มของ Survivor และ Killer แยกกัน และทดลองสุ่มได้ในแท็บตั้งค่า</p>
                                                    <GoToSettingsButton onClick={() => setActiveTab("settings")} />
                                                </div>
                                            )
                                        }
                                    ]}
                                />
                            </WidgetStepper>
                        </WidgetQuickStartCard>
                    </TabsContent>

                    <TabsContent value="settings">
                        <WidgetSettingsCard 
                            widgetId={config?.widget?.id} 
                            isEnabled={isEnabled} 
                            cost={config?.widget?.widget_type?.cost}
                            onStatusChange={handleStatusChange}
                            onSuccess={triggerRefresh}
                        >
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
                                        <DropdownMenuTrigger asChild><Button variant="outline" disabled={isTesting}>{isTesting ? "กำลังทดสอบ..." : <><Play className="mr-2 h-4 w-4" /> Test <ChevronDown className="ml-2 h-3 w-3 opacity-50" /></>}</Button></DropdownMenuTrigger>
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
            )}
        </WidgetConfigLayout>
    );
}
