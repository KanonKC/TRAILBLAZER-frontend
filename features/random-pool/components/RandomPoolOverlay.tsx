"use client";
import Image from "next/image";
import { useParams, useSearchParams } from "next/navigation";
import { useRandomPoolOverlay, SPIN_MS } from "../hooks/useRandomPoolOverlay";
import { SpinItem } from "../types";
import { Button } from "@/components/ui/button";
function Item({ item }: { item: SpinItem }) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-3 p-3">
      {item.image_url && (
        <Image
          unoptimized
          width={640}
          height={320}
          src={item.image_url}
          alt={item.name || ""}
          className="max-h-[75%] max-w-full object-contain"
        />
      )}
      {item.name && (
        <p className="max-w-full break-words text-center text-2xl font-bold text-white drop-shadow-lg">
          {item.name}
        </p>
      )}
    </div>
  );
}
export function RandomPoolOverlay() {
  const { configId } = useParams<{ configId: string }>();
  const key = useSearchParams().get("key") || "";
  const controller = useRandomPoolOverlay(configId, key);
  const { event, current, landed, started } = controller;
  const winnerIndex =
    event?.pool.findIndex((item) => item.id === event.item.id) ?? 0;
  const target = event ? event.pool.length * 5 + winnerIndex : 0;
  const totalWeight =
    event?.pool.reduce((total, item) => total + (item.weight ?? 1), 0) || 1;
  let angle = 0;
  const segments =
    event?.pool.map((item, index) => {
      const start = angle;
      const size = ((item.weight ?? 1) / totalWeight) * 360;
      angle += size;
      return { item, index, start, size };
    }) || [];
  const winner = segments[winnerIndex];
  const wheelRotation = 360 * 6 - (winner ? winner.start + winner.size / 2 : 0);
  return (
    <main
      className="relative flex h-screen w-screen items-center justify-center overflow-hidden bg-transparent"
      aria-label="Random Pool overlay"
    >
      <div className={controller.available ? "" : "blur-xl opacity-0"}>
        {event && current && (
          <div
            key={event.jobId}
            className="relative flex h-[460px] w-[720px] max-w-[95vw] flex-col items-center justify-center"
          >
            {event.visualization === "SHUFFLE" && (
              <div className="h-80 w-80">
                <Item item={current} />
              </div>
            )}
            {event.visualization === "SLIDE" && (
              <div className="relative h-64 w-full overflow-hidden rounded-xl bg-black/70">
                <div className="absolute inset-y-0 left-1/2 z-10 w-1 bg-orange-400" />
                <div
                  className="absolute left-1/2 flex h-full"
                  style={{
                    transform: `translateX(${-90 - (started ? target * 180 : 0)}px)`,
                    transition: started
                      ? `transform ${SPIN_MS}ms cubic-bezier(.12,.75,.15,1)`
                      : "none",
                  }}
                >
                  {Array.from({ length: target + 4 }, (_, index) => (
                    <div
                      key={index}
                      className="h-full w-[180px] shrink-0 border-r border-white/20"
                    >
                      <Item item={event.pool[index % event.pool.length]} />
                    </div>
                  ))}
                </div>
              </div>
            )}
            {event.visualization === "WHEEL" && (
              <div className="relative h-80 w-80">
                <div className="absolute -top-4 left-1/2 z-10 -translate-x-1/2 text-3xl text-white">
                  ▼
                </div>
                <svg
                  viewBox="0 0 320 320"
                  className="h-full w-full drop-shadow-xl"
                  style={{
                    transform: `rotate(${started ? wheelRotation : 0}deg)`,
                    transition: started
                      ? `transform ${SPIN_MS}ms cubic-bezier(.12,.75,.15,1)`
                      : "none",
                  }}
                >
                  {segments.map((segment) => {
                    const start = ((segment.start - 90) * Math.PI) / 180;
                    const end =
                      ((segment.start + segment.size - 90) * Math.PI) / 180;
                    const middle = (start + end) / 2;
                    const color = `hsl(${(segment.index * 137.5) % 360} 65% 40%)`;
                    return (
                      <g key={segment.item.id}>
                        {segment.size >= 359.999 ? (
                          <circle cx="160" cy="160" r="156" fill={color} />
                        ) : (
                          <path
                            d={`M160 160 L${160 + 156 * Math.cos(start)} ${160 + 156 * Math.sin(start)} A156 156 0 ${segment.size > 180 ? 1 : 0} 1 ${160 + 156 * Math.cos(end)} ${160 + 156 * Math.sin(end)} Z`}
                            fill={color}
                            stroke="white"
                            strokeWidth="1"
                          />
                        )}
                        {segment.size > 10 && (
                          <text
                            x={160 + 100 * Math.cos(middle)}
                            y={160 + 100 * Math.sin(middle)}
                            textAnchor="middle"
                            dominantBaseline="middle"
                            fill="white"
                            fontSize="14"
                          >
                            {segment.item.name?.slice(0, 10) ||
                              segment.index + 1}
                          </text>
                        )}
                      </g>
                    );
                  })}
                </svg>
              </div>
            )}
            {landed && event.visualization !== "SHUFFLE" && (
              <div className="mt-4 h-24 w-56">
                <Item item={event.item} />
              </div>
            )}
          </div>
        )}
      </div>
      {controller.audioBlocked && (
        <Button
          className="absolute bottom-4"
          variant="secondary"
          onClick={controller.enableAudio}
        >
          เปิดเสียง · อนุญาต Autoplay ใน Browser Source
        </Button>
      )}
      {!controller.connected && (
        <span className="sr-only">กำลังเชื่อมต่อ Overlay อีกครั้ง</span>
      )}
    </main>
  );
}
