"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
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
import {
  ImageIcon,
  Layers3,
  LockKeyhole,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
import { Pool } from "../types";

const base = "/dashboard/widgets/random-pool";

function PoolCover({ pool }: { pool: Pool }) {
  if (pool.cover_url)
    return (
      <Image
        unoptimized
        src={pool.cover_url}
        alt={pool.name}
        width={720}
        height={400}
        className="aspect-[16/9] w-full object-cover"
      />
    );
  const images = pool.items.filter((item) => item.image_url).slice(0, 4);
  return (
    <div className="grid aspect-[16/9] grid-cols-2 grid-rows-2 gap-0.5 bg-[#0b0f17]">
      {Array.from({ length: 4 }, (_, index) => {
        const item = images[index];
        return item?.image_url ? (
          <Image
            key={item.id || index}
            unoptimized
            src={item.image_url}
            alt={item.name || `Item ${index + 1}`}
            width={360}
            height={200}
            className="h-full w-full object-cover"
          />
        ) : (
          <div
            key={index}
            className="flex items-center justify-center bg-[#2b3444] text-[#68778e]"
          >
            <ImageIcon className="size-8" aria-hidden="true" />
          </div>
        );
      })}
    </div>
  );
}

export function PoolList({
  pools,
  limit,
  busy,
  onDelete,
}: {
  pools: Pool[];
  limit: number;
  busy: boolean;
  onDelete: (pool: Pool) => void;
}) {
  const atLimit = pools.length >= limit;
  const planName = limit > 3 ? "Pro" : "Free";
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-5">
        <div>
          <p className="mb-2 text-sm font-semibold tracking-[0.18em] text-[#a6afc2]">
            RANDOM POOL
          </p>
          <h1 className="text-3xl font-bold text-white sm:text-4xl">
            Pool ของฉัน
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-[#a0a9bb]">
            ชุดของที่ใช้สุ่มใน Widget Random Pool มีแค่รูปกับชื่อ
            สร้างครั้งเดียวใช้ได้หลาย Config และไม่เสีย Widget Point
          </p>
        </div>
        {atLimit ? (
          <Button disabled className="bg-[#e9a33e] text-[#10131a]">
            <Plus className="size-4" /> สร้าง Pool ใหม่
          </Button>
        ) : (
          <Button
            asChild
            className="bg-[#e9a33e] text-[#10131a] hover:bg-[#f4b659]"
          >
            <Link href={`${base}/pools/new`}>
              <Plus className="size-4" /> สร้าง Pool ใหม่
            </Link>
          </Button>
        )}
      </div>
      <div className="grid gap-5 rounded-2xl border border-white/10 bg-[#151821] p-5 sm:p-6 lg:grid-cols-[180px_minmax(150px,1fr)_minmax(240px,1.25fr)] lg:items-center">
        <div>
          <p className="text-sm text-[#a0a9bb]">Pool ที่ใช้ไปแล้ว</p>
          <p className="mt-1 text-3xl font-bold text-white">
            {pools.length} / {limit}
          </p>
        </div>
        <div
          className="flex gap-1.5"
          role="img"
          aria-label={`ใช้ไปแล้ว ${pools.length} จาก ${limit} Pool`}
        >
          {Array.from({ length: limit }, (_, index) => (
            <span
              key={index}
              className={`h-2.5 min-w-0 flex-1 rounded-full ${index < pools.length ? "bg-[#e8943a]" : "bg-[#263040]"}`}
            />
          ))}
        </div>
        <p className="text-sm leading-6 text-[#a0a9bb]">
          แพ็กเกจ {planName} สร้างได้ {limit} Pool นับเฉพาะ Pool
          ที่คุณเป็นเจ้าของ การสร้าง Pool ไม่เสีย Widget Point
        </p>
      </div>
      {atLimit && (
        <div className="rounded-xl border border-amber-500/35 bg-amber-500/10 p-4 text-sm text-amber-100">
          ถึงขีดจำกัดแล้ว คุณมีครบ {limit} Pool ตามแพ็กเกจ {planName} ลบ Pool
          ที่ไม่ได้ใช้ก่อนสร้างใหม่
        </div>
      )}
      {!pools.length ? (
        <div className="rounded-2xl border border-white/10 bg-[#151821] px-5 py-16 text-center">
          <Layers3 className="mx-auto size-11 text-[#e9a33e]" />
          <h2 className="mt-4 text-xl font-bold text-white">ยังไม่มี Pool</h2>
          <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-[#a0a9bb]">
            Pool คือชุดของที่จะสุ่ม เช่น รูปของรางวัลพร้อมชื่อ สร้างอันแรกได้เลย
            ใช้เวลาไม่นานและไม่เสีย Widget Point
          </p>
          <Button
            asChild
            className="mt-6 bg-[#e9a33e] text-[#10131a] hover:bg-[#f4b659]"
          >
            <Link href={`${base}/pools/new`}>
              <Plus className="size-4" /> สร้าง Pool แรกของคุณ
            </Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {pools.map((pool) => (
            <article
              key={pool.id}
              className="overflow-hidden rounded-2xl border border-white/10 bg-[#151821]"
            >
              <Link
                href={`${base}/pools/${pool.id}`}
                aria-label={`จัดการ Pool ${pool.name}`}
              >
                <PoolCover pool={pool} />
              </Link>
              <div className="space-y-3 p-5">
                <Link
                  href={`${base}/pools/${pool.id}`}
                  className="block truncate text-lg font-bold text-white hover:text-[#e9a33e]"
                >
                  {pool.name}
                </Link>
                <div className="flex flex-wrap items-center gap-3 text-sm text-[#c0c7d4]">
                  <span className="inline-flex items-center gap-1.5">
                    <Layers3 className="size-4" />
                    {pool.items.length} Item
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[#242b38] px-2.5 py-1">
                    <LockKeyhole className="size-4" />
                    Private
                  </span>
                </div>
                <p className="text-sm text-[#9ca5b8]">
                  {pool._count.configs
                    ? `ใช้อยู่ใน ${pool._count.configs} Config`
                    : "ยังไม่ได้ใช้ใน Config"}
                </p>
              </div>
              <div className="grid grid-cols-2 border-t border-white/10">
                <Button
                  asChild
                  variant="ghost"
                  className="rounded-none border-r border-white/10 text-white hover:bg-[#252b38] hover:text-white"
                >
                  <Link href={`${base}/pools/${pool.id}`}>
                    <Pencil className="size-4" />
                    จัดการ Item
                  </Link>
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="ghost"
                      disabled={busy}
                      className="rounded-none text-red-300 hover:bg-red-500/10 hover:text-red-200"
                    >
                      <Trash2 className="size-4" />
                      ลบ Pool
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        ลบ Pool “{pool.name}” ใช่ไหม
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        Item ทั้ง {pool.items.length} รายการจะถูกลบไปด้วย และ{" "}
                        {pool._count.configs} Config ที่ใช้ Pool นี้จะต้องเลือก
                        Pool ใหม่
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>ยกเลิก</AlertDialogCancel>
                      <AlertDialogAction onClick={() => onDelete(pool)}>
                        ลบ Pool
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </article>
          ))}
          {!atLimit && (
            <Link
              href={`${base}/pools/new`}
              className="flex min-h-72 flex-col items-center justify-center rounded-2xl border-2 border-dashed border-white/20 text-center text-white hover:border-[#e9a33e]/70 hover:bg-[#151821]"
            >
              <span className="mb-4 flex size-14 items-center justify-center rounded-full bg-[#242b38]">
                <Plus className="size-6" />
              </span>
              <strong className="text-lg">สร้าง Pool ใหม่</strong>
              <span className="mt-1 text-sm text-[#a0a9bb]">
                เหลืออีก {limit - pools.length} Pool
              </span>
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
