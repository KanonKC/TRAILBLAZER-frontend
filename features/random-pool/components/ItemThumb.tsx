import Image from "next/image";
import { ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

/** Square image for a pool item, falling back to a neutral placeholder. */
export function ItemThumb({
  url,
  alt,
  className,
  iconClassName,
}: {
  url?: string | null;
  alt: string;
  className?: string;
  iconClassName?: string;
}) {
  return (
    <span
      className={cn(
        "bg-card text-muted-foreground relative grid aspect-square place-items-center overflow-hidden rounded-md",
        className,
      )}
    >
      {url ? (
        <Image
          unoptimized
          src={url}
          alt={alt}
          fill
          sizes="160px"
          className="object-cover"
        />
      ) : (
        <ImageIcon className={cn("size-5", iconClassName)} aria-hidden="true" />
      )}
    </span>
  );
}
