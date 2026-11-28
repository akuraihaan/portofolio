/**
 * Case Study Block Schema & Normalization
 * Stored in `projects.case_study.blocks` (JSONB) in Supabase.
 * Backward-compatible with legacy flat `case_study` fields.
 */

export type CaseStudyBlockType =
  | "heading"
  | "paragraph"
  | "rich_text"
  | "image"
  | "full_image"
  | "gallery"
  | "comparison"
  | "video"
  | "overview"
  | "challenge"
  | "goals"
  | "solutions"
  | "features"
  | "design_process"
  | "dev_process"
  | "tech_stack"
  | "code_snippet"
  | "statistics"
  | "quote"
  | "timeline"
  | "two_column"
  | "three_column"
  | "image_text"
  | "fullscreen_visual"
  | "cta"
  | "related_projects";

export type BlockMotionPreset =
  | "fade"
  | "reveal"
  | "slide"
  | "scale"
  | "clip"
  | "parallax"
  | "stagger"
  | "none";

export type BlockBackground =
  | "default"
  | "orange"
  | "peach"
  | "green"
  | "blue"
  | "dark";

export interface CaseStudyBlockItem {
  label: string;
  value?: string;
  description?: string;
  imageUrl?: string;
}

export interface CaseStudyBlock {
  id: string;
  type: CaseStudyBlockType;
  visible: boolean;
  motion: BlockMotionPreset;
  align?: "left" | "center" | "right";
  background?: BlockBackground;
  title?: string;
  content?: string;
  imageUrl?: string;
  imageAlt?: string;
  secondaryImageUrl?: string;
  videoUrl?: string;
  items?: CaseStudyBlockItem[];
  ctaLabel?: string;
  ctaUrl?: string;
}

export const BLOCK_TYPE_LABELS: Record<CaseStudyBlockType, string> = {
  heading: "Heading",
  paragraph: "Paragraph",
  rich_text: "Rich Text",
  image: "Image",
  full_image: "Full-Width Image",
  gallery: "Image Gallery",
  comparison: "Image Comparison",
  video: "Video Embed",
  overview: "Project Overview",
  challenge: "Challenge",
  goals: "Goals",
  solutions: "Solutions",
  features: "Features",
  design_process: "Design Process",
  dev_process: "Development Process",
  tech_stack: "Technology Stack",
  code_snippet: "Code Snippet",
  statistics: "Statistics",
  quote: "Quote",
  timeline: "Timeline",
  two_column: "Two-Column Layout",
  three_column: "Three-Column Layout",
  image_text: "Image & Text",
  fullscreen_visual: "Fullscreen Visual",
  cta: "Call to Action",
  related_projects: "Related Projects",
};

export function createDefaultBlock(type: CaseStudyBlockType): CaseStudyBlock {
  const id = `blk_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`;
  return {
    id,
    type,
    visible: true,
    motion: "reveal",
    align: "left",
    background: type === "challenge" ? "orange" : type === "solutions" ? "peach" : "default",
    title: BLOCK_TYPE_LABELS[type],
    content: "",
    items:
      type === "statistics" || type === "timeline" || type === "two_column" || type === "three_column"
        ? [{ label: "Item 1", value: "01", description: "Deskripsi singkat" }]
        : undefined,
  };
}

/**
 * Converts legacy flat `case_study` object into structured `CaseStudyBlock[]`
 * when `case_study.blocks` is not yet defined.
 */
export function normalizeCaseStudyBlocks(
  caseStudy: Record<string, unknown> | undefined | null
): CaseStudyBlock[] {
  if (!caseStudy || typeof caseStudy !== "object") return [];

  if (Array.isArray(caseStudy.blocks) && caseStudy.blocks.length > 0) {
    return (caseStudy.blocks as CaseStudyBlock[]).filter((b) => b && b.type);
  }

  const blocks: CaseStudyBlock[] = [];
  const legacyMap: Array<{
    key: string;
    type: CaseStudyBlockType;
    title: string;
    bg: BlockBackground;
  }> = [
    { key: "background", type: "challenge", title: "Latar Belakang & Masalah", bg: "orange" },
    { key: "features", type: "features", title: "Fitur & Arsitektur", bg: "default" },
    { key: "contribution", type: "solutions", title: "Kontribusi Teknis", bg: "peach" },
    { key: "outcome", type: "overview", title: "Hasil & Dampak", bg: "default" },
    { key: "process", type: "dev_process", title: "Metodologi", bg: "default" },
  ];

  for (const entry of legacyMap) {
    const val = caseStudy[entry.key];
    if (typeof val === "string" && val.trim().length > 0) {
      blocks.push({
        id: `legacy_${entry.key}`,
        type: entry.type,
        visible: true,
        motion: "reveal",
        align: "left",
        background: entry.bg,
        title: entry.title,
        content: val.trim(),
      });
    }
  }

  return blocks;
}
