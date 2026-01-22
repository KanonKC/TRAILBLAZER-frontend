"use client";

import { useCallback, useState, useRef, DragEvent } from "react";
import {
    ReactFlow,
    MiniMap,
    Controls,
    Background,
    useNodesState,
    useEdgesState,
    addEdge,
    Connection,
    Node,
    Edge,
    BackgroundVariant,
    ReactFlowProvider,
    useReactFlow,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save, Zap, Bell, MessageSquare, Clock, Filter, Send } from "lucide-react";
import Link from "next/link";

// Import node components
import { NodeActionsContext, TriggerNode, ActionNode, ConditionNode } from "@/components/workflow/nodes";

// Custom node types configuration
const nodeTypes = {
    trigger: TriggerNode,
    action: ActionNode,
    condition: ConditionNode,
};

// Node palette items for drag & drop
const paletteItems = [
    { type: "trigger", label: "New Follower", icon: Zap, category: "Triggers" },
    { type: "trigger", label: "New Sub", icon: Bell, category: "Triggers" },
    { type: "trigger", label: "Chat Message", icon: MessageSquare, category: "Triggers" },
    { type: "action", label: "Send Message", icon: Send, category: "Actions" },
    { type: "action", label: "Wait", icon: Clock, category: "Actions" },
    { type: "condition", label: "Condition", icon: Filter, category: "Logic" },
];

// Initial nodes for demo
const initialNodes: Node[] = [
    {
        id: "1",
        type: "trigger",
        position: { x: 250, y: 50 },
        data: { label: "New Follower" },
    },
];

const initialEdges: Edge[] = [];

// Sidebar component with draggable nodes
function Sidebar() {
    const onDragStart = (event: DragEvent, nodeType: string, label: string) => {
        event.dataTransfer.setData("application/reactflow", JSON.stringify({ type: nodeType, label }));
        event.dataTransfer.effectAllowed = "move";
    };

    const categories = [...new Set(paletteItems.map((item) => item.category))];

    return (
        <div className="w-64 glass border-r border-purple-500/20 p-4 overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4 blaze-gradient-text">โหนด</h3>
            {categories.map((category) => (
                <div key={category} className="mb-4">
                    <h4 className="text-xs uppercase text-muted-foreground mb-2">{category}</h4>
                    <div className="space-y-2">
                        {paletteItems
                            .filter((item) => item.category === category)
                            .map((item, index) => (
                                <div
                                    key={index}
                                    className="flex items-center gap-2 p-2 rounded-lg glass border border-purple-500/20 cursor-grab hover:border-purple-500/40 transition-colors"
                                    draggable
                                    onDragStart={(e) => onDragStart(e, item.type, item.label)}
                                >
                                    <item.icon className="w-4 h-4 text-purple-400" />
                                    <span className="text-sm">{item.label}</span>
                                </div>
                            ))}
                    </div>
                </div>
            ))}
        </div>
    );
}

// Main flow component
function Flow() {
    const reactFlowWrapper = useRef<HTMLDivElement>(null);
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
    const { screenToFlowPosition } = useReactFlow();

    const deleteNode = useCallback((id: string) => {
        setNodes((nds) => nds.filter((node) => node.id !== id));
        setEdges((eds) => eds.filter((edge) => edge.source !== id && edge.target !== id));
    }, [setNodes, setEdges]);

    const updateNodeLabel = useCallback((id: string, label: string) => {
        setNodes((nds) =>
            nds.map((node) =>
                node.id === id ? { ...node, data: { ...node.data, label } } : node
            )
        );
    }, [setNodes]);

    const onConnect = useCallback(
        (params: Connection) => setEdges((eds) => addEdge({ ...params, animated: true, style: { stroke: "#a855f7" } }, eds)),
        [setEdges]
    );

    const onDragOver = useCallback((event: DragEvent) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = "move";
    }, []);

    const onDrop = useCallback(
        (event: DragEvent) => {
            event.preventDefault();

            const data = event.dataTransfer.getData("application/reactflow");
            if (!data) return;

            const { type, label } = JSON.parse(data);
            const position = screenToFlowPosition({
                x: event.clientX,
                y: event.clientY,
            });

            const newNode: Node = {
                id: `${Date.now()}`,
                type,
                position,
                data: { label },
            };

            setNodes((nds) => nds.concat(newNode));
        },
        [screenToFlowPosition, setNodes]
    );

    const handleSaveDraft = () => {
        const workflow = { nodes, edges };
        console.log("Workflow diagram:", workflow);
        localStorage.setItem("workflow-draft", JSON.stringify(workflow));
        alert("บันทึกแบบร่างเรียบร้อย!");
    };

    return (
        <NodeActionsContext.Provider value={{ deleteNode, updateNodeLabel }}>
            <div className="flex-1 h-full" ref={reactFlowWrapper}>
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}
                    onDrop={onDrop}
                    onDragOver={onDragOver}
                    nodeTypes={nodeTypes}
                    fitView
                    className="bg-background"
                >
                    <Controls className="!bg-background/80 !border-purple-500/20" />
                    <MiniMap
                        className="!bg-background/80 !border-purple-500/20"
                        nodeColor={(node) => {
                            switch (node.type) {
                                case "trigger": return "#9333ea";
                                case "action": return "#2563eb";
                                case "condition": return "#d97706";
                                default: return "#6b7280";
                            }
                        }}
                    />
                    <Background variant={BackgroundVariant.Dots} gap={20} size={1} color="#a855f7" className="opacity-30" />
                </ReactFlow>
            </div>
        </NodeActionsContext.Provider>
    );
}

// Main page component
function WorkflowBuilderContent() {
    const [workflowName, setWorkflowName] = useState("Workflow ใหม่");
    const { getNodes, getEdges } = useReactFlow();

    const handleSaveDraft = () => {
        const workflow = { nodes: getNodes(), edges: getEdges() };
        console.log("Workflow diagram:", workflow);
        localStorage.setItem("workflow-draft", JSON.stringify(workflow));
        alert("บันทึกแบบร่างเรียบร้อย!");
    };

    return (
        <main className="h-screen flex flex-col">
            {/* Header */}
            <header className="h-16 glass border-b border-purple-500/20 flex items-center justify-between px-4">
                <div className="flex items-center gap-4">
                    <Link href="/workflows">
                        <Button variant="outline" size="icon" className="glass border-purple-500/20">
                            <ArrowLeft className="w-4 h-4" />
                        </Button>
                    </Link>
                    <input
                        type="text"
                        value={workflowName}
                        onChange={(e) => setWorkflowName(e.target.value)}
                        className="text-xl font-semibold bg-transparent border-none outline-none focus:ring-0"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" className="glass border-purple-500/20" onClick={handleSaveDraft}>
                        <Save className="w-4 h-4 mr-2" />
                        บันทึกแบบร่าง
                    </Button>
                    <Button className="blaze-gradient text-white font-semibold">
                        เผยแพร่
                    </Button>
                </div>
            </header>

            {/* Main content */}
            <div className="flex-1 flex overflow-hidden">
                <Sidebar />
                <Flow />
            </div>
        </main>
    );
}

// Export wrapper with provider
export default function WorkflowBuilderPage() {
    return (
        <ReactFlowProvider>
            <WorkflowBuilderContent />
        </ReactFlowProvider>
    );
}
