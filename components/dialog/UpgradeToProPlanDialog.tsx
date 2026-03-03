import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import Image from 'next/image';

const UpgradeToProPlanDialog = ({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) => {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>

            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>อัปเกรดเป็นแผน Pro</DialogTitle>
                </DialogHeader>

                <DialogDescription className="space-y-4">
                    <div className="pt-2 text-muted-foreground text-sm space-y-2">
                        <p>ฟีเจอร์นี้เป็นฟีเจอร์พิเศษสำหรับผู้ใช้งานแผน Pro เท่านั้น เพื่อสนับสนุนการพัฒนาและรับสิทธิพิเศษเพิ่มเติม คุณสามารถอัปเกรดเป็นแผน Pro ในราคาเพียง <strong>69 บาท / เดือน</strong> โดยการ Subscribe ผ่านช่อง Twitch</p>
                    </div>
                    <div className="bg-muted p-4 rounded-md space-y-2 text-left">
                        <h4 className="font-semibold text-foreground">สิ่งที่จะได้รับ</h4>
                        <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                            <li>สามารถใช้งาน Widget พิเศษทั้งหมดได้อย่างไร้ขีดจำกัด</li>
                        </ul>
                    </div>
                    <div className="pt-2 text-foreground text-sm space-y-2">
                        <h4 className="font-semibold text-foreground">วิธีการสมัครเป็น Pro Plan</h4>
                        <p className="text-muted-foreground">คุณสามารถสมัครเป็น Pro Plan ได้ผ่านการกด Subscribe ที่ช่อง Twitch</p>
                        <ol className="list-decimal list-inside text-sm text-muted-foreground space-y-1">
                            <li>ไปที่หน้าช่อง Twitch โดยการกดปุ่ม "อัปเกรดเป็น Pro" ที่ด้านล่างขวา</li>
                            <li>กดปุ่ม Subscribe</li>
                            <li>เลือกอย่างน้อย Tier 1 โดยราคาจะอยู่ที่ 69.00 บาท/เดือน</li>
                            <li>ชำระเงิน</li>
                        </ol>
                        <div className="flex justify-center my-2">
                            <Image
                                src="/twitch-sub-navigation.png"
                                alt="Twitch Subscribe Navigation"
                                width={400}
                                height={200}
                                className="rounded-md object-contain"
                            />
                        </div>
                    </div>
                </DialogDescription>

                <DialogFooter>
                    <div className="flex justify-end gap-2 w-full">
                        <Button variant="outline" onClick={() => onOpenChange(false)}>
                            ยกเลิก
                        </Button>
                        <Button
                            asChild
                            className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold"
                        >
                            <a href="https://www.twitch.tv/kanonkc" target="_blank" rel="noopener noreferrer">
                                อัปเกรดเป็น Pro
                            </a>
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default UpgradeToProPlanDialog