import { Info } from 'lucide-react'
import React from 'react'

const RandomFormatInfo = () => {
    return (
        <div className="p-4 rounded-lg bg-secondary border text-sm flex gap-3">
            <Info className="w-5 h-5 flex-shrink-0 mt-0.5 text-info" />
            <div className="space-y-2">
                <p className="font-semibold">รูปแบบคำตอบของการสุ่ม:</p>
                <p className="font-mono bg-background px-1.5 py-0.5 rounded inline-block">[ 2/1 | 3/10 | 5/15 | 2/2 ]</p>
                <ul className="list-disc pl-4 space-y-0.5 text-muted-foreground">
                    <li>เลขตัวหน้า = <strong className="text-foreground">หน้าที่ (Page)</strong></li>
                    <li>เลขตัวหลัง = <strong className="text-foreground">ลำดับที่ (Index 1-15)</strong></li>
                </ul>
                <p className="text-muted-foreground">(เช่น 2/1 คือ หน้า 2 ตัวที่ 1)</p>
            </div>
        </div>
    )
}

export default RandomFormatInfo
