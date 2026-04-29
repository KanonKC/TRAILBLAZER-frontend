import type { Metadata } from "next";
import { 
  Shield, 
  Database, 
  Scale, 
  Info, 
  Share2, 
  Globe, 
  Cookie, 
  Clock, 
  Lock, 
  UserCheck, 
  Mail,
  ChevronRight
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "นโยบายความเป็นส่วนตัว | TRAILBLAZER",
  description: "นโยบายความเป็นส่วนตัวของ TRAILBLAZER เพื่ออธิบายวิธีการที่เราเก็บรวบรวม ใช้ และปกป้องข้อมูลส่วนบุคคลของคุณตามมาตรฐาน PDPA",
};

const sections = [
  { id: "collection", title: "1. ข้อมูลส่วนบุคคลที่เราเก็บรวบรวม", icon: Database },
  { id: "legal-basis", title: "2. ฐานทางกฎหมาย", icon: Scale },
  { id: "purpose", title: "3. วัตถุประสงค์การใช้ข้อมูล", icon: Info },
  { id: "disclosure", title: "4. การเปิดเผยข้อมูล", icon: Share2 },
  { id: "international-transfer", title: "5. การโอนข้อมูลระหว่างประเทศ", icon: Globe },
  { id: "cookies", title: "6. นโยบายคุกกี้", icon: Cookie },
  { id: "retention", title: "7. ระยะเวลาการเก็บรักษา", icon: Clock },
  { id: "security", title: "8. มาตรการความปลอดภัย", icon: Lock },
  { id: "rights", title: "9. สิทธิของเจ้าของข้อมูล", icon: UserCheck },
  { id: "contact", title: "10. ช่องทางการติดต่อ", icon: Mail },
];

export default function PrivacyPolicyPage() {
  return (
    <div className="relative min-h-screen pt-24 pb-20">
      {/* Background Decorative Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full" />
        <div className="absolute top-[20%] -right-[10%] w-[30%] h-[30%] bg-blue-500/10 blur-[100px] rounded-full" />
      </div>

      <div className="container relative mx-auto px-4 sm:px-6">
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Sticky Sidebar - Table of Contents */}
          <aside className="hidden lg:block w-72 shrink-0">
            <div className="sticky top-28 space-y-4">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                <h3 className="font-kanit font-bold text-lg mb-4 text-primary">สารบัญ</h3>
                <nav className="space-y-1">
                  {sections.map((section) => (
                    <a
                      key={section.id}
                      href={`#${section.id}`}
                      className="flex items-center gap-3 px-3 py-2 text-sm text-muted-foreground hover:text-white hover:bg-white/5 rounded-lg transition-all group"
                    >
                      <section.icon className="w-4 h-4 group-hover:text-primary transition-colors" />
                      <span className="line-clamp-1">{section.title}</span>
                      <ChevronRight className="w-3 h-3 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                    </a>
                  ))}
                </nav>
              </div>
              <div className="p-4 rounded-2xl bg-gradient-to-br from-primary/20 to-blue-600/20 border border-white/10 backdrop-blur-md">
                <p className="text-sm font-medium">ต้องการความช่วยเหลือ?</p>
                <p className="text-xs text-muted-foreground mt-1">ติดต่อเราได้ที่ kanonkce@gmail.com</p>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 max-w-4xl">
            <header className="mb-12">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-4">
                <Shield className="w-4 h-4" />
                <span>Privacy & Protection</span>
              </div>
              <h1 className="font-kanit font-extrabold text-4xl sm:text-5xl md:text-6xl tracking-tight mb-6 bg-gradient-to-r from-white via-white to-white/50 bg-clip-text text-transparent">
                นโยบายความเป็นส่วนตัว
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>วันที่มีผลบังคับใช้: 27 เมษายน 2568</span>
                </div>
                <Separator orientation="vertical" className="h-4 hidden sm:block" />
                <span>สำหรับแอปพลิเคชัน TRAILBLAZER</span>
              </div>
            </header>

            <section className="prose prose-invert max-w-none mb-12">
              <p className="text-lg text-muted-foreground leading-relaxed">
                แอปพลิเคชัน <strong className="text-white">TRAILBLAZER</strong> ("เรา" "แพลตฟอร์ม") ให้ความสำคัญและเคารพต่อความเป็นส่วนตัวของผู้ใช้งาน ("คุณ") 
                นโยบายความเป็นส่วนตัวฉบับนี้จัดทำขึ้นเพื่อให้สอดคล้องกับพระราชบัญญัติคุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562 (PDPA) 
                เพื่ออธิบายให้คุณทราบถึงวิธีการที่เราเก็บรวบรวม ใช้ เปิดเผย และรักษาข้อมูลส่วนบุคคลของคุณ รวมถึงสิทธิต่างๆ ที่คุณมีในฐานะเจ้าของข้อมูล
              </p>
            </section>

            <div className="space-y-16">
              
              {/* Section 1 */}
              <section id="collection" className="scroll-mt-28">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20 text-primary">
                    <Database className="w-6 h-6" />
                  </div>
                  <h2 className="font-kanit font-bold text-2xl md:text-3xl">1. ข้อมูลส่วนบุคคลที่เราเก็บรวบรวม</h2>
                </div>
                <div className="space-y-4">
                  <p className="text-muted-foreground">เราเก็บรวบรวมข้อมูลส่วนบุคคลของคุณเท่าที่จำเป็นต่อการให้บริการ โดยแบ่งออกเป็นประเภทต่างๆ ดังนี้:</p>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { title: "ข้อมูลบัญชีหลัก", desc: "Twitch ID, Username, Display Name, Profile Avatar" },
                      { title: "ข้อมูลบัญชีที่เชื่อมต่อ", desc: "YouTube, Discord (User ID, Username, Avatar)" },
                      { title: "ข้อมูลการให้สิทธิ์", desc: "Access Tokens, Refresh Tokens สำหรับ Twitch และบัญชีอื่นๆ" },
                      { title: "ข้อมูลการตั้งค่า", desc: "วิดเจ็ต (First Word, Clips, Drops), Media Files, Workflows" },
                      { title: "ข้อมูลทางเทคนิค", desc: "IP Address, Browser Type, Cookies (สำหรับจัดการ Session)" }
                    ].map((item, i) => (
                      <li key={i} className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-primary/30 transition-colors">
                        <span className="block font-bold text-white mb-1">{item.title}</span>
                        <span className="text-sm text-muted-foreground leading-relaxed">{item.desc}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </section>

              <Separator className="opacity-10" />

              {/* Section 2 */}
              <section id="legal-basis" className="scroll-mt-28">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20 text-primary">
                    <Scale className="w-6 h-6" />
                  </div>
                  <h2 className="font-kanit font-bold text-2xl md:text-3xl">2. ฐานทางกฎหมายในการประมวลผลข้อมูล</h2>
                </div>
                <Card className="bg-white/5 border-white/10 overflow-hidden">
                  <Table>
                    <TableHeader className="bg-white/5">
                      <TableRow>
                        <TableHead className="w-[30%]">ประเภทข้อมูล</TableHead>
                        <TableHead className="w-[30%]">ฐานทางกฎหมาย</TableHead>
                        <TableHead>คำอธิบาย</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {[
                        { type: "บัญชี Twitch / เชื่อมต่อ", basis: "สัญญา (Contract)", desc: "จำเป็นเพื่อให้บริการตามที่คุณร้องขอ" },
                        { type: "Tokens", basis: "สัญญา (Contract)", desc: "จำเป็นต่อการทำงานของระบบและวิดเจ็ต" },
                        { type: "การตั้งค่า / Workflow", basis: "สัญญา (Contract)", desc: "จำเป็นเพื่อให้ฟีเจอร์ทำงานตามที่ปรับแต่ง" },
                        { type: "IP, Cookies, Session", basis: "ประโยชน์ชอบธรรม", desc: "เพื่อความปลอดภัยและการจัดการระบบ" },
                        { type: "การวิเคราะห์ปรับปรุง", basis: "ประโยชน์ชอบธรรม", desc: "เพื่อพัฒนาคุณภาพการให้บริการ" },
                      ].map((row, i) => (
                        <TableRow key={i}>
                          <TableCell className="font-medium text-white">{row.type}</TableCell>
                          <TableCell className="text-primary font-medium">{row.basis}</TableCell>
                          <TableCell className="text-muted-foreground">{row.desc}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Card>
              </section>

              <Separator className="opacity-10" />

              {/* Section 3 */}
              <section id="purpose" className="scroll-mt-28">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20 text-primary">
                    <Info className="w-6 h-6" />
                  </div>
                  <h2 className="font-kanit font-bold text-2xl md:text-3xl">3. วัตถุประสงค์ในการเก็บรวบรวมและการใช้ข้อมูล</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    "เพื่อให้บริการและจัดการบัญชี ยืนยันตัวตน และอำนวยความสะดวกในการใช้งาน",
                    "เพื่อให้วิดเจ็ต ฟีเจอร์ และบอทต่างๆ ทำงานร่วมกับช่อง Twitch ของคุณได้อย่างถูกต้อง",
                    "เพื่อการปรับปรุงแอปพลิเคชัน วิเคราะห์และพัฒนาฟีเจอร์ใหม่ๆ",
                    "เพื่อการรักษาความปลอดภัย ป้องกันและระงับเหตุการณ์ที่อาจก่อให้เกิดความเสี่ยง",
                    "เพื่อการติดต่อสื่อสาร แจ้งข้อมูลข่าวสารที่สำคัญเกี่ยวกับการอัปเดตระบบ"
                  ].map((text, i) => (
                    <div key={i} className="flex gap-4 items-start p-4 rounded-2xl bg-white/5 border border-white/10 group">
                      <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center shrink-0 mt-1 group-hover:bg-primary transition-colors">
                        <span className="text-xs font-bold text-white">{i + 1}</span>
                      </div>
                      <p className="text-muted-foreground group-hover:text-white transition-colors">{text}</p>
                    </div>
                  ))}
                </div>
              </section>

              <Separator className="opacity-10" />

              {/* Section 4 */}
              <section id="disclosure" className="scroll-mt-28">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20 text-primary">
                    <Share2 className="w-6 h-6" />
                  </div>
                  <h2 className="font-kanit font-bold text-2xl md:text-3xl">4. การใช้และการเปิดเผยข้อมูลส่วนบุคคล</h2>
                </div>
                <p className="text-muted-foreground mb-6">เราจะไม่นำข้อมูลส่วนบุคคลของคุณไปขาย แลกเปลี่ยน หรือเปิดเผยให้แก่บุคคลภายนอก เว้นแต่ในกรณีดังต่อไปนี้:</p>
                <div className="space-y-4">
                  {[
                    { title: "ผู้ให้บริการภายนอก", desc: "เราอาจใช้บริการบุคคลที่สาม (เช่น เซิร์ฟเวอร์ ฐานข้อมูล) โดยจำกัดสิทธิ์การเข้าถึงภายใต้มาตรการรักษาความลับ" },
                    { title: "แพลตฟอร์มที่คุณเชื่อมต่อ", desc: "ส่งข้อมูลไปยัง API ของ Twitch, YouTube, Discord เพื่อให้ฟีเจอร์ทำงานตามที่คุณอนุญาต" },
                    { title: "เมื่อกฎหมายบังคับ", desc: "เปิดเผยตามความจำเป็นเพื่อให้เป็นไปตามกฎหมาย หรือตามคำสั่งของหน่วยงานรัฐที่มีอำนาจ" }
                  ].map((item, i) => (
                    <Card key={i} className="bg-white/5 border-white/10">
                      <CardContent className="p-5">
                        <h4 className="font-bold text-white mb-2">{item.title}</h4>
                        <p className="text-muted-foreground">{item.desc}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>

              <Separator className="opacity-10" />

              {/* Section 5 */}
              <section id="international-transfer" className="scroll-mt-28">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20 text-primary">
                    <Globe className="w-6 h-6" />
                  </div>
                  <h2 className="font-kanit font-bold text-2xl md:text-3xl">5. การโอนข้อมูลระหว่างประเทศ</h2>
                </div>
                <div className="p-6 rounded-2xl bg-gradient-to-br from-white/10 to-transparent border border-white/10">
                  <p className="text-muted-foreground leading-relaxed mb-6">
                    เราใช้โครงสร้างพื้นฐานที่ตั้งอยู่ทั้งในไทยและต่างประเทศ โดยเฉพาะ <strong className="text-white">สหรัฐอเมริกา</strong> 
                    (เช่น Cloudflare) ซึ่งข้อมูลอาจถูกโอนหรือประมวลผลนอกราชอาณาจักร 
                    โดยเรามีมาตรการรักษาความปลอดภัยดังนี้:
                  </p>
                  <ul className="space-y-3">
                    {[
                      "ใช้ผู้ให้บริการที่มีมาตรฐานความปลอดภัยระดับสากล",
                      "เข้ารหัสข้อมูล (Encryption in Transit) ด้วย HTTPS/TLS เสมอ",
                      "เลือกผู้ให้บริการที่ผ่านการรับรอง เช่น ISO 27001 หรือ SOC 2"
                    ].map((text, i) => (
                      <li key={i} className="flex items-center gap-3 text-muted-foreground">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                        {text}
                      </li>
                    ))}
                  </ul>
                </div>
              </section>

              <Separator className="opacity-10" />

              {/* Section 6 */}
              <section id="cookies" className="scroll-mt-28">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20 text-primary">
                    <Cookie className="w-6 h-6" />
                  </div>
                  <h2 className="font-kanit font-bold text-2xl md:text-3xl">6. นโยบายคุกกี้</h2>
                </div>
                <div className="space-y-6">
                  <Card className="bg-white/5 border-white/10 overflow-hidden">
                    <Table>
                      <TableHeader className="bg-white/5">
                        <TableRow>
                          <TableHead className="w-[40%]">ประเภทคุกกี้</TableHead>
                          <TableHead>วัตถุประสงค์</TableHead>
                          <TableHead className="w-[100px] text-center">จำต้อง?</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell className="font-medium text-white">คุกกี้จำเป็น (Strictly Necessary)</TableCell>
                          <TableCell className="text-muted-foreground">จัดการ Session การเข้าสู่ระบบ และรักษาสถานะการใช้งาน</TableCell>
                          <TableCell className="text-center">✅</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium text-white">คุกกี้การทำงาน (Functional)</TableCell>
                          <TableCell className="text-muted-foreground">จดจำการตั้งค่าและ Preferences ของคุณ</TableCell>
                          <TableCell className="text-center">⚙️</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </Card>
                  <p className="text-sm text-muted-foreground italic">
                    * คุกกี้จำเป็นถูกใช้เพื่อให้แอปพลิเคชันทำงานได้เท่านั้น เราไม่ใช้คุกกี้เพื่อการโฆษณาหรือติดตามพฤติกรรมของคุณ
                  </p>
                </div>
              </section>

              <Separator className="opacity-10" />

              {/* Section 7 */}
              <section id="retention" className="scroll-mt-28">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20 text-primary">
                    <Clock className="w-6 h-6" />
                  </div>
                  <h2 className="font-kanit font-bold text-2xl md:text-3xl">7. ระยะเวลาการเก็บรักษาข้อมูล</h2>
                </div>
                <Card className="bg-white/5 border-white/10 overflow-hidden mb-6">
                  <Table>
                    <TableHeader className="bg-white/5">
                      <TableRow>
                        <TableHead className="w-[40%]">ประเภทข้อมูล</TableHead>
                        <TableHead>ระยะเวลาเก็บรักษา</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {[
                        { type: "ข้อมูลบัญชีและการตั้งค่า", time: "ตลอดระยะเวลาที่บัญชีของคุณยังเปิดใช้งาน" },
                        { type: "Tokens (Access/Refresh)", time: "จนกว่าจะถูก Revoke หรือหมดอายุตามแพลตฟอร์มกำหนด" },
                        { type: "ข้อมูล Session และ Cookies", time: "จนกว่า Session จะสิ้นสุดหรือคุกกี้หมดอายุ" },
                      ].map((row, i) => (
                        <TableRow key={i}>
                          <TableCell className="font-medium text-white">{row.type}</TableCell>
                          <TableCell className="text-muted-foreground">{row.time}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Card>
                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20">
                  <div className="flex items-center gap-2 text-red-400 font-bold mb-1">
                    <Lock className="w-4 h-4" />
                    <span>ข้อมูลทั้งหมดหลังปิดบัญชี</span>
                  </div>
                  <p className="text-red-400/80 text-sm">เราจะดำเนินการลบทันทีเมื่อคุณลบบัญชีผู้ใช้งาน รวมถึงลบออกจาก Backup ภายในระยะเวลาอันสมควร</p>
                </div>
              </section>

              <Separator className="opacity-10" />

              {/* Section 8 */}
              <section id="security" className="scroll-mt-28">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20 text-primary">
                    <Lock className="w-6 h-6" />
                  </div>
                  <h2 className="font-kanit font-bold text-2xl md:text-3xl">8. มาตรการรักษาความปลอดภัย</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    { title: "Encryption", desc: "เข้ารหัสข้อมูลในการส่งผ่าน (HTTPS/TLS) ตลอดเวลา" },
                    { title: "Safe Storage", desc: "จัดเก็บโทเค็นในฐานข้อมูลที่มีระบบรักษาความปลอดภัยสูง" },
                    { title: "Access Control", desc: "จำกัดสิทธิ์การเข้าถึงข้อมูลเฉพาะเจ้าหน้าที่ที่จำเป็น" }
                  ].map((item, i) => (
                    <div key={i} className="p-5 rounded-2xl bg-white/5 border border-white/10">
                      <h4 className="font-bold text-white mb-2">{item.title}</h4>
                      <p className="text-sm text-muted-foreground">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </section>

              <Separator className="opacity-10" />

              {/* Section 9 */}
              <section id="rights" className="scroll-mt-28">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20 text-primary">
                    <UserCheck className="w-6 h-6" />
                  </div>
                  <h2 className="font-kanit font-bold text-2xl md:text-3xl">9. สิทธิของเจ้าของข้อมูลส่วนบุคคล</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { title: "สิทธิการเข้าถึง", desc: "ขอรับสำเนาข้อมูลที่เราเก็บรักษาไว้" },
                    { title: "สิทธิการแก้ไข", desc: "ขอให้เราแก้ไขข้อมูลให้เป็นปัจจุบัน" },
                    { title: "สิทธิการลบข้อมูล", desc: "ขอให้เราลบหรือทำให้ข้อมูลระบุตัวตนไม่ได้" },
                    { title: "สิทธิการระงับการใช้", desc: "ขอให้ระงับการใช้ข้อมูลชั่วคราว" },
                    { title: "สิทธิโอนย้ายข้อมูล", desc: "ขอรับข้อมูลในรูปแบบที่นำไปใช้ที่อื่นได้" },
                    { title: "สิทธิคัดค้าน", desc: "คัดค้านการประมวลผลตามประโยชน์ชอบธรรม" },
                    { title: "สิทธิถอนความยินยอม", desc: "ยกเลิกสิทธิ์เชื่อมต่อได้ตลอดเวลา" }
                  ].map((item, i) => (
                    <div key={i} className="p-4 rounded-xl bg-white/5 border border-white/10 flex flex-col">
                      <span className="font-bold text-white mb-1">{item.title}</span>
                      <span className="text-sm text-muted-foreground">{item.desc}</span>
                    </div>
                  ))}
                </div>
                <p className="mt-6 text-sm text-muted-foreground bg-primary/5 p-4 rounded-lg border border-primary/10">
                  * เราจะดำเนินการตอบสนองต่อการใช้สิทธิของคุณภายใน <strong className="text-primary">30 วัน</strong> นับจากวันที่ได้รับคำขอ
                </p>
              </section>

              <Separator className="opacity-10" />

              {/* Section 10 */}
              <section id="contact" className="scroll-mt-28">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20 text-primary">
                    <Mail className="w-6 h-6" />
                  </div>
                  <h2 className="font-kanit font-bold text-2xl md:text-3xl">10. ช่องทางการติดต่อ</h2>
                </div>
                <div className="p-8 rounded-3xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/20 text-center max-w-2xl mx-auto">
                  <p className="text-muted-foreground mb-6">หากคุณมีคำถาม ข้อเสนอแนะ หรือต้องการใช้สิทธิตามนโยบายนี้ กรุณาติดต่อเราได้ที่:</p>
                  <a 
                    href="mailto:kanonkce@gmail.com" 
                    className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-primary text-white font-bold text-lg hover:scale-105 transition-transform shadow-lg shadow-primary/30"
                  >
                    <Mail className="w-5 h-5" />
                    kanonkce@gmail.com
                  </a>
                </div>
              </section>

              <div className="pt-10 text-center">
                <p className="text-sm text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                  หมายเหตุ: นโยบายฉบับนี้อาจมีการปรับปรุงเป็นครั้งคราว โดยวันที่บังคับใช้ล่าสุดจะแสดงไว้ที่ด้านบนของเอกสารเสมอ
                </p>
              </div>

            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
