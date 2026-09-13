import * as React from "react";
import { Toaster, toast, tbToast, Button } from "trailblazer-ui";

export const Toasts = () => {
  React.useEffect(() => {
    const t1 = setTimeout(() => tbToast.success({ title: "บันทึกการเปลี่ยนแปลงแล้ว", description: "การตั้งค่าใหม่มีผลทันที" }), 50);
    const t2 = setTimeout(() => toast.error("อัปโหลดไม่สำเร็จ", { description: "ไฟล์ใหญ่เกิน 10 MB" }), 100);
    const t3 = setTimeout(() => toast("มีการ raid เข้ามา", { description: "lilypichu พาผู้ชม 1,204 คนมาเยี่ยม" }), 150);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);
  return (
    <div className="p-6 min-h-80">
      <div className="flex gap-2">
        <Button onClick={() => tbToast.success({ title: "บันทึกการเปลี่ยนแปลงแล้ว" })}>บันทึก</Button>
        <Button variant="outline" onClick={() => toast.error("อัปโหลดไม่สำเร็จ")}>ทดสอบ error</Button>
      </div>
      <Toaster duration={60000} />
    </div>
  );
};
