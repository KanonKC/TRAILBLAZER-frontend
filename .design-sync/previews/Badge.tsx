import * as React from "react";
import { Badge } from "trailblazer-ui";
import { Check, Star } from "lucide-react";

export const Variants = () => (
  <div className="flex flex-wrap items-center gap-2 p-6">
    <Badge>Pro</Badge>
    <Badge variant="secondary">Free</Badge>
    <Badge variant="outline">Beta</Badge>
    <Badge variant="destructive">หมดอายุ</Badge>
    <Badge variant="ghost">Draft</Badge>
    <Badge variant="link">ดูรายละเอียด</Badge>
  </div>
);

export const WithIcon = () => (
  <div className="flex flex-wrap items-center gap-2 p-6">
    <Badge><Check /> เปิดใช้งาน</Badge>
    <Badge variant="secondary"><Star /> ยอดนิยม</Badge>
    <Badge variant="outline">12 คลิป</Badge>
  </div>
);
