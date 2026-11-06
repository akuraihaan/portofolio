import Image from "next/image";
import { safeHref } from "@/lib/domain";
export function MediaImage({
  src,
  alt,
  priority = false,
  contain = false,
}: {
  src: string;
  alt: string;
  priority?: boolean;
  contain?: boolean;
}) {
  if (!safeHref(src)) return null;
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const optimized =
    !!base &&
    src.startsWith(base + "/storage/v1/object/public/portfolio-public/");
  return (
    <Image
      className={contain ? "media-image contain" : "media-image"}
      src={src}
      alt={alt}
      width={1200}
      height={800}
      sizes="(max-width: 768px) 100vw, 1200px"
      priority={priority}
      unoptimized={!optimized}
    />
  );
}
