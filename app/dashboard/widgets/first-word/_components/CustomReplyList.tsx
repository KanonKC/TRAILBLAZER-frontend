"use client"

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FirstWordVariableMap } from "@/constants/firstWord";
import {
    createCustomReply,
    deleteCustomReply,
    FirstWordCustomReply,
    listCustomReplies,
    updateCustomReply
} from "@/services/firstWord.service";
import { UploadedFile, uploadFile } from "@/services/uploadedFile.service";
import { AudioWaveform, Loader2, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { getTwitchUser } from "@/services/twitch.service";
import { ReplyMessageTextarea } from "../../../../../components/widget/ReplyMessageTextarea";
import { CompactAudioFileUploader } from "../../../../../components/widget/AudioFileUploader/CompactAudioFileUploader";
import { Avatar, AvatarFallback, AvatarImage } from "../../../../../components/ui/avatar";

export function CustomReplyList() {
    const [replies, setReplies] = useState<FirstWordCustomReply[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    // Dialog states
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    // Form states
    const [twitchChatterId, setTwitchChatterId] = useState("");
    const [resolvedTwitchUser, setResolvedTwitchUser] = useState<{ id: string, name: string, avatar: string } | null>(null);
    const [isCheckingUser, setIsCheckingUser] = useState(false);
    const [userCheckError, setUserCheckError] = useState("");
    const [replyMessage, setReplyMessage] = useState("");
    const [audioFile, setAudioFile] = useState<File | UploadedFile | null>(null);
    const [audioVolume, setAudioVolume] = useState<number>(100);

    // Delete states
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const fetchReplies = async (search = "") => {
        setIsLoading(true);
        try {
            const data = await listCustomReplies(search);
            if (data) {
                setReplies(data.data);
            }
        } catch (error) {
            console.error("Failed to fetch custom replies", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const debounce = setTimeout(() => {
            fetchReplies(searchTerm);
        }, 500);
        return () => clearTimeout(debounce);
    }, [searchTerm]);

    const handleOpenCreate = () => {
        setEditingId(null);
        setTwitchChatterId("");
        setResolvedTwitchUser(null);
        setUserCheckError("");
        setReplyMessage("");
        setAudioFile(null);
        setAudioVolume(100);
        setIsDialogOpen(true);
    };

    const handleOpenEdit = (reply: FirstWordCustomReply) => {
        setEditingId(reply.id);
        setTwitchChatterId(reply.twitch_chatter_username);
        setResolvedTwitchUser(null);
        setUserCheckError("");
        setReplyMessage(reply.reply_message || "");
        setAudioFile(reply.audio || null);
        setAudioVolume(reply.audio_volume ?? 100);
        setIsDialogOpen(true);
    };

    const handleSave = async () => {
        if (!twitchChatterId.trim()) {
            toast.error("กรุณาระบุ Twitch ID");
            return;
        }

        if (userCheckError) {
            toast.error("ไม่สามารถบันทึกได้เนื่องจากไม่พบชื่อผู้ใช้งาน");
            return;
        }

        setIsSaving(true);
        try {
            let audio_key: string | null = null;
            if (audioFile) {
                if (audioFile instanceof File) {
                    const uploaded = await uploadFile(audioFile);
                    audio_key = uploaded.key;
                } else {
                    audio_key = audioFile.key;
                }
            } else if (editingId) {
                const existing = replies.find(r => r.id === editingId);
                // If it was nullish, we make it nullish. If they didn't touch it but it was set?
                // Actually CompactAudioFileUploader returning null means they cleared it or kept old if not changed
                // Let's assume if audioFile is null, audio_key is null.
                if (existing?.audio_key && !audioFile) {
                    audio_key = null;
                } else if (existing?.audio_key && audioFile) {
                    audio_key = (audioFile as UploadedFile).key;
                }
            }

            const finalId = resolvedTwitchUser ? resolvedTwitchUser.id : twitchChatterId.trim().toLowerCase();



            let result;
            if (editingId) {
                const payload = {
                    reply_message: replyMessage.trim() || null,
                    audio_key,
                    audio_volume: audioVolume
                };
                console.log("updateCustomReply", payload);
                result = await updateCustomReply(editingId, payload);
            } else {
                const payload = {
                    twitch_chatter_id: finalId,
                    reply_message: replyMessage.trim() || null,
                    audio_key,
                    audio_volume: audioVolume
                };
                console.log("createCustomReply", payload);
                result = await createCustomReply(payload);
            }

            if (result) {
                toast.success(editingId ? "อัปเดตข้อมูลสำเร็จ" : "เพิ่มข้อมูลสำเร็จ");
                setIsDialogOpen(false);
                fetchReplies(searchTerm);
            } else {
                toast.error("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
            }
        } catch (error) {
            console.error(error);
            toast.error("เกิดข้อผิดพลาด");
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!deleteId) return;
        setIsDeleting(true);
        try {
            const success = await deleteCustomReply(deleteId);
            if (success) {
                toast.success("ลบข้อมูลสำเร็จ");
                fetchReplies(searchTerm);
            } else {
                toast.error("ไม่สามารถลบข้อมูลได้");
            }
        } catch (error) {
            console.error(error);
            toast.error("เกิดข้อผิดพลาดในการลบข้อมูล");
        } finally {
            setIsDeleting(false);
            setDeleteId(null);
        }
    };

    const checkTwitchUser = async (username: string) => {
        if (!username.trim()) {
            setResolvedTwitchUser(null);
            setUserCheckError("");
            return;
        }

        setIsCheckingUser(true);
        setUserCheckError("");
        setResolvedTwitchUser(null);

        try {
            const user = await getTwitchUser(username);
            if (user && user.id) {
                setResolvedTwitchUser({ id: user.id, name: user.display_name, avatar: user.profile_image_url });
            } else {
                setUserCheckError("ไม่พบผู้ใช้งานนี้ใน Twitch");
            }
        } catch (e) {
            setUserCheckError("ไม่พบผู้ใช้งานนี้ใน Twitch");
        } finally {
            setIsCheckingUser(false);
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className="relative w-full sm:w-72">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="ค้นหา Twitch ID..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-9 bg-black/20 border-white/20 text-white placeholder:text-white/50"
                    />
                </div>
                <Button onClick={handleOpenCreate} >
                    <Plus className="h-4 w-4" /> เพิ่มผู้ใช้
                </Button>
            </div>

            <div className="rounded-md border border-white/10 bg-black/20">
                <div className="grid grid-cols-12 gap-4 p-4 font-medium text-sm text-white/70 border-b border-white/10">
                    <div className="col-span-3">คนดูบน Twitch</div>
                    <div className="col-span-4">ข้อความตอบกลับ</div>
                    <div className="col-span-4">เสียง</div>
                    <div className="col-span-1 text-right"></div>
                </div>

                <ScrollArea className="h-[400px]">
                    {isLoading ? (
                        <div className="flex justify-center items-center h-32">
                            <Loader2 className="w-6 h-6 animate-spin text-white/50" />
                        </div>
                    ) : replies.length === 0 ? (
                        <div className="text-center py-10 text-white/50 text-sm">
                            ไม่พบข้อมูล
                        </div>
                    ) : (
                        <div className="divide-y divide-white/5">
                            {replies.map((reply) => (
                                <div key={reply.id} className="grid grid-cols-12 gap-4 p-4 items-center text-sm text-white hover:bg-white/5 transition-colors">
                                    <div className="col-span-3 font-medium truncate flex items-center gap-2">
                                        <Avatar size="sm">
                                            <AvatarImage src={reply.twitch_chatter_avatar_url} />
                                            <AvatarFallback>{reply.twitch_chatter_username.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        {reply.twitch_chatter_username}
                                    </div>
                                    <div className="col-span-4 truncate text-white/70">
                                        {reply.reply_message || <span className="text-white/30 italic">ไม่มีข้อความ</span>}
                                    </div>
                                    <div className="col-span-4">
                                        {reply.audio ? (
                                            <div className="flex items-center gap-2 text-primary text-xs bg-primary/10 w-fit px-2 py-1 rounded-md">
                                                <AudioWaveform className="w-4 h-4" />
                                                <span className="truncate max-w-[100px]">{reply.audio.name}</span>
                                            </div>
                                        ) : (
                                            <span className="text-white/30 italic text-xs">ไม่มีเสียง</span>
                                        )}
                                    </div>
                                    <div className="col-span-1 flex justify-end gap-1">
                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-white/70 hover:text-white" onClick={() => handleOpenEdit(reply)}>
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-red-400 hover:text-red-300 hover:bg-red-400/10" onClick={() => setDeleteId(reply.id)}>
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </ScrollArea>
            </div>

            {/* Create/Edit Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[425px] bg-[#1A1A1A] border-white/10 text-white">
                    <DialogHeader>
                        <DialogTitle>{editingId ? "แก้ไขข้อมูล" : "เพิ่มผู้ใช้ใหม่"}</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="twitchId" className="text-white/80">Twitch Username</Label>
                            <Input
                                id="twitchId"
                                value={twitchChatterId}
                                onChange={(e) => {
                                    setTwitchChatterId(e.target.value);
                                    setUserCheckError("");
                                    setResolvedTwitchUser(null);
                                }}
                                onBlur={(e) => checkTwitchUser(e.target.value)}
                                placeholder="เช่น user123"
                                className={`bg-black/40 border-white/10 ${userCheckError ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                                disabled={!!editingId}
                            />
                            {isCheckingUser && <p className="text-white/50 text-xs">กำลังตรวจสอบ...</p>}
                            {userCheckError && <p className="text-red-400 text-xs">{userCheckError}</p>}
                            {resolvedTwitchUser && (
                                <div className="flex items-center gap-2 mt-1 p-2 bg-white/5 rounded-md border border-white/10">
                                    <img src={resolvedTwitchUser.avatar} alt={resolvedTwitchUser.name} className="w-6 h-6 rounded-full" />
                                    <span className="text-sm text-white">{resolvedTwitchUser.name}</span>
                                </div>
                            )}
                        </div>
                        <div className="grid gap-2">
                            <ReplyMessageTextarea
                                value={replyMessage}
                                onChange={(e) => setReplyMessage(e)}
                                variables={FirstWordVariableMap}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label className="text-white/80">ไฟล์เสียง</Label>
                            <CompactAudioFileUploader
                                currentFileName={audioFile?.name || null}
                                selectedFile={audioFile}
                                onFileSelect={(file) => setAudioFile(file)}
                                audioVolume={audioVolume}
                                onAudioVolumeChange={setAudioVolume}
                                disabled={isSaving}
                                className="text-white"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="ghost" onClick={() => setIsDialogOpen(false)} disabled={isSaving} className="text-white/70 hover:text-white">
                            ยกเลิก
                        </Button>
                        <Button onClick={handleSave} disabled={isSaving || !twitchChatterId.trim() || !!userCheckError || isCheckingUser}>
                            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            บันทึก
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation */}
            <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
                <AlertDialogContent className="bg-[#1A1A1A] border-white/10 text-white">
                    <AlertDialogHeader>
                        <AlertDialogTitle>ยืนยันการลบ</AlertDialogTitle>
                        <AlertDialogDescription className="text-white/70">
                            คุณต้องการลบข้อความทักทายของผู้ใช้นี้ใช่หรือไม่? การกระทำนี้ไม่สามารถย้อนกลับได้
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="bg-transparent border-white/10 hover:bg-white/5 text-white">ยกเลิก</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="bg-red-500 hover:bg-red-600 text-white">
                            {isDeleting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />}
                            ลบข้อมูล
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
