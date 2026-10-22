"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { UploadedFile } from "@/services/uploadedFile.service";
export function SoundInput({
  label,
  value,
  files,
  busy,
  onChange,
  upload,
}: {
  label: string;
  value?: string | null;
  files: UploadedFile[];
  busy: boolean;
  onChange: (key: string | null) => void;
  upload: (
    file: File,
    kind: "audio",
    onUploaded: (key: string, url: string) => void,
  ) => Promise<void>;
}) {
  const file = files.find((file) => file.key === value);
  return (
    <div className="space-y-2 rounded-lg border p-3">
      <Label>{label}</Label>
      <Input
        aria-label={label}
        type="file"
        accept=".mp3,.ogg,.wav"
        disabled={busy}
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) void upload(file, "audio", (key) => onChange(key));
        }}
      />
      <p className="text-sm text-muted-foreground">
        MP3 / OGG / WAV · 2 MB · 15 วินาที
      </p>
      {value && (
        <>
          <p className="truncate text-sm">{file?.name || "ตั้งค่าเสียงแล้ว"}</p>
          {file?.url && <audio controls src={file.url} className="w-full" />}
          <Button variant="ghost" onClick={() => onChange(null)}>
            นำเสียงออก / ใช้ค่า Default
          </Button>
        </>
      )}
    </div>
  );
}
