"use client"

import * as React from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Twitch } from "@/components/icons/twitch"
import { acceptConsent, redirectToTwitchLogin, CONSENT_VERSION } from "@/lib/twitch-login"

const THAI_MONTHS = [
  "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
  "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม",
]

function formatConsentVersionDate(version: string) {
  const date = new Date(`${version}T00:00:00Z`)
  return `${date.getUTCDate()} ${THAI_MONTHS[date.getUTCMonth()]} ${date.getUTCFullYear()}`
}

const CONSENT_UPDATED_AT = formatConsentVersionDate(CONSENT_VERSION)

const DETAILS = [
  "เชื่อมต่อบัญชี Twitch ของคุณเพื่อใช้งานฟีเจอร์ทั้งหมดของ TRAILBLAZER",
  "อ่านและส่งข้อความในแชท เพื่อรองรับฟีเจอร์บอทอัตโนมัติ เช่น Greeting Message",
  "จัดการการแลกแต้มช่อง (Channel Points Redemptions) สำหรับวิดเจ็ตต่าง ๆ",
  "อ่านข้อมูลการติดตามและการสมัครสมาชิกของช่อง เพื่อใช้งานฟีเจอร์ที่เกี่ยวข้อง",
]

export default function ConsentPage() {
  const router = useRouter()
  const [accepted, setAccepted] = React.useState(false)

  const handleConfirm = () => {
    if (!accepted) return
    acceptConsent()
    redirectToTwitchLogin()
  }

  return (
    <section className="flex items-center justify-center p-4 py-12 sm:py-16">
      <div className="w-full max-w-lg animate-in fade-in zoom-in duration-500">
        <Card className="border-primary/20 shadow-2xl">
          <CardHeader className="space-y-6">
            <div className="flex items-center justify-center gap-4">
              <div className="flex size-16 items-center justify-center rounded-full border-2 border-primary shadow-lg overflow-hidden">
                <Image src="/logo.png" alt="TRAILBLAZER" width={40} height={40} className="object-contain" />
              </div>
              <div className="flex items-center gap-1 text-muted-foreground">
                <span className="size-1.5 rounded-full bg-current" />
                <span className="size-1.5 rounded-full bg-current" />
                <span className="size-1.5 rounded-full bg-current" />
              </div>
              <div className="flex size-16 items-center justify-center rounded-full bg-[#6441a5] shadow-lg">
                <Twitch className="size-8 text-white" />
              </div>
            </div>

            <div className="space-y-2 text-center">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
                TRAILBLAZER ต้องการเชื่อมต่อกับบัญชี Twitch ของคุณ
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground">
                กรุณาอ่านและยอมรับรายละเอียดด้านล่าง ก่อนเข้าสู่ระบบด้วย Twitch
              </p>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="rounded-xl bg-muted/50 border p-4 space-y-3">
              <h2 className="text-sm font-semibold text-foreground">
                เมื่อเชื่อมต่อบัญชีแล้ว TRAILBLAZER จะสามารถ
              </h2>
              <ul className="space-y-2">
                {DETAILS.map((detail) => (
                  <li key={detail} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" />
                    <span>{detail}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex items-center gap-3 rounded-xl border p-4">
              <Checkbox
                id="consent-privacy-policy"
                checked={accepted}
                onCheckedChange={(checked) => setAccepted(checked === true)}
              />
              <Label htmlFor="consent-privacy-policy" className="font-normal text-foreground cursor-pointer">
                ฉันได้อ่านและยอมรับ{" "}
                <a
                  href="/privacy-policy"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="underline text-primary hover:opacity-80"
                >
                  นโยบายความเป็นส่วนตัว
                </a>{" "}
                ของ TRAILBLAZER
              </Label>
            </div>

            <p className="text-xs text-center text-muted-foreground">
              นโยบายความเป็นส่วนตัวอัปเดตล่าสุดเมื่อ {CONSENT_UPDATED_AT}
            </p>

            <div className="flex flex-col-reverse sm:flex-row gap-2 sm:justify-end">
              <Button variant="outline" onClick={() => router.back()}>
                ย้อนกลับ
              </Button>
              <Button
                disabled={!accepted}
                onClick={handleConfirm}
                className="trailblazer-gradient text-white font-semibold hover:opacity-90 disabled:opacity-50"
              >
                ยืนยันและดำเนินการต่อ
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
