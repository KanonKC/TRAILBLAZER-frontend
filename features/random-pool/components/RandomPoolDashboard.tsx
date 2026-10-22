"use client";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Dice5,
  Plus,
  ArrowLeft,
  Pencil,
  Trash2,
  Copy,
  Layers,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InitialData, Pool } from "../types";
import { emptyPool, useRandomPool } from "../hooks/useRandomPool";
import { overlayPath } from "../api/randomPool.api";
import { PoolEditor } from "./PoolEditor";
import { PoolList } from "./PoolList";
import { SoundInput } from "./SoundInput";
const base = "/dashboard/widgets/random-pool";
const states = {
  READY: "พร้อมใช้งาน",
  EMPTY: "Pool ว่าง — เพิ่ม Item ก่อนเปิดใช้งาน",
  DELETED: "Pool ถูกลบ — กรุณาเลือก Pool ใหม่",
  HIDDEN: "Pool ถูกซ่อน — กรุณาเลือก Pool ใหม่",
};
function ConfirmDelete({
  description,
  onConfirm,
  disabled,
}: {
  description: string;
  onConfirm: () => void;
  disabled: boolean;
}) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline" disabled={disabled}>
          <Trash2 className="size-4" />
          ลบ
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>ยืนยันการลบ</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>ยกเลิก</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>ยืนยันลบ</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
function poolDeleteDescription(pool: Pool) {
  return `ลบ Pool “${pool.name}”? มี ${pool._count.configs} Config ของคุณใช้อยู่ และ 0 คน Import ใช้ Config เหล่านี้จะต้องเลือก Pool ใหม่`;
}
export function RandomPoolDashboard({
  initial,
  view = "list",
  configId,
  poolId,
}: {
  initial: InitialData;
  view?: "list" | "pool" | "config";
  configId?: string;
  poolId?: string;
}) {
  const controller = useRandomPool(
    initial,
    configId,
    poolId,
    view === "config",
  );
  const search = useSearchParams();
  const {
    data,
    config,
    setConfig,
    pool,
    setPool,
    busy,
    error,
    notice,
    selectedPool,
    savedConfig,
  } = controller;
  const missing =
    (view === "config" && configId && !savedConfig) ||
    (view === "pool" &&
      poolId &&
      !data.pools.data.some((pool) => pool.id === poolId));
  return (
    <div
      className={`mx-auto w-full max-w-7xl space-y-6 p-4 sm:p-6 lg:p-8 ${view === "pool" || view === "list" ? "rounded-2xl bg-[#090c14]" : ""}`}
    >
      {view === "config" && (
        <header className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="mb-2 flex items-center gap-3">
              <Dice5 className="size-8 text-orange-500" />
              <h1 className="text-2xl font-bold sm:text-3xl">Random Pool</h1>
              <Badge variant="secondary">Channel Points</Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              สร้าง Pool ของคุณ แล้วให้ผู้ชมแลกแต้มสุ่มผ่าน Overlay บนสตรีม
            </p>
          </div>
          <Button asChild variant="outline">
            <Link href={base}>
              <ArrowLeft className="size-4" />
              กลับรายการ
            </Link>
          </Button>
        </header>
      )}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {notice && (
        <Alert>
          <AlertDescription>{notice}</AlertDescription>
        </Alert>
      )}
      {missing ? (
        <Alert>
          <AlertDescription>
            ไม่พบรายการนี้ หรือคุณไม่มีสิทธิ์เข้าถึง
          </AlertDescription>
        </Alert>
      ) : view === "list" ? (
        <Tabs
          defaultValue={search.get("tab") === "configs" ? "configs" : "pools"}
        >
          <TabsList className="border border-white/10 bg-[#151821]">
            <TabsTrigger value="configs">
              Widget Configs ({data.configs.data.length})
            </TabsTrigger>
            <TabsTrigger value="pools">
              Pool ของฉัน ({data.pools.data.length}/{data.pools.limit})
            </TabsTrigger>
          </TabsList>
          <TabsContent value="configs" className="space-y-5 pt-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-muted-foreground">
                แต่ละ Config ที่เปิดใช้ = 1 Widget Point · สร้างได้แม้ Point หมด
              </p>
              <Button asChild>
                <Link href={`${base}/configs/new`}>
                  <Plus className="size-4" />
                  สร้าง Config
                </Link>
              </Button>
            </div>
            {!data.configs.data.length && (
              <Card>
                <CardContent className="py-16 text-center">
                  <Layers className="mx-auto mb-4 size-10 text-muted-foreground" />
                  <h2 className="mb-2 text-xl font-semibold">
                    เริ่มสุ่มจาก Pool ของคุณ
                  </h2>
                  <p className="mb-5 text-sm text-muted-foreground">
                    สร้าง Pool แล้วผูก Reward ที่มีอยู่กับ Config เพื่อรับ
                    Overlay URL
                  </p>
                  <Button asChild>
                    <Link href={`${base}/configs/new`}>สร้าง Config แรก</Link>
                  </Button>
                </CardContent>
              </Card>
            )}
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {data.configs.data.map((config) => (
                <Card key={config.id}>
                  <CardHeader>
                    <CardTitle>{config.name}</CardTitle>
                    <CardDescription>
                      {config.pool.name} · {config.mode} /{" "}
                      {config.visualization}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p
                      className={
                        config.pool_state === "READY"
                          ? "text-sm text-muted-foreground"
                          : "text-sm text-amber-500"
                      }
                    >
                      {states[config.pool_state]}
                    </p>
                    <p className="truncate text-sm">
                      Reward:{" "}
                      {controller.rewards.find(
                        (reward) => reward.id === config.twitch_reward_id,
                      )?.title || config.twitch_reward_id}
                    </p>
                    <div className="flex items-center justify-between">
                      <Label htmlFor={`enabled-${config.id}`}>
                        {config.widget.enabled
                          ? "เปิดใช้งาน · 1 Point"
                          : "ปิดใช้งาน"}
                      </Label>
                      <Switch
                        className="data-[state=checked]:bg-emerald-500"
                        id={`enabled-${config.id}`}
                        checked={config.widget.enabled}
                        disabled={busy}
                        onCheckedChange={() => void controller.toggle(config)}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button asChild variant="outline">
                        <Link href={`${base}/configs/${config.id}`}>
                          <Pencil className="size-4" />
                          แก้ไข
                        </Link>
                      </Button>
                      <ConfirmDelete
                        disabled={busy}
                        description={`ลบ Config “${config.name}”? Pool จะยังอยู่`}
                        onConfirm={() => void controller.deleteConfig(config)}
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="pools" className="pt-4">
            <PoolList
              pools={data.pools.data}
              limit={data.pools.limit}
              busy={busy}
              onDelete={(target) => void controller.deletePool(target)}
            />
          </TabsContent>
        </Tabs>
      ) : view === "pool" ? (
        <div className="space-y-6">
          <Link
            href={`${base}?tab=pools`}
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#cbd2df] hover:text-white"
          >
            <ArrowLeft className="size-4" /> Pool ทั้งหมด
          </Link>
          <div>
            <p className="mb-2 text-sm font-semibold tracking-[0.18em] text-[#a6afc2]">
              RANDOM POOL
            </p>
            <h1 className="text-3xl font-bold text-white sm:text-4xl">
              {poolId ? "แก้ไข Pool" : "สร้าง Pool ใหม่"}
            </h1>
            <p className="mt-3 text-sm leading-7 text-[#a0a9bb]">
              {poolId
                ? "แก้ชื่อ รูปปก และ Item ของ Pool นี้ การเปลี่ยนแปลงมีผลกับทุก Config ที่ใช้ Pool นี้"
                : "ตั้งชื่อ ใส่รูปปก แล้วเพิ่ม Item ได้เลย บันทึกแล้วนำไปเลือกใน Config ได้ทันที"}
            </p>
          </div>
          <PoolEditor
            value={pool}
            onChange={setPool}
            disabled={busy}
            upload={controller.upload}
            actions={
              <>
                <div className="space-y-3 border-t border-white/10 pt-5">
                  {!poolId && (
                    <p className="text-sm text-[#a0a9bb]">
                      หลังสร้างจะใช้ไป {data.pools.data.length + 1} /{" "}
                      {data.pools.limit} Pool · ไม่เสีย Widget Point
                    </p>
                  )}
                  <div className="flex gap-2">
                    <Button
                      asChild
                      variant="outline"
                      className="border-white/15 bg-[#242b38] text-white hover:bg-[#30394a] hover:text-white"
                    >
                      <Link href={`${base}?tab=pools`}>ยกเลิก</Link>
                    </Button>
                    <Button
                      disabled={
                        busy ||
                        !pool.name.trim() ||
                        (!poolId && data.pools.data.length >= data.pools.limit)
                      }
                      className="flex-1 bg-[#e9a33e] text-[#10131a] hover:bg-[#f4b659]"
                      onClick={() => void controller.savePool()}
                    >
                      {busy
                        ? "กำลังบันทึก…"
                        : poolId
                          ? "บันทึกการเปลี่ยนแปลง"
                          : "สร้าง Pool"}
                    </Button>
                  </div>
                </div>
                {poolId &&
                  data.pools.data.find(
                    (candidate) => candidate.id === poolId,
                  ) && (
                    <div className="space-y-2 rounded-xl border border-red-500/25 bg-red-500/5 p-4">
                      <h2 className="text-base font-semibold text-red-200">
                        ลบ Pool นี้
                      </h2>
                      <p className="text-sm text-[#a0a9bb]">
                        Pool นี้ใช้อยู่ใน{" "}
                        {data.pools.data.find(
                          (candidate) => candidate.id === poolId,
                        )?._count.configs || 0}{" "}
                        Config การลบจะส่งผลต่อ Config เหล่านี้
                      </p>
                      <ConfirmDelete
                        disabled={busy}
                        description={poolDeleteDescription(
                          data.pools.data.find(
                            (candidate) => candidate.id === poolId,
                          )!,
                        )}
                        onConfirm={() =>
                          void controller.deletePool(
                            data.pools.data.find(
                              (candidate) => candidate.id === poolId,
                            )!,
                          )
                        }
                      />
                    </div>
                  )}
              </>
            }
          />
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <Card>
            <CardHeader>
              <CardTitle>
                {configId ? "แก้ไข Config" : "สร้าง Config"}
              </CardTitle>
              <CardDescription>
                ผูก 1 Reward กับ 1 Pool และเลือกวิธีแสดงผล
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {savedConfig && savedConfig.pool_state !== "READY" && (
                <Alert variant="destructive">
                  <AlertDescription>
                    {states[savedConfig.pool_state]}
                  </AlertDescription>
                </Alert>
              )}
              <div className="space-y-2">
                <Label htmlFor="config-name">ชื่อ Config</Label>
                <Input
                  id="config-name"
                  value={config.name}
                  maxLength={100}
                  onChange={(event) =>
                    setConfig({ ...config, name: event.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Reward ที่มีอยู่ในช่อง Twitch</Label>
                <Select
                  value={config.twitch_reward_id}
                  onValueChange={(value) =>
                    setConfig({ ...config, twitch_reward_id: value })
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="เลือก Reward" />
                  </SelectTrigger>
                  <SelectContent>
                    {controller.rewards.map((reward) => (
                      <SelectItem
                        key={reward.id}
                        value={reward.id}
                        disabled={data.configs.data.some(
                          (other) =>
                            other.id !== configId &&
                            other.twitch_reward_id === reward.id,
                        )}
                      >
                        {reward.title} · {reward.cost} Points
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {!controller.rewards.length && (
                  <p className="text-sm text-muted-foreground">
                    ยังไม่มี Reward ให้เลือก กรุณาสร้าง Custom Reward ใน Twitch
                    ก่อน
                  </p>
                )}
              </div>
              <div className="space-y-3">
                <Label>Pool ของฉัน</Label>
                <Select
                  value={config.pool_id}
                  onValueChange={controller.selectPool}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="เลือก Pool" />
                  </SelectTrigger>
                  <SelectContent>
                    {data.pools.data.map((pool) => (
                      <SelectItem key={pool.id} value={pool.id}>
                        {pool.name} ({pool.items.length} Item)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    disabled={
                      busy || data.pools.data.length >= data.pools.limit
                    }
                    onClick={() =>
                      controller.setPoolDialog({ draft: emptyPool() })
                    }
                  >
                    <Plus className="size-4" />
                    สร้าง Pool ใหม่
                  </Button>
                  <Button variant="outline" disabled>
                    Import · Coming soon
                  </Button>
                </div>
                {data.pools.data.length >= data.pools.limit && (
                  <p className="text-sm text-amber-500">
                    ถึง Limit {data.pools.limit} Pool แล้ว
                  </p>
                )}
                {selectedPool && (
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant="outline"
                      onClick={() =>
                        controller.setPoolDialog({
                          id: selectedPool.id,
                          draft: { ...selectedPool },
                        })
                      }
                    >
                      <Pencil className="size-4" />
                      แก้ไข Pool / Item ({selectedPool.items.length})
                    </Button>
                    <ConfirmDelete
                      disabled={busy}
                      description={poolDeleteDescription(selectedPool)}
                      onConfirm={() => void controller.deletePool(selectedPool)}
                    />
                  </div>
                )}
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>วิธีสุ่ม</Label>
                  <Select
                    value={config.mode}
                    onValueChange={controller.changeMode}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="UNIFORM">
                        Uniform · โอกาสเท่ากัน
                      </SelectItem>
                      <SelectItem value="WEIGHTED">
                        Weighted · ตามน้ำหนัก
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Animation</Label>
                  <Select
                    value={config.visualization}
                    onValueChange={(value) =>
                      setConfig({
                        ...config,
                        visualization: value as typeof config.visualization,
                      })
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {config.mode === "WEIGHTED" ? (
                        <SelectItem value="WHEEL">Spin Wheel</SelectItem>
                      ) : (
                        <>
                          <SelectItem value="SHUFFLE">Image Shuffle</SelectItem>
                          <SelectItem value="SLIDE">Slide (CSGO)</SelectItem>
                        </>
                      )}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="default-message">ข้อความแชท Default</Label>
                <Textarea
                  id="default-message"
                  maxLength={500}
                  value={config.default_chat_message || ""}
                  onChange={(event) =>
                    setConfig({
                      ...config,
                      default_chat_message: event.target.value,
                    })
                  }
                />
                <p className="text-sm text-muted-foreground">
                  {(config.default_chat_message || "").length}/500 · ใช้{" "}
                  {"{user}"} และ {"{item}"} · เว้นว่างเพื่อไม่ส่งแชท
                </p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <SoundInput
                  label="เสียงขณะสุ่ม"
                  value={config.spin_sound_key}
                  files={controller.files}
                  busy={busy}
                  upload={controller.upload}
                  onChange={(key) =>
                    setConfig({ ...config, spin_sound_key: key })
                  }
                />
                <SoundInput
                  label="เสียงผลลัพธ์ Default"
                  value={config.default_result_sound_key}
                  files={controller.files}
                  busy={busy}
                  upload={controller.upload}
                  onChange={(key) =>
                    setConfig({ ...config, default_result_sound_key: key })
                  }
                />
              </div>
              {selectedPool?.items.map((item, index) => {
                const setting = config.items.find(
                  (setting) => setting.item_id === item.id,
                );
                return (
                  <div
                    key={item.id}
                    className="space-y-3 rounded-xl border p-4"
                  >
                    <h3 className="font-semibold">
                      {item.name || `Item ${index + 1}`}
                    </h3>
                    {item.image_url && (
                      <Image
                        unoptimized
                        width={640}
                        height={320}
                        src={item.image_url}
                        alt={item.name || "Item"}
                        className="h-20 w-20 rounded object-contain"
                      />
                    )}
                    {config.mode === "WEIGHTED" && (
                      <div className="space-y-2">
                        <Label htmlFor={`weight-${item.id}`}>
                          น้ำหนัก (Item ใหม่ = 1)
                        </Label>
                        <Input
                          id={`weight-${item.id}`}
                          type="number"
                          min={0.001}
                          max={1000000}
                          step="any"
                          value={setting?.weight ?? 1}
                          onChange={(event) =>
                            controller.updateSetting(item.id!, {
                              weight: Number(event.target.value),
                            })
                          }
                        />
                      </div>
                    )}
                    <Label htmlFor={`message-${item.id}`}>
                      ข้อความเฉพาะ Item · ไม่ตั้งจะใช้ Default
                    </Label>
                    <Textarea
                      id={`message-${item.id}`}
                      value={setting?.chat_message || ""}
                      maxLength={500}
                      onChange={(event) =>
                        controller.updateSetting(item.id!, {
                          chat_message: event.target.value,
                        })
                      }
                    />
                    <SoundInput
                      label="เสียงผลลัพธ์เฉพาะ Item"
                      value={setting?.result_sound_key}
                      files={controller.files}
                      busy={busy}
                      upload={controller.upload}
                      onChange={(key) =>
                        controller.updateSetting(item.id!, {
                          result_sound_key: key,
                        })
                      }
                    />
                  </div>
                );
              })}
              <Button
                disabled={
                  busy ||
                  !config.name.trim() ||
                  !config.pool_id ||
                  !config.twitch_reward_id
                }
                onClick={() => void controller.saveConfig()}
              >
                {busy ? "กำลังบันทึก…" : "บันทึก Config"}
              </Button>
            </CardContent>
          </Card>
          <aside className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>OBS Overlay</CardTitle>
                <CardDescription>
                  บันทึก Config แล้วคัดลอก URL ไปใส่ Browser Source
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {savedConfig ? (
                  <>
                    <Input
                      readOnly
                      aria-label="Overlay URL"
                      value={
                        typeof window === "undefined"
                          ? overlayPath(savedConfig)
                          : `${window.location.origin}${overlayPath(savedConfig)}`
                      }
                    />
                    <Button
                      variant="outline"
                      onClick={() =>
                        void navigator.clipboard.writeText(
                          `${window.location.origin}${overlayPath(savedConfig)}`,
                        )
                      }
                    >
                      <Copy className="size-4" />
                      คัดลอก URL
                    </Button>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="config-enabled">
                        เปิดใช้งาน · 1 Point
                      </Label>
                      <Switch
                        className="data-[state=checked]:bg-emerald-500"
                        id="config-enabled"
                        checked={savedConfig.widget.enabled}
                        disabled={busy}
                        onCheckedChange={() =>
                          void controller.toggle(savedConfig)
                        }
                      />
                    </div>
                  </>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Config ใหม่จะเริ่มปิดใช้งาน คุณเปิดใช้ได้เมื่อมี Widget
                    Point เพียงพอ
                  </p>
                )}
                <p className="text-sm text-muted-foreground">
                  ขนาดแนะนำ 800 × 600 · พื้นหลังโปร่งใส
                </p>
              </CardContent>
            </Card>
          </aside>
        </div>
      )}
      <Dialog
        open={!!controller.poolDialog}
        onOpenChange={(open) => {
          if (!open && !busy) controller.setPoolDialog(null);
        }}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-4xl">
          <DialogHeader>
            <DialogTitle>
              {controller.poolDialog?.id
                ? "แก้ไข Pool ตัวจริง"
                : "สร้าง Pool ใหม่"}
            </DialogTitle>
          </DialogHeader>
          {controller.poolDialog && (
            <PoolEditor
              value={controller.poolDialog.draft}
              disabled={busy}
              upload={controller.upload}
              onChange={(draft) =>
                controller.setPoolDialog((previous) =>
                  previous ? { ...previous, draft } : null,
                )
              }
            />
          )}
          <DialogFooter>
            <Button
              disabled={busy}
              onClick={() => void controller.saveInlinePool()}
            >
              บันทึก Pool และเลือกใช้
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
