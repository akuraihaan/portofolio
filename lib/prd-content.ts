import type { Bundle } from "./data";
import { modules, type Row } from "./domain";

// Reviewed source: PRD 1.0, 19 September 2026, section 18. This content is
// available only to an explicit local design preview or the owner's draft import.
// It is never a fallback for public database queries.
export const prdDrafts: {
  module: string;
  id: string;
  match: string;
  data: Row;
}[] = [
  {
    module: "educations",
    id: "91900000-0000-4000-8000-000000000020",
    match: "institution",
    data: {
      institution: "Universitas Lambung Mangkurat",
      field_of_study: "Pendidikan Komputer",
      description: "Lulus dari program studi Pendidikan Komputer.",
      sort_order: 0,
    },
  },
  {
    module: "sections",
    id: "91900000-0000-4000-8000-000000000021",
    match: "section_key",
    data: {
      section_key: "educations",
      section_name: "Pendidikan",
      title: "Pendidikan.",
      sort_order: 3,
    },
  },
  {
    module: "sections",
    id: "91900000-0000-4000-8000-000000000001",
    match: "section_key",
    data: {
      section_key: "hero",
      section_name: "Beranda",
      eyebrow: "Halo, saya Raihan",
      title: "Taufik Raihandani",
      subtitle: "Web & teknologi pendidikan.",
      description:
        "Saya lulusan Pendidikan Komputer Universitas Lambung Mangkurat. Saya menekuni pengembangan web, aplikasi, dan media pembelajaran interaktif.",
      primary_button_label: "Jelajahi karya",
      primary_button_url: "#work",
      secondary_button_label: "Hubungi saya",
      secondary_button_url: "#contact",
      sort_order: 0,
      custom_data: { roles: ["Web Developer", "Teknologi Pendidikan"] },
    },
  },
  {
    module: "sections",
    id: "91900000-0000-4000-8000-000000000002",
    match: "section_key",
    data: {
      section_key: "about",
      section_name: "Tentang",
      eyebrow: "Tentang saya",
      title: "Web, aplikasi, dan pembelajaran.",
      description:
        "Saya Taufik Raihandani, lulusan Pendidikan Komputer Universitas Lambung Mangkurat. Minat saya berpusat pada pengembangan web, aplikasi, dan media pembelajaran interaktif.\n\nDalam portofolio ini, saya mencatat apa yang dibuat, bagian yang saya kerjakan, dan proses pengembangannya.",
      sort_order: 1,
    },
  },
  {
    module: "sections",
    id: "91900000-0000-4000-8000-000000000003",
    match: "section_key",
    data: {
      section_key: "projects",
      section_name: "Studi Kasus",
      eyebrow: "Karya pilihan",
      title: "Proyek dan prosesnya.",
      description:
        "Pilihan proyek, proses pengembangan, dan bagian yang saya kerjakan.",
      sort_order: 2,
    },
  },
  {
    module: "projects",
    id: "91900000-0000-4000-8000-000000000011",
    match: "slug",
    data: {
      title: "Media Pembelajaran Tailwind CSS",
      slug: "media-pembelajaran-tailwind-css",
      category: "Teknologi Pendidikan",
      role: "Pengembangan web & media pembelajaran",
      summary:
        "Media pembelajaran web yang menghubungkan materi Tailwind CSS, model tutorial, dan learning analytics.",
      technologies: ["Tailwind CSS"],
      is_featured: true,
      sort_order: 0,
      case_study: {
        background:
          "Pengembangan media pembelajaran berbasis web untuk materi Tailwind CSS.",
        contribution:
          "Pengembangan web, penerapan model tutorial, serta learning analytics.",
      },
    },
  },
  {
    module: "projects",
    id: "91900000-0000-4000-8000-000000000012",
    match: "slug",
    data: {
      title: "ComBridge",
      slug: "combridge",
      category: "Cloud Computing",
      role: "Cloud Computing",
      summary:
        "Proyek kolaborasi dengan kontribusi pribadi pada Cloud Computing, bersama tim mobile dan machine learning.",
      technologies: [],
      is_featured: true,
      sort_order: 1,
      case_study: {
        background:
          "Proyek tim yang menggabungkan pekerjaan Cloud Computing, mobile, dan machine learning.",
        contribution:
          "Kontribusi pribadi berada pada bagian Cloud Computing. Pengembangan mobile dan machine learning dikerjakan anggota tim lainnya.",
      },
    },
  },
  {
    module: "sections",
    id: "91900000-0000-4000-8000-000000000004",
    match: "section_key",
    data: {
      section_key: "contact",
      section_name: "Kontak",
      eyebrow: "Mulai percakapan",
      title: "Hubungi saya.",
      description:
        "Untuk pertanyaan proyek, pekerjaan, atau kolaborasi, tuliskan kebutuhan Anda dan alamat email yang bisa dihubungi.",
      sort_order: 8,
    },
  },
];

export function prdPreviewBundle(): Bundle {
  const collections = Object.fromEntries(
    Object.keys(modules).map((key) => [
      key,
      { data: [] as Row[], error: null },
    ]),
  );
  for (const entry of prdDrafts)
    collections[entry.module].data.push({
      ...entry.data,
      id: entry.id,
      status: "published",
      is_visible: true,
    });
  collections.sections.data.sort(
    (a, b) => Number(a.sort_order) - Number(b.sort_order),
  );
  collections.navigation.data = [
    ["Beranda", "#hero"],
    ["Tentang", "#about"],
    ["Studi Kasus", "#work"],
    ["Kontak", "#contact"],
  ].map(([label, href], index) => ({ id: String(index), label, href }));
  return {
    profile: { full_name: "Taufik Raihandani" },
    settings: {
      site_name: "Taufik Raihandani",
      preview_project_base: "/design-preview/projects",
      footer_text: "© {year} Taufik Raihandani",
    },
    collections,
  };
}
