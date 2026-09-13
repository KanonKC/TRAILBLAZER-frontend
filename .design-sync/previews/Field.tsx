import * as React from "react";
import { FieldGroup, FieldSet, FieldLegend, Field, FieldLabel, FieldDescription, FieldError, FieldSeparator, FieldContent, Input, Textarea, Switch, Checkbox } from "trailblazer-ui";

export const SettingsForm = () => (
  <div className="p-6">
    <FieldGroup className="max-w-md">
      <FieldSet>
        <FieldLegend>การตั้งค่าคลิป</FieldLegend>
        <Field>
          <FieldLabel htmlFor="f-dur">ระยะเวลา (วินาที)</FieldLabel>
          <Input id="f-dur" type="number" defaultValue={30} />
          <FieldDescription>คลิปจะถูกตัดเมื่อครบเวลาที่กำหนด</FieldDescription>
        </Field>
        <Field>
          <FieldLabel htmlFor="f-msg">ข้อความในแชท</FieldLabel>
          <Textarea id="f-msg" defaultValue="ไปตามดู {streamer} ได้ที่ twitch.tv/{streamer}" rows={2} />
        </Field>
      </FieldSet>
      <FieldSeparator>ขั้นสูง</FieldSeparator>
      <Field orientation="horizontal">
        <FieldContent>
          <FieldLabel htmlFor="f-auto">เล่นอัตโนมัติ</FieldLabel>
          <FieldDescription>เล่นคลิปทันทีที่มีการ shoutout</FieldDescription>
        </FieldContent>
        <Switch id="f-auto" defaultChecked />
      </Field>
    </FieldGroup>
  </div>
);

export const ErrorState = () => (
  <div className="p-6">
    <FieldGroup className="max-w-md">
      <Field data-invalid>
        <FieldLabel htmlFor="f-vol">ระดับเสียง</FieldLabel>
        <Input id="f-vol" type="number" defaultValue={140} aria-invalid />
        <FieldError errors={[{ message: "ต้องอยู่ระหว่าง 0 ถึง 100" }]} />
      </Field>
      <Field data-invalid>
        <FieldLabel htmlFor="f-url">Webhook URL</FieldLabel>
        <Input id="f-url" defaultValue="not a url" aria-invalid />
        <FieldError errors={[{ message: "รูปแบบ URL ไม่ถูกต้อง" }, { message: "ต้องขึ้นต้นด้วย https://" }]} />
      </Field>
    </FieldGroup>
  </div>
);

export const DisabledAndChoice = () => (
  <div className="p-6">
    <FieldGroup className="max-w-md">
      <Field data-disabled="true">
        <FieldLabel htmlFor="f-dis">Overlay URL</FieldLabel>
        <Input id="f-dis" disabled value="https://trailblazer.app/overlays/clip-shoutout/…" readOnly />
        <FieldDescription>เปิดใช้งานวิดเจ็ตก่อนเพื่อรับ URL</FieldDescription>
      </Field>
      <FieldSet>
        <FieldLegend variant="label">แจ้งเตือน</FieldLegend>
        <Field orientation="horizontal">
          <Checkbox id="f-c1" defaultChecked />
          <FieldLabel htmlFor="f-c1">เมื่อมี raid</FieldLabel>
        </Field>
        <Field orientation="horizontal">
          <Checkbox id="f-c2" />
          <FieldLabel htmlFor="f-c2">เมื่อมี sub ใหม่</FieldLabel>
        </Field>
      </FieldSet>
    </FieldGroup>
  </div>
);
