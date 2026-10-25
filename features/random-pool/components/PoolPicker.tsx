"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
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
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RandomPoolController } from "../hooks/useRandomPool";
import { ALERT_TONE } from "../constants";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { PoolCreateForm } from "./PoolCreateForm";

/** Pool dropdown with create and delete, shared by Settings. */
export function PoolPicker({
  controller,
  manage = true,
}: {
  controller: RandomPoolController;
  /** Hide create and delete when the caller offers its own way to manage pools. */
  manage?: boolean;
}) {
  const { data, draft, selectedPool, busy } = controller;
  const [creating, setCreating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const pools = data.pools.data;
  const limit = data.pools.limit;
  const atLimit = pools.length >= limit;

  return (
    <div className="grid gap-2">
      <Select value={draft.pool_id} onValueChange={controller.selectPool}>
        <SelectTrigger className="w-full" aria-label="กองสุ่มที่ใช้สุ่ม">
          <SelectValue placeholder="เลือกกองสุ่ม" />
        </SelectTrigger>
        <SelectContent>
          {pools.map((pool) => (
            <SelectItem key={pool.id} value={pool.id}>
              {pool.name}
              <span className="text-muted-foreground">
                {" "}
                · {pool.items.length} รายการ
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-muted-foreground text-sm tabular-nums">
          สร้างแล้ว {pools.length} จาก {limit} กองสุ่ม
        </span>
        {manage && (
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={busy || atLimit}
              onClick={() => setCreating(true)}
            >
              <Plus />
              สร้างกองสุ่มใหม่
            </Button>
            {selectedPool && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                disabled={busy}
                onClick={() => setDeleting(true)}
              >
                <Trash2 />
                ลบกองสุ่ม
              </Button>
            )}
          </div>
        )}
      </div>

      {manage && atLimit && (
        <Alert className={ALERT_TONE.info.box}>
          <ALERT_TONE.info.Icon className={ALERT_TONE.info.text} />
          <AlertTitle className={ALERT_TONE.info.text}>
            สร้างกองสุ่มเพิ่มไม่ได้
          </AlertTitle>
          <AlertDescription className="text-foreground">
            สร้างได้สูงสุด {limit} กองสุ่ม ลบกองสุ่มที่ไม่ใช้
            หรืออัปเกรดเพื่อเพิ่มจำนวน
            <div className="mt-2 flex flex-wrap gap-2">
              <Button asChild size="sm" variant="outline">
                <Link href="/pricing">อัปเกรดเป็น Pro</Link>
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}

      <Dialog open={creating} onOpenChange={setCreating}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>สร้างกองสุ่มใหม่</DialogTitle>
            <DialogDescription>
              กองสุ่มคือกองของรางวัลที่ประกอบด้วยรูปและชื่อ
            </DialogDescription>
          </DialogHeader>
          <PoolCreateForm
            busy={busy}
            upload={controller.upload}
            submitLabel="สร้างกองสุ่มและใช้เลย"
            usageLabel={`สร้างแล้ว ${pools.length} จาก ${limit} กองสุ่ม`}
            onCancel={() => setCreating(false)}
            onCreate={controller.createPool}
          />
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleting} onOpenChange={setDeleting}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              ลบกองสุ่ม &quot;{selectedPool?.name}&quot; ใช่ไหม
            </AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="grid gap-3">
                <p>ลบแล้วกู้คืนไม่ได้</p>
                <Alert className={ALERT_TONE.danger.box}>
                  <ALERT_TONE.danger.Icon className={ALERT_TONE.danger.text} />
                  <AlertTitle className={ALERT_TONE.danger.text}>ผลกระทบ</AlertTitle>
                  <AlertDescription className="text-foreground">
                    รายการทั้ง {selectedPool?.items.length ?? 0}{" "}
                    รายการและรูปจะถูกลบถาวร
                  </AlertDescription>
                </Alert>
                <ul className="list-disc pl-5">
                  <li>
                    การตั้งค่าของคุณ {selectedPool?._count.configs ?? 0}{" "}
                    ตัวใช้กองสุ่มนี้อยู่ และจะถูกปิดใช้งาน
                  </li>
                </ul>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>ยกเลิก</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() =>
                selectedPool && void controller.deletePool(selectedPool)
              }
            >
              <Trash2 />
              ลบกองสุ่ม
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
