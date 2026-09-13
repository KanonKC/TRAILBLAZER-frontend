import * as React from "react";
import { ChannelRewardSelector, Label } from "trailblazer-ui";

const img = (c: string) => ({ url_1x: `https://static-cdn.jtvnw.net/custom-reward-images/default-${c}.png`, url_2x: "", url_4x: "" });
const rewards = [
  { id: "r1", title: "Song Request", prompt: "ขอเพลงจาก Spotify", cost: 500, image: null, default_image: img("1"), background_color: "#1DB954", is_enabled: true },
  { id: "r2", title: "Shoutout", prompt: "ให้บอท shoutout ช่องที่ระบุ", cost: 1000, image: null, default_image: img("2"), background_color: "#FF8C00", is_enabled: true },
  { id: "r3", title: "Change Killer", prompt: "สุ่มคิลเลอร์ใหม่", cost: 2500, image: null, default_image: img("4"), background_color: "#9147FF", is_enabled: true },
];

export const Selected = () => (
  <div className="p-6 max-w-md grid gap-2">
    <Label>Channel Reward ที่ใช้ทริกเกอร์</Label>
    <ChannelRewardSelector value="r2" onValueChange={() => {}} rewards={rewards} />
  </div>
);

export const Empty = () => (
  <div className="p-6 max-w-md grid gap-2">
    <Label>Channel Reward ที่ใช้ทริกเกอร์</Label>
    <ChannelRewardSelector value={null} onValueChange={() => {}} rewards={rewards} placeholder="เลือก reward" />
  </div>
);

export const LoadingAndDisabled = () => (
  <div className="p-6 max-w-md grid gap-3">
    <ChannelRewardSelector value={null} onValueChange={() => {}} rewards={[]} isLoading />
    <ChannelRewardSelector value="r1" onValueChange={() => {}} rewards={rewards} disabled />
  </div>
);
