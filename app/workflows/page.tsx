"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Zap, Play, Pause, Trash2, Settings, ArrowLeft } from "lucide-react";
import Link from "next/link";

// Mock data for workflows
const mockWorkflows = [
    {
        id: "1",
        name: "ยินดีต้อนรับผู้ติดตามใหม่",
        description: "ส่งข้อความต้อนรับเมื่อมีผู้ติดตามใหม่",
        trigger: "New Follower",
        status: "active",
        lastRun: "5 นาทีที่แล้ว",
    },
    {
        id: "2",
        name: "แจ้งเตือน Subscription",
        description: "แจ้งเตือนใน Discord เมื่อมี Sub ใหม่",
        trigger: "New Subscription",
        status: "active",
        lastRun: "1 ชั่วโมงที่แล้ว",
    },
    {
        id: "3",
        name: "บันทึก Raid",
        description: "บันทึกข้อมูล Raid ลงในสเปรดชีต",
        trigger: "Raid",
        status: "paused",
        lastRun: "3 วันที่แล้ว",
    },
    {
        id: "4",
        name: "ตอบกลับ Chat อัตโนมัติ",
        description: "ตอบกลับคำสั่งพิเศษใน Chat",
        trigger: "Chat Command",
        status: "active",
        lastRun: "เมื่อสักครู่",
    },
];

export default function WorkflowsPage() {
    const [workflows, setWorkflows] = useState(mockWorkflows);

    const toggleWorkflowStatus = (id: string) => {
        setWorkflows(workflows.map(wf =>
            wf.id === id
                ? { ...wf, status: wf.status === "active" ? "paused" : "active" }
                : wf
        ));
    };

    const deleteWorkflow = (id: string) => {
        setWorkflows(workflows.filter(wf => wf.id !== id));
    };

    return (
        <main className="min-h-screen p-8">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <Link href="/">
                        <Button variant="outline" size="icon" className="glass border-primary/20">
                            <ArrowLeft className="w-4 h-4" />
                        </Button>
                    </Link>
                    <div className="flex-1">
                        <h1 className="text-3xl font-bold">
                            <span className="trailblazer-gradient-text">Workflows</span>
                        </h1>
                        <p className="text-muted-foreground mt-1">
                            จัดการ Workflow อัตโนมัติของคุณ
                        </p>
                    </div>
                    <Link href="/workflows/new">
                        <Button className="trailblazer-gradient text-white font-semibold gap-2">
                            <Plus className="w-4 h-4" />
                            สร้าง Workflow
                        </Button>
                    </Link>
                </div>

                {/* Workflow List */}
                {workflows.length === 0 ? (
                    <Card className="glass border-primary/10">
                        <CardContent className="flex flex-col items-center justify-center py-16">
                            <div className="p-4 rounded-2xl trailblazer-gradient mb-4">
                                <Zap className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">ยังไม่มี Workflow</h3>
                            <p className="text-muted-foreground mb-6 text-center max-w-md">
                                เริ่มสร้าง Workflow แรกของคุณเพื่อทำให้การสตรีมเป็นอัตโนมัติ
                            </p>
                            <Link href="/workflows/new">
                                <Button className="trailblazer-gradient text-white font-semibold gap-2">
                                    <Plus className="w-4 h-4" />
                                    สร้าง Workflow แรก
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid gap-4">
                        {workflows.map((workflow) => (
                            <Card
                                key={workflow.id}
                                className="glass border-primary/10 hover:border-primary/30 transition-all duration-300"
                            >
                                <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                                    <div className="space-y-1">
                                        <CardTitle className="text-lg flex items-center gap-3">
                                            {workflow.name}
                                            <Badge
                                                variant={workflow.status === "active" ? "default" : "secondary"}
                                                className={workflow.status === "active"
                                                    ? "trailblazer-gradient text-white border-0"
                                                    : ""
                                                }
                                            >
                                                {workflow.status === "active" ? "ใช้งานอยู่" : "หยุดชั่วคราว"}
                                            </Badge>
                                        </CardTitle>
                                        <CardDescription>{workflow.description}</CardDescription>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            className="glass border-primary/20 hover:bg-primary/10"
                                            onClick={() => toggleWorkflowStatus(workflow.id)}
                                        >
                                            {workflow.status === "active" ? (
                                                <Pause className="w-4 h-4" />
                                            ) : (
                                                <Play className="w-4 h-4" />
                                            )}
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            className="glass border-primary/20 hover:bg-primary/10"
                                        >
                                            <Settings className="w-4 h-4" />
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            className="glass border-red-500/20 hover:bg-red-500/10 hover:text-red-400"
                                            onClick={() => deleteWorkflow(workflow.id)}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center gap-6 text-sm text-muted-foreground">
                                        <div className="flex items-center gap-2">
                                            <Zap className="w-4 h-4 text-primary" />
                                            <span>Trigger: {workflow.trigger}</span>
                                        </div>
                                        <div>
                                            รันล่าสุด: {workflow.lastRun}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}
