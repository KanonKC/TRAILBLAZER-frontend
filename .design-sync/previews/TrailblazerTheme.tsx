import * as React from "react";
import { TrailblazerTheme, Card, CardHeader, CardTitle, CardDescription, CardContent, Button, Badge, BrandLogo } from "trailblazer-ui";

export const ThemedPage = () => (
  <TrailblazerTheme className="p-8 grid gap-6">
    <header className="flex items-center justify-between">
      <span className="text-2xl"><BrandLogo /></span>
      <Button variant="twitch" size="sm">Login with Twitch</Button>
    </header>
    <Card className="max-w-md">
      <CardHeader>
        <CardTitle>ยินดีต้อนรับ MrJeremy</CardTitle>
        <CardDescription>วิดเจ็ตของคุณพร้อมใช้งานแล้ว 3 จาก 5 รายการ</CardDescription>
      </CardHeader>
      <CardContent className="flex gap-2">
        <Badge>Pro</Badge>
        <Badge variant="secondary">Clip Shoutout</Badge>
        <Badge variant="outline">Song Request</Badge>
      </CardContent>
    </Card>
  </TrailblazerTheme>
);

export const TokenSwatches = () => (
  <TrailblazerTheme className="p-8">
    <div className="grid grid-cols-4 gap-3 max-w-lg text-xs">
      {[
        ["bg-background", "background"], ["bg-card", "card"], ["bg-popover", "popover"], ["bg-muted", "muted"],
        ["bg-primary", "primary"], ["bg-accent", "accent"], ["bg-secondary", "secondary"], ["bg-destructive", "destructive"],
      ].map(([cls, name]) => (
        <div key={name} className="grid gap-1">
          <div className={`${cls} h-12 rounded-md border`} />
          <span className="text-muted-foreground">{name}</span>
        </div>
      ))}
    </div>
    <p className="mt-6 font-kanit text-3xl font-bold">Kanit — หัวข้อ</p>
    <p className="font-sans text-base">Anuphan — ข้อความเนื้อหา body text</p>
  </TrailblazerTheme>
);
