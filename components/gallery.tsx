"use client";
import { useRef, useState } from "react";
import { MediaImage } from "./media";
import { PixelIcon } from "./pixel-icon";
export type GalleryItem = { src: string; alt: string; caption?: string };
export function Gallery({
  items,
  label = "Galeri",
}: {
  items: GalleryItem[];
  label?: string;
}) {
  const [index, setIndex] = useState(0),
    dialog = useRef<HTMLDialogElement>(null),
    opener = useRef<HTMLButtonElement | null>(null);
  if (!items.length) return null;
  const current = items[index];
  const step = (direction: number) =>
    setIndex((old) => (old + direction + items.length) % items.length);
  return (
    <div className="gallery">
      <div className="gallery-thumbnails">
        {items.map((item, i) => (
          <button
            className="media-button"
            key={item.src + i}
            onClick={(event) => {
              opener.current = event.currentTarget;
              setIndex(i);
              dialog.current?.showModal();
            }}
            aria-label={`Buka ${item.alt}`}
          >
            <MediaImage src={item.src} alt={item.alt} />
            <span>
              {item.caption || item.alt}
              <PixelIcon name="arrow-up-right" />
            </span>
          </button>
        ))}
      </div>
      <dialog
        ref={dialog}
        className="media-dialog"
        aria-label={label}
        onClose={() => opener.current?.focus()}
        onKeyDown={(event) => {
          if (event.key === "ArrowRight") step(1);
          if (event.key === "ArrowLeft") step(-1);
        }}
      >
        <div className="dialog-heading">
          <p>
            {label} · {index + 1} / {items.length}
          </p>
          <button onClick={() => dialog.current?.close()}>Tutup <PixelIcon name="close" /></button>
        </div>
        <MediaImage src={current.src} alt={current.alt} contain />
        <p aria-live="polite">{current.caption || current.alt}</p>
        <div className="actions">
          <button disabled={items.length < 2} onClick={() => step(-1)}>
            ← Sebelumnya
          </button>
          <a
            className="pill"
            href={current.src}
            target="_blank"
            rel="noreferrer"
          >
            Buka ukuran penuh ↗
          </a>
          <button disabled={items.length < 2} onClick={() => step(1)}>
            Berikutnya →
          </button>
        </div>
      </dialog>
    </div>
  );
}
