import { ExtendedWidget } from "@/services/widget.service";

export interface EndCreditConfig {
    id: string;
    followers_header: string | null;
    subscribes_header: string | null;
    raids_header: string | null;
    bits_header: string | null;
    viewers_header: string | null;
    is_show_viewer_avatars: boolean;
    scroll_speed: number;
    is_show_followers: boolean;
    is_show_subs: boolean;
    is_show_raids: boolean;
    is_show_bits: boolean;
    is_show_sub_months: boolean;
    is_show_raid_count: boolean;
    is_show_bits_amount: boolean;
    widget: ExtendedWidget;
}

export type EndCreditRecordType = "follow" | "sub" | "raid" | "bit";

export interface EndCreditViewerRecord {
    id: number;
    viewer_id: string;
    type: EndCreditRecordType;
    value: string;
    end_credit_id: string;
    platform_created_at: string;
    display_name: string | null;
    avatar_url: string | null;
}
