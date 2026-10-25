import { Info } from 'lucide-react'
import React from 'react'

const RandomFormatInfo = () => {
    return (
        <div className="p-4 rounded-lg bg-info/10 border border-info/20 text-info text-sm flex gap-3">
            <Info className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div>
                <p className="font-semibold mb-1">รูปแบบคำตอบของการสุ่ม:</p>
                <div className="space-y-2">
                    <p className="font-mono mb-1 bg-background/20 px-1 py-0.5 rounded inline-block text-info">[ 2/1 | 3/10 | 5/15 | 2/2 ]</p>
                    <ul className="list-disc pl-4 space-y-0.5 opacity-90">
                        <li>เลขตัวหน้า = <strong>หน้าที่ (Page)</strong></li>
                        <li>เลขตัวหลัง = <strong>ลำดับที่ (Index 1-15)</strong></li>
                    </ul>
                    <p className="mt-1 opacity-80">(เช่น 2/1 คือ หน้า 2 ตัวที่ 1)</p>
                </div>
            </div>
        </div>
    )
}

export default RandomFormatInfo