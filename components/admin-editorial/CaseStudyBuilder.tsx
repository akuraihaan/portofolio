"use client";

import React, { useState } from "react";
import {
  Plus,
  Trash2,
  Copy,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  Monitor,
  Tablet,
  Smartphone,
} from "lucide-react";
import {
  BLOCK_TYPE_LABELS,
  createDefaultBlock,
  normalizeCaseStudyBlocks,
  type CaseStudyBlock,
  type CaseStudyBlockType,
  type BlockMotionPreset,
  type BlockBackground,
} from "@/lib/case-study-blocks";
import { CaseStudyBlockRenderer } from "../projects/CaseStudyBlockRenderer";

interface CaseStudyBuilderProps {
  value: Record<string, unknown>;
  onChange: (next: Record<string, unknown>) => void;
}

const MOTION_PRESETS: BlockMotionPreset[] = [
  "reveal",
  "fade",
  "slide",
  "scale",
  "clip",
  "parallax",
  "stagger",
  "none",
];

const BACKGROUNDS: BlockBackground[] = [
  "default",
  "orange",
  "peach",
  "green",
  "blue",
  "dark",
];

export function CaseStudyBuilder({ value, onChange }: CaseStudyBuilderProps) {
  const blocks = normalizeCaseStudyBlocks(value);
  const [newType, setNewType] = useState<CaseStudyBlockType>("paragraph");
  const [previewMode, setPreviewMode] = useState<"edit" | "desktop" | "tablet" | "mobile">("edit");

  const updateBlocks = (nextBlocks: CaseStudyBlock[]) => {
    onChange({ ...value, blocks: nextBlocks });
  };

  const addBlock = () => {
    updateBlocks([...blocks, createDefaultBlock(newType)]);
  };

  const updateBlock = (id: string, patch: Partial<CaseStudyBlock>) => {
    updateBlocks(blocks.map((b) => (b.id === id ? { ...b, ...patch } : b)));
  };

  const removeBlock = (id: string) => {
    updateBlocks(blocks.filter((b) => b.id !== id));
  };

  const duplicateBlock = (idx: number) => {
    const src = blocks[idx];
    const copy: CaseStudyBlock = {
      ...src,
      id: `blk_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 5)}`,
    };
    const next = [...blocks];
    next.splice(idx + 1, 0, copy);
    updateBlocks(next);
  };

  const moveBlock = (idx: number, dir: -1 | 1) => {
    const target = idx + dir;
    if (target < 0 || target >= blocks.length) return;
    const next = [...blocks];
    [next[idx], next[target]] = [next[target], next[idx]];
    updateBlocks(next);
  };

  return (
    <div className="border border-[#000000]/15 dark:border-[#FAF8F5]/15 rounded-[0.75rem] p-4 space-y-4 bg-[#FAF8F5] dark:bg-[#1A1917]">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#000000]/10 dark:border-[#FAF8F5]/10">
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={newType}
            onChange={(e) => setNewType(e.target.value as CaseStudyBlockType)}
            className="px-3 py-1.5 rounded-[0.4rem] border border-[#000000]/20 dark:border-[#FAF8F5]/20 bg-transparent text-xs font-mono"
          >
            {Object.entries(BLOCK_TYPE_LABELS).map(([k, label]) => (
              <option key={k} value={k}>
                {label}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={addBlock}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[0.4rem] bg-[#F05A28] text-[#FAF8F5] font-mono text-xs uppercase cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Tambah Block</span>
          </button>
        </div>

        {/* Preview Mode Switcher */}
        <div className="flex items-center gap-1 font-mono text-[11px]">
          <button
            type="button"
            onClick={() => setPreviewMode("edit")}
            className={`px-2.5 py-1 rounded cursor-pointer ${
              previewMode === "edit" ? "bg-[#F05A28] text-[#FAF8F5]" : "opacity-70"
            }`}
          >
            Editor ({blocks.length})
          </button>
          <button
            type="button"
            onClick={() => setPreviewMode("desktop")}
            title="Desktop Preview"
            className={`p-1.5 rounded cursor-pointer ${
              previewMode === "desktop" ? "bg-[#F05A28] text-[#FAF8F5]" : "opacity-70"
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setPreviewMode("tablet")}
            title="Tablet Preview"
            className={`p-1.5 rounded cursor-pointer ${
              previewMode === "tablet" ? "bg-[#F05A28] text-[#FAF8F5]" : "opacity-70"
            }`}
          >
            <Tablet className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setPreviewMode("mobile")}
            title="Mobile Preview"
            className={`p-1.5 rounded cursor-pointer ${
              previewMode === "mobile" ? "bg-[#F05A28] text-[#FAF8F5]" : "opacity-70"
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Live Preview Canvas */}
      {previewMode !== "edit" ? (
        <div className="py-4 flex justify-center bg-[#000000]/5 dark:bg-[#FAF8F5]/5 rounded-[0.5rem] overflow-x-auto">
          <div
            className={`dotted-canvas p-6 border border-[#000000]/15 dark:border-[#FAF8F5]/15 transition-all ${
              previewMode === "mobile"
                ? "w-[375px]"
                : previewMode === "tablet"
                ? "w-[768px]"
                : "w-full max-w-4xl"
            }`}
          >
            <CaseStudyBlockRenderer blocks={blocks} isPreview />
          </div>
        </div>
      ) : (
        /* Block Editor List */
        <div className="space-y-3">
          {blocks.length === 0 && (
            <p className="font-mono text-xs opacity-60 py-6 text-center">
              Belum ada block. Pilih tipe block di atas dan klik &ldquo;Tambah Block&rdquo;.
            </p>
          )}
          {blocks.map((block, idx) => (
            <div
              key={block.id}
              className={`p-4 rounded-[0.5rem] border border-[#000000]/15 dark:border-[#FAF8F5]/15 space-y-3 ${
                block.visible === false ? "opacity-55" : ""
              }`}
            >
              {/* Block Header */}
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-mono text-[11px] uppercase px-2 py-0.5 rounded bg-[#C4D94E] text-[#000000]">
                  {idx + 1}. {BLOCK_TYPE_LABELS[block.type] || block.type}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => moveBlock(idx, -1)}
                    disabled={idx === 0}
                    title="Naik"
                    className="p-1.5 hover:bg-[#FFD4C2]/60 rounded disabled:opacity-30 cursor-pointer"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => moveBlock(idx, 1)}
                    disabled={idx === blocks.length - 1}
                    title="Turun"
                    className="p-1.5 hover:bg-[#FFD4C2]/60 rounded disabled:opacity-30 cursor-pointer"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => updateBlock(block.id, { visible: !block.visible })}
                    title={block.visible ? "Sembunyikan" : "Tampilkan"}
                    className="p-1.5 hover:bg-[#FFD4C2]/60 rounded cursor-pointer"
                  >
                    {block.visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  </button>
                  <button
                    type="button"
                    onClick={() => duplicateBlock(idx)}
                    title="Duplikasi"
                    className="p-1.5 hover:bg-[#FFD4C2]/60 rounded cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => removeBlock(block.id)}
                    title="Hapus"
                    className="p-1.5 hover:bg-rose-500/20 text-rose-500 rounded cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Block Settings Row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 font-mono text-[11px]">
                <select
                  value={block.background || "default"}
                  onChange={(e) =>
                    updateBlock(block.id, { background: e.target.value as BlockBackground })
                  }
                  className="px-2.5 py-1.5 rounded border border-[#000000]/15 dark:border-[#FAF8F5]/15 bg-transparent"
                >
                  {BACKGROUNDS.map((bg) => (
                    <option key={bg} value={bg}>
                      BG: {bg}
                    </option>
                  ))}
                </select>

                <select
                  value={block.motion || "reveal"}
                  onChange={(e) =>
                    updateBlock(block.id, { motion: e.target.value as BlockMotionPreset })
                  }
                  className="px-2.5 py-1.5 rounded border border-[#000000]/15 dark:border-[#FAF8F5]/15 bg-transparent"
                >
                  {MOTION_PRESETS.map((m) => (
                    <option key={m} value={m}>
                      Motion: {m}
                    </option>
                  ))}
                </select>

                <select
                  value={block.align || "left"}
                  onChange={(e) =>
                    updateBlock(block.id, { align: e.target.value as "left" | "center" | "right" })
                  }
                  className="px-2.5 py-1.5 rounded border border-[#000000]/15 dark:border-[#FAF8F5]/15 bg-transparent"
                >
                  <option value="left">Align: Left</option>
                  <option value="center">Align: Center</option>
                  <option value="right">Align: Right</option>
                </select>
              </div>

              {/* Title & Content */}
              <input
                type="text"
                placeholder="Judul block..."
                value={block.title || ""}
                onChange={(e) => updateBlock(block.id, { title: e.target.value })}
                className="w-full px-3 py-1.5 rounded border border-[#000000]/15 dark:border-[#FAF8F5]/15 bg-transparent text-sm"
              />

              <textarea
                rows={3}
                placeholder="Isi konten / kode / deskripsi..."
                value={block.content || ""}
                onChange={(e) => updateBlock(block.id, { content: e.target.value })}
                className="w-full px-3 py-1.5 rounded border border-[#000000]/15 dark:border-[#FAF8F5]/15 bg-transparent text-xs font-figtree"
              />

              {(block.type === "image" ||
                block.type === "full_image" ||
                block.type === "fullscreen_visual" ||
                block.type === "comparison") && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="url"
                    placeholder="URL Gambar..."
                    value={block.imageUrl || ""}
                    onChange={(e) => updateBlock(block.id, { imageUrl: e.target.value })}
                    className="px-3 py-1.5 rounded border border-[#000000]/15 dark:border-[#FAF8F5]/15 bg-transparent text-xs font-mono"
                  />
                  {block.type === "comparison" && (
                    <input
                      type="url"
                      placeholder="URL Gambar Kedua (After)..."
                      value={block.secondaryImageUrl || ""}
                      onChange={(e) =>
                        updateBlock(block.id, { secondaryImageUrl: e.target.value })
                      }
                      className="px-3 py-1.5 rounded border border-[#000000]/15 dark:border-[#FAF8F5]/15 bg-transparent text-xs font-mono"
                    />
                  )}
                </div>
              )}

              {block.type === "video" && (
                <input
                  type="url"
                  placeholder="URL Embed Video (YouTube / Vimeo)..."
                  value={block.videoUrl || ""}
                  onChange={(e) => updateBlock(block.id, { videoUrl: e.target.value })}
                  className="w-full px-3 py-1.5 rounded border border-[#000000]/15 dark:border-[#FAF8F5]/15 bg-transparent text-xs font-mono"
                />
              )}

              {block.type === "cta" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Label Tombol..."
                    value={block.ctaLabel || ""}
                    onChange={(e) => updateBlock(block.id, { ctaLabel: e.target.value })}
                    className="px-3 py-1.5 rounded border border-[#000000]/15 dark:border-[#FAF8F5]/15 bg-transparent text-xs"
                  />
                  <input
                    type="url"
                    placeholder="URL Tujuan..."
                    value={block.ctaUrl || ""}
                    onChange={(e) => updateBlock(block.id, { ctaUrl: e.target.value })}
                    className="px-3 py-1.5 rounded border border-[#000000]/15 dark:border-[#FAF8F5]/15 bg-transparent text-xs font-mono"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
