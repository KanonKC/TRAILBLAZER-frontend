import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X, Copy, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useReactFlow, Node, getIncomers } from "@xyflow/react";

interface NodeConfigurationModalProps {
    isOpen: boolean;
    onClose: () => void;
    nodeId: string;
    nodeType: string;
    nodeLabel: string;
    nodeData: any;
    updateNodeData: (id: string, data: any) => void;
}

export function NodeConfigurationModal({
    isOpen,
    onClose,
    nodeId,
    nodeType,
    nodeLabel,
    nodeData,
    updateNodeData,
}: NodeConfigurationModalProps) {
    const [animateIn, setAnimateIn] = useState(false);
    const { getNodes, getEdges } = useReactFlow();
    const [upstreamNodes, setUpstreamNodes] = useState<Node[]>([]);
    const [selectedSourceNodeId, setSelectedSourceNodeId] = useState<string>("");

    // Config state - use key to reset when modal opens for a different node
    const [message, setMessage] = useState("");
    const [syncKey, setSyncKey] = useState("");

    // Sync message state when modal opens - create unique key from nodeId + open state
    useEffect(() => {
        const newKey = isOpen ? `${nodeId}-open` : "";
        if (newKey && newKey !== syncKey) {
            // Modal just opened for this node - sync the message from props
            setMessage((nodeData?.message as string) ?? "");
            setSyncKey(newKey);
        } else if (!isOpen) {
            setSyncKey("");
        }
    }, [isOpen, nodeId, nodeData?.message, syncKey]);

    useEffect(() => {
        if (isOpen) {
            const timer = setTimeout(() => setAnimateIn(true), 10);
            document.body.style.overflow = "hidden";

            // Find upstream nodes logic
            const allNodes = getNodes();
            const allEdges = getEdges();
            const currentNode = allNodes.find(n => n.id === nodeId);

            if (currentNode) {
                // Simple recursive upstream finder
                const getAncestors = (node: Node, visited = new Set<string>()): Node[] => {
                    if (visited.has(node.id)) return [];
                    visited.add(node.id);

                    const incomers = getIncomers(node, allNodes, allEdges);
                    let ancestors: Node[] = [...incomers];

                    for (const incomer of incomers) {
                        ancestors = [...ancestors, ...getAncestors(incomer, visited)];
                    }
                    return ancestors;
                };

                // Filter duplicates
                const ancestors = getAncestors(currentNode);
                const uniqueAncestors = Array.from(new Map(ancestors.map(n => [n.id, n])).values());

                setUpstreamNodes(uniqueAncestors);
                if (uniqueAncestors.length > 0 && !selectedSourceNodeId) {
                    setSelectedSourceNodeId(uniqueAncestors[0].id);
                }
            }

            return () => clearTimeout(timer);
        } else {
            const timer = setTimeout(() => setAnimateIn(false), 10);
            document.body.style.overflow = "unset";
            return () => clearTimeout(timer);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen, nodeId, getNodes, getEdges]); // Don't include nodeData to avoid re-sync loop

    if (!isOpen && !animateIn) return null;

    // Helper to get variables for a node - label is now the human-readable name (displayName was renamed to label)
    const getVariablesForNode = (node: Node) => {
        const nodeLabel = node.data.label as string;
        if (nodeLabel === "New Follower") {
            return {
                broadcaster_id: "Example ID",
                login: "username",
                display_name: "Display Name",
                user_id: "12345",
                created_at: "2023-01-01"
            };
        }
        return {};
    };

    const sourceNode = upstreamNodes.find(n => n.id === selectedSourceNodeId);
    const sourceVariables = sourceNode ? getVariablesForNode(sourceNode) : {};

    const handleDragStart = (e: React.DragEvent, variableName: string, nodeSlug: string) => {
        const fullVariable = `${nodeSlug}.${variableName}`;
        e.dataTransfer.setData("application/trailblazer-variable", fullVariable);
        e.dataTransfer.setData("text/plain", `{{ $${fullVariable} }}`); // Fallback
        e.dataTransfer.effectAllowed = "copy";
    };

    // Ensure we are on client side
    if (typeof document === "undefined") return null;

    const isTrigger = nodeType.startsWith("trigger");

    // Mock Data for "New Follower" 
    const isNewFollower = nodeLabel === "New Follower";
    const twitchMockData = {
        broadcaster_id: "12345678",
        login: "blaze_user",
        display_name: "TrailBlazerUser",
        user_id: "87654321",
        user_login: "new_follower",
        user_name: "NewFollower123",
        followed_at: "2023-10-27T10:00:00Z"
    };

    return createPortal(
        <div className={`fixed inset-0 z-50 flex items-center justify-center ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"} transition-opacity duration-200`}>
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

            {/* Modal Content */}
            <div className={`relative w-[90vw] max-w-6xl h-[80vh] glass border border-purple-500/30 rounded-xl overflow-hidden shadow-2xl flex flex-col transform ${isOpen ? "scale-100" : "scale-95"} transition-transform duration-200`}>

                {/* Header */}
                <div className="h-16 border-b border-purple-500/20 flex items-center justify-between px-6 bg-black/20">
                    <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isTrigger ? "bg-purple-600" : "bg-blue-600"}`}>
                            {/* Icon placeholder (can be passed as prop but keeping simple) */}
                            <span className="font-bold text-white text-lg">{nodeLabel.charAt(0)}</span>
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-white">{nodeLabel}</h2>
                            <p className="text-xs text-muted-foreground uppercase tracking-wider">{nodeType}</p>
                        </div>
                    </div>
                    <Button variant="ghost" size="icon" onClick={onClose} className="hover:bg-white/10">
                        <X className="w-5 h-5" />
                    </Button>
                </div>

                {/* 3-Column Layout */}
                <div className="flex-1 grid grid-cols-12 min-h-0 divide-x divide-purple-500/20">

                    {/* Left Column: Input Data (Previous Step) */}
                    <div className="col-span-3 bg-black/10 flex flex-col min-h-0">
                        <div className="p-4 border-b border-purple-500/10">
                            <h3 className="font-medium text-sm text-purple-200">ข้อมูลขาเข้า</h3>
                            <p className="text-xs text-muted-foreground mt-1">ข้อมูลจากโหนดก่อนหน้า</p>
                        </div>
                        <div className="flex-1 p-4 overflow-y-auto">
                            {isTrigger ? (
                                <div className="text-sm text-muted-foreground italic text-center mt-10">
                                    ไม่มีข้อมูลขาเข้า (Trigger Node)
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label className="text-xs text-muted-foreground uppercase tracking-wider">เลือกโหนดต้นทาง</Label>
                                        <Select
                                            value={selectedSourceNodeId}
                                            onValueChange={setSelectedSourceNodeId}
                                            disabled={upstreamNodes.length === 0}
                                        >
                                            <SelectTrigger className="bg-black/20 border-white/10 h-8 text-xs">
                                                <SelectValue placeholder={upstreamNodes.length === 0 ? "No upstream nodes" : "Select node..."} />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {upstreamNodes.map(node => (
                                                    <SelectItem key={node.id} value={node.id}>
                                                        {node.data.label as string} <span className="text-muted-foreground text-xs opacity-50 ml-1 font-mono">{(node as any).slug}</span>
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-xs text-muted-foreground uppercase tracking-wider">ตัวแปรที่ใช้ได้</Label>
                                        {sourceNode ? (
                                            <div className="space-y-1">
                                                {Object.keys(sourceVariables).map((key) => (
                                                    <div
                                                        key={key}
                                                        draggable
                                                        onDragStart={(e) => handleDragStart(e, key, (sourceNode as any).slug as string)}
                                                        className="group flex items-center justify-between p-2 rounded bg-white/5 hover:bg-white/10 border border-transparent hover:border-blue-500/30 cursor-grab active:cursor-grabbing transition-all text-xs"
                                                    >
                                                        <div className="flex items-center gap-2 overflow-hidden">
                                                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500/50 group-hover:bg-blue-400"></div>
                                                            <div className="text-gray-300 font-mono truncate">{key}</div>
                                                        </div>
                                                        <div className="opacity-0 group-hover:opacity-100 text-[9px] text-muted-foreground bg-black/40 px-1 py-0.5 rounded">
                                                            Drag
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="text-center py-4 text-xs text-muted-foreground border border-dashed border-white/10 rounded">
                                                Please select a source node
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Middle Column: Configuration */}
                    <div className="col-span-6 bg-black/5 flex flex-col min-h-0">
                        <div className="p-4 border-b border-purple-500/10">
                            <h3 className="font-medium text-sm text-purple-200">ตั้งค่า</h3>
                            <p className="text-xs text-muted-foreground mt-1">กำหนดค่าสำหรับโหนดนี้</p>
                        </div>
                        <div className="flex-1 p-6 overflow-y-auto">
                            {nodeLabel === "Send Message" ? (
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label className="flex items-center justify-between">
                                            <span>Message Content</span>
                                            <span className="text-[10px] text-blue-400 font-normal">Supports Variables</span>
                                        </Label>
                                        <textarea
                                            value={message}
                                            onChange={(e) => {
                                                setMessage(e.target.value);
                                                updateNodeData(nodeId, { message: e.target.value });
                                            }}
                                            onDrop={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();

                                                let variableName = e.dataTransfer.getData("application/trailblazer-variable");
                                                console.log("Drop event received, variableName:", variableName);
                                                console.log("All data types:", e.dataTransfer.types);

                                                // Fallback if custom type fails
                                                if (!variableName) {
                                                    const textData = e.dataTransfer.getData("text/plain");
                                                    // Check if it matches our format {{ $var }}
                                                    const match = textData.match(/\{\{ \$(.+) \}\}/);
                                                    if (match) {
                                                        variableName = match[1];
                                                    }
                                                }

                                                if (variableName) {
                                                    const textArea = e.currentTarget;
                                                    const start = textArea.selectionStart;
                                                    const end = textArea.selectionEnd;
                                                    const text = textArea.value;
                                                    const newText = text.substring(0, start) + `{{ $${variableName} }}` + text.substring(end);

                                                    setMessage(newText);
                                                    updateNodeData(nodeId, { message: newText });

                                                    // Use timeout to ensure focus and cursor update works after render
                                                    setTimeout(() => {
                                                        textArea.focus();
                                                        textArea.selectionStart = textArea.selectionEnd = start + variableName.length + 5;
                                                    }, 0);
                                                }
                                            }}
                                            onDragEnter={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                            }}
                                            onDragOver={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                e.dataTransfer.dropEffect = "copy";
                                            }}
                                            className="w-full h-40 bg-black/20 border border-white/10 rounded-md p-3 text-sm text-white focus:outline-none focus:border-blue-500/50 resize-none font-mono leading-relaxed"
                                            placeholder="Type your message here... Drag variables from the left to insert."
                                        />
                                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                                            <Info className="w-3 h-3" />
                                            Drag variables from the input column to insert.
                                        </p>
                                    </div>
                                </div>
                            ) : isNewFollower ? (
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <Label>เลือกช่องทาง (Channel)</Label>
                                        <Select disabled defaultValue="blaze">
                                            <SelectTrigger className="glass border-purple-500/30">
                                                <SelectValue placeholder="เลือกช่องทาง" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="blaze">TrailBlazer Channel (Connected)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <p className="text-xs text-muted-foreground">ช่องทางที่เชื่อมต่อไว้ (ปัจจุบันรองรับเพียง 1 ช่องทาง)</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center text-muted-foreground mt-10">
                                    ยังไม่มีการตั้งค่าสำหรับโหนดนี้
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Column: Output / Result */}
                    <div className="col-span-3 bg-black/10 flex flex-col min-h-0">
                        <div className="p-4 border-b border-purple-500/10">
                            <h3 className="font-medium text-sm text-purple-200">ผลลัพธ์ตัวอย่าง</h3>
                            <p className="text-xs text-muted-foreground mt-1">ข้อมูลที่จะถูกส่งต่อไปยังโหนดถัดไป</p>
                        </div>
                        <div className="flex-1 p-4 overflow-y-auto">
                            {nodeLabel === "Send Message" ? (
                                <div className="text-sm text-muted-foreground italic text-center mt-10 opacity-50">
                                    Action Node - No Output
                                </div>
                            ) : isNewFollower ? (
                                <div className="space-y-2">
                                    {Object.entries(twitchMockData).map(([key, value]) => (
                                        <div key={key} className="group font-mono flex items-start justify-between p-2 rounded hover:bg-white/5 transition-colors text-xs border border-transparent hover:border-purple-500/20">
                                            <div className="overflow-hidden">
                                                <div className="text-purple-300 font-medium truncate" title={key}>{key}</div>
                                                <div className="text-muted-foreground truncate mt-0.5" title={value as string}>{value}</div>
                                            </div>
                                            <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity -mr-1">
                                                <Copy className="w-3 h-3" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-sm text-muted-foreground italic text-center mt-10">
                                    ไม่มีข้อมูลตัวอย่าง
                                </div>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </div>,
        document.body
    );
}
