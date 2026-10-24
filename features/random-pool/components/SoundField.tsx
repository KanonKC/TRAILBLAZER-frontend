"use client";

import { useRef, useState } from "react";
import { Music, Pause, Play, Trash2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UploadedFile } from "@/services/uploadedFile.service";
import { UploadHandler } from "../hooks/useRandomPool";

export function SoundField({
  label,
  help,
  value,
  files,
  busy,
  upload,
  onChange,
}: {
  label: string;
  help?: string;
  value?: string | null;
  files: UploadedFile[];
  busy: boolean;
  upload: UploadHandler;
  onChange: (key: string | null) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const file = files.find((candidate) => candidate.key === value);

  function togglePlay() {
    if (!file?.url) return;
    if (!audioRef.current) {
      audioRef.current = new Audio(file.url);
      audioRef.current.onended = () => setPlaying(false);
    }
    if (playing) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setPlaying(false);
    } else {
      void audioRef.current.play();
      setPlaying(true);
    }
  }

  return (
    <div className="grid gap-2">
      <span className="text-sm leading-none font-medium">{label}</span>
      {help && <p className="text-muted-foreground text-sm">{help}</p>}
      <div className="bg-muted/30 flex flex-wrap items-center justify-between gap-3 rounded-lg border p-3">
        <div className="flex min-w-0 items-center gap-3">
          <span className="bg-card text-muted-foreground grid size-10 shrink-0 place-items-center rounded-md">
            <Music className="size-5" aria-hidden="true" />
          </span>
          {value ? (
            <span className="truncate text-sm font-medium">
              {file?.name || "ตั้งค่าเสียงแล้ว"}
            </span>
          ) : (
            <span className="text-muted-foreground text-sm italic">
              ยังไม่ได้เลือกไฟล์เสียง
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {value && file?.url && (
            <Button
              type="button"
              variant="outline"
              size="icon"
              aria-label={playing ? "หยุดเสียง" : "เล่นเสียง"}
              onClick={togglePlay}
            >
              {playing ? <Pause /> : <Play />}
            </Button>
          )}
          <Button
            type="button"
            variant={value ? "ghost" : "outline"}
            size="sm"
            disabled={busy}
            onClick={() => inputRef.current?.click()}
          >
            <Upload />
            {value ? "เปลี่ยนไฟล์ใหม่" : "เลือกไฟล์เสียง"}
          </Button>
          {value && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label="นำเสียงออก"
              onClick={() => {
                audioRef.current?.pause();
                audioRef.current = null;
                setPlaying(false);
                onChange(null);
              }}
            >
              <Trash2 />
            </Button>
          )}
        </div>
        <input
          ref={inputRef}
          type="file"
          accept=".mp3,.ogg,.wav,audio/mpeg,audio/ogg,audio/wav"
          className="sr-only"
          aria-label={label}
          onChange={(event) => {
            const selected = event.target.files?.[0];
            event.target.value = "";
            if (!selected) return;
            audioRef.current = null;
            void upload(selected, "audio", (key) => onChange(key));
          }}
        />
      </div>
    </div>
  );
}
