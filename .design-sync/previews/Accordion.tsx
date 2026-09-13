import * as React from "react";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "trailblazer-ui";

export const FAQ = () => (
  <div className="p-6">
    <Accordion type="single" collapsible defaultValue="obs" className="w-full max-w-md">
      <AccordionItem value="obs">
        <AccordionTrigger>วิธีตั้งค่าใน OBS</AccordionTrigger>
        <AccordionContent>ไปที่ Sources &gt; Add Source &gt; Browser แล้วนำ Overlay URL ไปใส่ในช่อง URL จากนั้นกด OK</AccordionContent>
      </AccordionItem>
      <AccordionItem value="audio">
        <AccordionTrigger>ทำไมเสียงไม่ออก?</AccordionTrigger>
        <AccordionContent>ติ๊ก &quot;Control audio via OBS&quot; แล้วตั้ง Audio Monitoring เป็น Monitor and Output</AccordionContent>
      </AccordionItem>
      <AccordionItem value="pro">
        <AccordionTrigger>ต้องใช้แพ็กเกจ Pro ไหม?</AccordionTrigger>
        <AccordionContent>วิดเจ็ตพื้นฐานใช้ได้ฟรี บางวิดเจ็ตต้องอัปเกรดเป็น Pro</AccordionContent>
      </AccordionItem>
    </Accordion>
  </div>
);

export const Multiple = () => (
  <div className="p-6">
    <Accordion type="multiple" defaultValue={["a", "b"]} className="w-full max-w-md">
      <AccordionItem value="a">
        <AccordionTrigger>Raid</AccordionTrigger>
        <AccordionContent>เล่นเสียงและแสดงชื่อช่องที่ raid เข้ามา</AccordionContent>
      </AccordionItem>
      <AccordionItem value="b">
        <AccordionTrigger>Sub</AccordionTrigger>
        <AccordionContent>ขอบคุณผู้สมัครสมาชิกใหม่ในแชท</AccordionContent>
      </AccordionItem>
      <AccordionItem value="c">
        <AccordionTrigger>Bits</AccordionTrigger>
        <AccordionContent>แสดงจำนวน bits บน overlay</AccordionContent>
      </AccordionItem>
    </Accordion>
  </div>
);
