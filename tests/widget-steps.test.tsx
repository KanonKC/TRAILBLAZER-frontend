import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import WidgetStepperItems from "@/components/widget/WidgetStepper/WidgetStepperItems/WidgetStepperItems";
import { WidgetEnableStepContent, WidgetSettingsStepContent } from "@/components/widget/WidgetSetupStepContent";

describe("widget quick start steps", () => {
    it("renders steps in order with their descriptions", () => {
        render(<WidgetStepperItems items={[
            { step: 1, title: "เปิดใช้งานวิดเจ็ต", description: <span>ขั้นตอนเปิดใช้งาน</span> },
            { step: 2, title: "นำโอเวอร์เลย์ไปใส่ใน OBS", description: <span>ขั้นตอน OBS</span> },
            { step: 3, title: "บันทึกและทดสอบ", description: <span>ขั้นตอนทดสอบ</span> },
        ]} />);
        expect(screen.getAllByRole("heading").map((heading) => heading.textContent)).toEqual([
            "เปิดใช้งานวิดเจ็ต", "นำโอเวอร์เลย์ไปใส่ใน OBS", "บันทึกและทดสอบ",
        ]);
        expect(screen.getByText("ขั้นตอน OBS")).toBeInTheDocument();
        expect(screen.getByText("ขั้นตอนทดสอบ")).toBeInTheDocument();
    });

    it("shows shared enable content and opens settings from the shared step", () => {
        const onOpenSettings = vi.fn();
        render(<><WidgetEnableStepContent description="เปิดฟีเจอร์" /><WidgetSettingsStepContent description="ปรับค่าเพิ่มเติม" onOpenSettings={onOpenSettings} /></>);
        expect(screen.getByText("เปิดฟีเจอร์")).toBeInTheDocument();
        expect(screen.getByText("เปิดใช้งานแล้ว")).toBeInTheDocument();
        fireEvent.click(screen.getByRole("button", { name: /ไปที่.*ตั้งค่า/ }));
        expect(onOpenSettings).toHaveBeenCalledOnce();
    });
});
