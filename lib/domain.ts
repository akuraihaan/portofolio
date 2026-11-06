export type Json =
  string | number | boolean | null | Json[] | { [key: string]: Json };
export type Row = { [key: string]: Json | undefined };
export type FieldType =
  | "text"
  | "textarea"
  | "number"
  | "date"
  | "url"
  | "email"
  | "boolean"
  | "tags"
  | "image"
  | "file"
  | "json"
  | "select"
  | "relation";
export type Field = {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  options?: string[];
  table?: string;
  group?: string;
};
export type Module = {
  table: string;
  label: string;
  permission: string;
  view: string;
  fields: Field[];
  public?: boolean;
  status?: string;
  readOnly?: boolean;
};
const f = (
  name: string,
  label: string,
  type: FieldType = "text",
  required = false,
  options?: string[],
): Field => ({ name, label, type, required, options });
const publication = [
  f("sort_order", "Urutan", "number"),
  f("is_featured", "Unggulan", "boolean"),
];
const seo = [
  f("seo_title", "Judul pencarian"),
  f("meta_description", "Deskripsi pencarian", "textarea"),
  f("og_image_url", "Gambar berbagi", "image"),
];
const projectFields = [
  f("title", "Judul", "text", true),
  f("slug", "Alamat halaman", "text", true),
  f("category", "Kategori"),
  f("summary", "Ringkasan", "textarea"),
  f("description", "Deskripsi", "textarea"),
  f("role", "Peran"),
  f("client", "Klien / institusi"),
  f("project_year", "Tahun"),
  f("duration", "Durasi"),
  f("technologies", "Teknologi (satu per baris)", "tags"),
  f("cover_url", "Cover", "image"),
  f("thumbnail_url", "Thumbnail", "image"),
  f("project_url", "Demo", "url"),
  f("repository_url", "Repository", "url"),
  f("figma_url", "Figma", "url"),
  f("documentation_url", "Dokumentasi", "url"),
  f("video_url", "Video", "file"),
  f("start_date", "Tanggal mulai", "date"),
  f("completion_date", "Tanggal selesai", "date"),
  f("extra_links", "Tautan tambahan", "json"),
  f("case_study", "Struktur studi kasus lengkap", "json"),
  ...[
    "background",
    "problem",
    "goal",
    "contribution",
    "audience",
    "process",
    "features",
    "decisions",
    "solution",
    "outcome",
    "lessons",
  ].map((name) => ({
    ...f(
      `case_study.${name}`,
      (
        {
          background: "Latar belakang",
          problem: "Masalah",
          goal: "Tujuan",
          contribution: "Kontribusi pribadi",
          audience: "Pengguna",
          process: "Proses",
          features: "Fitur",
          decisions: "Keputusan",
          solution: "Solusi",
          outcome: "Hasil",
          lessons: "Refleksi",
        } as Record<string, string>
      )[name],
      "textarea",
    ),
    group: "Isi",
  })),
  ...publication,
  ...seo,
];
export const modules: Record<string, Module> = {
  translations: {
    table: "translations",
    label: "Terjemahan Inggris",
    permission: "settings.update",
    view: "settings.view",
    public: true,
    status: "status",
    fields: [
      f("title", "Judul bahasa Inggris", "text", true),
      f("slug", "Alamat halaman Inggris", "text", true),
      f("source_type", "Jenis halaman sumber", "select", true, [
        "home",
        "projects",
        "articles",
        "playground",
      ]),
      { ...f("project_id", "Sumber proyek", "relation"), table: "projects" },
      { ...f("article_id", "Sumber artikel", "relation"), table: "articles" },
      {
        ...f("playground_id", "Sumber playground", "relation"),
        table: "playground",
      },
      f("summary", "Ringkasan bahasa Inggris", "textarea"),
      f("content", "Isi bahasa Inggris (Markdown)", "textarea"),
      f("category", "Kategori bahasa Inggris"),
      f("sort_order", "Urutan", "number"),
    ],
  },
  projects: {
    table: "projects",
    label: "Proyek",
    permission: "projects.create",
    view: "projects.view",
    public: true,
    status: "status",
    fields: projectFields,
  },
  articles: {
    table: "articles",
    label: "Artikel",
    permission: "articles.create",
    view: "articles.view",
    public: true,
    status: "status",
    fields: [
      f("title", "Judul", "text", true),
      f("slug", "Alamat halaman", "text", true),
      f("category", "Kategori"),
      f("excerpt", "Ringkasan", "textarea"),
      f("content", "Isi artikel", "textarea", true),
      f("thumbnail_url", "Cover", "image"),
      f("tags", "Tag", "tags"),
      ...publication,
      ...seo,
    ],
  },
  playground: {
    table: "playground",
    label: "Playground",
    permission: "projects.create",
    view: "projects.view",
    public: true,
    status: "status",
    fields: [
      f("title", "Judul", "text", true),
      f("slug", "Alamat halaman", "text", true),
      f("category", "Kategori"),
      f("description", "Deskripsi", "textarea"),
      f("image_url", "Gambar", "image"),
      f("video_url", "Video", "file"),
      f("link_url", "Tautan eksperimen", "url"),
      f("technologies", "Teknologi", "tags"),
      ...publication,
    ],
  },
  skills: {
    table: "skills",
    label: "Keahlian",
    permission: "skills.manage",
    view: "skills.manage",
    public: true,
    status: "status",
    fields: [
      f("name", "Nama", "text", true),
      f("category", "Kategori"),
      f("description", "Deskripsi", "textarea"),
      f("level", "Tingkat (0–100)", "number"),
      f("sort_order", "Urutan", "number"),
    ],
  },
  experiences: {
    table: "experiences",
    label: "Pengalaman",
    permission: "experiences.manage",
    view: "experiences.manage",
    public: true,
    status: "status",
    fields: [
      f("company", "Organisasi", "text", true),
      f("role_title", "Posisi", "text", true),
      f("experience_type", "Jenis"),
      f("location", "Lokasi"),
      f("start_date", "Mulai", "date"),
      f("end_date", "Selesai", "date"),
      f("is_current", "Masih berlangsung", "boolean"),
      f("description", "Deskripsi", "textarea"),
      f("responsibilities", "Tanggung jawab", "tags"),
      f("achievements", "Pencapaian", "tags"),
      f("organization_url", "Website", "url"),
      f("logo_url", "Logo", "image"),
      f("sort_order", "Urutan", "number"),
    ],
  },
  educations: {
    table: "educations",
    label: "Pendidikan",
    permission: "educations.manage",
    view: "educations.manage",
    public: true,
    status: "status",
    fields: [
      f("institution", "Institusi", "text", true),
      f("degree", "Jenjang"),
      f("field_of_study", "Program studi"),
      f("location", "Lokasi"),
      f("start_date", "Mulai", "date"),
      f("end_date", "Selesai", "date"),
      f("is_current", "Masih berlangsung", "boolean"),
      f("description", "Deskripsi", "textarea"),
      f("related_achievements", "Pencapaian", "tags"),
      f("logo_url", "Logo", "image"),
      ...publication,
    ],
  },
  certificates: {
    table: "certificates",
    label: "Sertifikasi",
    permission: "certificates.manage",
    view: "certificates.manage",
    public: true,
    status: "status",
    fields: [
      f("title", "Nama sertifikat", "text", true),
      f("issuer", "Penerbit"),
      f("issue_date", "Diterbitkan", "date"),
      f("expiry_date", "Berlaku sampai", "date"),
      f("credential_id", "Nomor kredensial"),
      f("credential_url", "URL kredensial", "url"),
      f("certificate_url", "Gambar", "image"),
      f("file_url", "Dokumen PDF", "file"),
      f("description", "Deskripsi", "textarea"),
      f("sort_order", "Urutan", "number"),
    ],
  },
  achievements: {
    table: "achievements",
    label: "Prestasi",
    permission: "achievements.manage",
    view: "achievements.manage",
    public: true,
    status: "status",
    fields: [
      f("title", "Nama kegiatan", "text", true),
      f("organizer", "Penyelenggara"),
      f("result", "Hasil"),
      f("achievement_date", "Tanggal", "date"),
      f("description", "Deskripsi", "textarea"),
      f("image_url", "Gambar bukti", "image"),
      f("document_url", "Dokumen", "file"),
      f("link_url", "Tautan", "url"),
      ...publication,
    ],
  },
  services: {
    table: "services",
    label: "Layanan & kolaborasi",
    permission: "services.manage",
    view: "services.manage",
    public: true,
    status: "status",
    fields: [
      f("title", "Bidang", "text", true),
      f("slug", "Alamat", "text", true),
      f("description", "Deskripsi", "textarea"),
      f("features", "Cakupan", "tags"),
      f("price_label", "Informasi biaya"),
      f("cta_label", "Label tindakan"),
      f("cta_url", "Tujuan tindakan", "url"),
      f("icon_url", "Gambar", "image"),
      ...publication,
    ],
  },
  testimonials: {
    table: "testimonials",
    label: "Testimoni",
    permission: "testimonials.manage",
    view: "testimonials.manage",
    public: true,
    status: "status",
    fields: [
      f("author_name", "Nama", "text", true),
      f("author_role", "Peran"),
      f("company", "Organisasi"),
      f("quote", "Pernyataan", "textarea", true),
      f(
        "publication_consent",
        "Sudah mendapat izin publikasi dari pemberi testimoni",
        "boolean",
      ),
      f("avatar_url", "Foto", "image"),
      f("rating", "Penilaian (1–5)", "number"),
      ...publication,
    ],
  },
  profile: {
    table: "profiles",
    label: "Profil",
    permission: "users.update",
    view: "users.update",
    public: true,
    status: "is_active",
    fields: [
      f("full_name", "Nama lengkap"),
      f("username", "Username"),
      f("bio", "Bio", "textarea"),
      f("phone", "Telepon publik"),
      f("avatar_url", "Foto profil", "image"),
    ],
  },
  sections: {
    table: "page_sections",
    label: "Bagian halaman",
    permission: "settings.update",
    view: "settings.view",
    public: true,
    status: "is_visible",
    fields: [
      f("section_key", "Bagian / anchor", "text", true),
      f("section_name", "Nama bagian", "text", true),
      f("title", "Headline"),
      f("eyebrow", "Label"),
      f("subtitle", "Subjudul"),
      f("description", "Deskripsi", "textarea"),
      f("badge_text", "Label status"),
      f("primary_button_label", "Label CTA utama"),
      f("primary_button_url", "Tujuan CTA utama", "url"),
      f("secondary_button_label", "Label CTA kedua"),
      f("secondary_button_url", "Tujuan CTA kedua", "url"),
      f("image_url", "Gambar pendukung", "image"),
      f("custom_data", "Informasi tambahan", "json"),
      f("custom_data.roles", "Bidang (satu per baris)", "tags"),
      f(
        "custom_data.availability_status",
        "Status ketersediaan (kosongkan untuk menyembunyikan)",
      ),
      f("custom_data.resume_label", "Label tautan CV"),
      f("sort_order", "Urutan", "number"),
    ],
  },
  navigation: {
    table: "navigation_items",
    label: "Navigasi",
    permission: "settings.update",
    view: "settings.view",
    public: true,
    status: "is_visible",
    fields: [
      f("label", "Label", "text", true),
      f("href", "Tujuan", "url", true),
      f("section_key", "Bagian terkait"),
      f("target", "Buka", "select", false, ["_self", "_blank"]),
      f("sort_order", "Urutan", "number"),
    ],
  },
  social_links: {
    table: "social_links",
    label: "Media sosial",
    permission: "social_links.manage",
    view: "social_links.manage",
    public: true,
    status: "is_active",
    fields: [
      f("platform", "Platform", "text", true),
      f("label", "Label", "text", true),
      f("url", "Alamat", "url", true),
      f("show_in_hero", "Tampilkan di hero", "boolean"),
      f("show_in_contact", "Tampilkan di kontak", "boolean"),
      f("show_in_footer", "Tampilkan di footer", "boolean"),
      f("open_in_new_tab", "Buka tab baru", "boolean"),
      f("sort_order", "Urutan", "number"),
    ],
  },
  settings: {
    table: "site_settings",
    label: "Pengaturan situs",
    permission: "settings.update",
    view: "settings.view",
    public: true,
    status: "is_public",
    fields: [
      f("key", "Kunci pengaturan", "text", true),
      f("group_name", "Kelompok"),
      f("value", "Nilai", "json"),
      f("is_public", "Boleh dibaca publik", "boolean"),
      f("description", "Keterangan", "textarea"),
      f("asset_url", "Media", "file"),
      f("hero_image_url", "Gambar hero", "image"),
      f("resume_url", "CV", "file"),
    ],
  },
  statistics: {
    table: "statistics",
    label: "Statistik",
    permission: "settings.update",
    view: "settings.view",
    public: true,
    status: "is_visible",
    fields: [
      f("label", "Label", "text", true),
      f("value", "Nilai"),
      f("suffix", "Satuan"),
      f("source_type", "Sumber", "select", false, ["manual", "count"]),
      f("source_table", "Tabel sumber", "select", false, [
        "projects",
        "skills",
        "experiences",
        "certificates",
        "articles",
        "achievements",
      ]),
      f("sort_order", "Urutan", "number"),
    ],
  },
  project_media: {
    table: "project_media",
    label: "Galeri proyek",
    permission: "projects.create",
    view: "projects.view",
    public: true,
    fields: [
      { ...f("project_id", "Proyek", "relation", true), table: "projects" },
      f("media_url", "Gambar galeri", "image", true),
      f("alt_text", "Deskripsi aksesibel"),
      f("caption", "Keterangan"),
      f("sort_order", "Urutan", "number"),
    ],
  },
  portfolio_versions: {
    table: "portfolio_versions",
    label: "Portfolio Versions",
    permission: "settings.update",
    view: "settings.view",
    public: true,
    status: "visibility",
    fields: [
      f("title", "Judul versi", "text", true),
      f("slug", "Alamat versi", "text", true),
      f("portfolio_type", "Bidang", "select", false, [
        "general",
        "web",
        "uiux",
        "educational",
        "cloud",
        "custom",
      ]),
      f("description", "Deskripsi", "textarea"),
      f("language", "Bahasa", "select", false, ["id", "en"]),
      f("theme", "Tampilan", "select", false, [
        "editorial",
        "extra",
        "light",
        "dark",
      ]),
      ...[
        "projects",
        "skills",
        "experiences",
        "educations",
        "certificates",
        "articles",
      ].map((table) => ({
        ...f(
          "selected_" + table,
          "Pilihan " +
            (
              {
                projects: "proyek",
                skills: "keahlian",
                experiences: "pengalaman",
                educations: "pendidikan",
                certificates: "sertifikat",
                articles: "artikel",
              } as Record<string, string>
            )[table],
          "relation",
        ),
        table,
      })),
      f("section_order", "Urutan bagian (satu per baris)", "tags"),
      f("show_photo", "Tampilkan foto", "boolean"),
      f("show_contact", "Tampilkan kontak", "boolean"),
      f("indexable", "Izinkan mesin pencari mengindeks versi ini", "boolean"),
      f("density", "Kepadatan", "select", false, ["full", "compact"]),
      f("expires_at", "Berlaku sampai", "date"),
      ...seo,
    ],
  },
  media: {
    table: "media_assets",
    label: "Pustaka media",
    permission: "media.manage",
    view: "media.manage",
    fields: [
      f("display_name", "Nama tampilan"),
      f("alt_text", "Deskripsi aksesibel"),
    ],
    readOnly: true,
  },
  messages: {
    table: "contact_messages",
    label: "Pesan",
    permission: "messages.update",
    view: "messages.view",
    fields: [],
    readOnly: true,
  },
  users: {
    table: "profiles",
    label: "Pengguna",
    permission: "users.update",
    view: "users.view",
    fields: [],
    readOnly: true,
  },
  roles: {
    table: "roles",
    label: "Peran",
    permission: "roles.manage",
    view: "roles.view",
    fields: [],
    readOnly: true,
  },
  permissions: {
    table: "permissions",
    label: "Hak akses",
    permission: "roles.manage",
    view: "permissions.view",
    fields: [],
    readOnly: true,
  },
  security: {
    table: "security_events",
    label: "Keamanan",
    permission: "security.view",
    view: "security.view",
    fields: [],
    readOnly: true,
  },
  login_history: {
    table: "login_history",
    label: "Riwayat login",
    permission: "login_history.view",
    view: "login_history.view",
    fields: [],
    readOnly: true,
  },
};
export const aliases: Record<string, string> = {
  "portfolio-versions": "portfolio_versions",
  appearance: "settings",
  seo: "settings",
  contact: "settings",
  account: "profile",
};
export const sectionAliases: Record<string, string> = {
  top: "hero",
  about_me: "about",
  profile: "about",
  skill: "skills",
  capabilities: "skills",
  work: "projects",
  featured_projects: "projects",
  portfolio: "projects",
  experience: "experiences",
  education: "educations",
  certificate: "certificates",
  credentials: "certificates",
  notes: "articles",
  article: "articles",
  service: "services",
  testimonial: "testimonials",
  cta: "contact",
};
export const anchor = (key: string) =>
  (
    ({
      skills: "capabilities",
      projects: "work",
      experiences: "experience",
      educations: "education",
      certificates: "credentials",
      articles: "notes",
    }) as Record<string, string>
  )[sectionAliases[key] || key] ||
  sectionAliases[key] ||
  key;
export const text = (value: Json | undefined): string =>
  typeof value === "string" || typeof value === "number" ? String(value) : "";
export const array = (value: Json | undefined): Json[] =>
  Array.isArray(value) ? value : [];
export const object = (value: Json | undefined): Row =>
  value && typeof value === "object" && !Array.isArray(value) ? value : {};
export const strings = (value: Json | undefined): string[] =>
  Array.isArray(value)
    ? value.map(text).filter(Boolean)
    : text(value)
        .split(/\n|,/)
        .map((s) => s.trim())
        .filter(Boolean);
export const titleOf = (row: Row) =>
  text(
    row.title ??
      row.full_name ??
      row.name ??
      row.label ??
      row.institution ??
      row.company ??
      row.author_name ??
      row.key ??
      row.file_name ??
      row.event_type,
  );
export function safeHref(value: Json | undefined): string | undefined {
  const raw = text(value).trim();
  if (!raw || raw.startsWith("//") || /[\u0000-\u001f\\]/.test(raw))
    return undefined;
  if (raw.startsWith("/") || /^#[a-zA-Z][\w-]*$/.test(raw)) return raw;
  try {
    const url = new URL(raw);
    return ["https:", "http:", "mailto:", "tel:"].includes(url.protocol)
      ? raw
      : undefined;
  } catch {
    return undefined;
  }
}
export function getPath(row: Row, path: string): Json | undefined {
  return path
    .split(".")
    .reduce<Json | undefined>((value, key) => object(value)[key], row as Json);
}
export function setPath(row: Row, path: string, value: Json) {
  const keys = path.split(".");
  let target = row;
  keys.forEach((key, i) => {
    if (i === keys.length - 1) target[key] = value;
    else {
      target[key] = { ...object(target[key]) } as Json;
      target = target[key] as Row;
    }
  });
}
export function validatePayload(moduleKey: string, input: Row) {
  const definition = modules[moduleKey];
  const errors: Record<string, string> = {};
  const payload: Row = {};
  if (!definition || definition.readOnly)
    throw new Error("Modul tidak dapat disunting.");
  for (const field of definition.fields) {
    const value = getPath(input, field.name);
    if (value === undefined) {
      if (field.required) errors[field.name] = "Wajib diisi.";
      continue;
    }
    if (field.required && !text(value).trim() && field.type !== "relation")
      errors[field.name] = "Wajib diisi.";
    if (field.type === "boolean" && typeof value !== "boolean")
      errors[field.name] = "Gunakan pilihan ya atau tidak.";
    if (
      field.type === "tags" &&
      (!Array.isArray(value) || value.some((v) => typeof v !== "string"))
    )
      errors[field.name] = "Daftar harus berisi teks.";
    if (
      field.type === "relation" &&
      field.required &&
      !text(value).trim() &&
      !array(value).length
    )
      errors[field.name] = "Wajib diisi.";
    if (
      ["image", "file"].includes(field.type) &&
      value &&
      (!/^(https?:\/\/|\/)/.test(text(value)) ||
        text(value).includes("/storage/v1/object/sign/"))
    )
      errors[field.name] =
        "Gunakan media permanen dari pustaka, bukan signed URL.";
    if (
      field.type === "number" &&
      value !== null &&
      (!Number.isFinite(Number(value)) || Number(value) < 0)
    )
      errors[field.name] = "Gunakan angka nol atau lebih.";
    if (
      ["url", "image", "file"].includes(field.type) &&
      value &&
      !safeHref(value)
    )
      errors[field.name] = "Alamat tidak valid.";
    if (field.type === "date" && value && Number.isNaN(Date.parse(text(value))))
      errors[field.name] = "Tanggal tidak valid.";
    if (field.options && value && !field.options.includes(text(value)))
      errors[field.name] = "Pilihan tidak valid.";
    if (typeof value === "string" && value.length > 100000)
      errors[field.name] = "Maksimal 100.000 karakter.";
    setPath(payload, field.name, value);
  }
  if (input.slug && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(text(input.slug)))
    errors.slug = "Gunakan huruf kecil, angka, dan tanda hubung.";
  // Preserve managed object paths supplied by the upload endpoint, never ownership fields.
  for (const field of definition.fields.filter((f) =>
    ["image", "file"].includes(f.type),
  )) {
    const path =
      field.name === "cover_url"
        ? "cover_path"
        : field.name.replace(/_url$/, "_path");
    if (typeof input[path] === "string") payload[path] = input[path];
  }
  return { payload, errors };
}
export const contactTopics = [
  "Pekerjaan",
  "Kolaborasi",
  "Pertanyaan proyek",
  "Lainnya",
];
export function validateContact(input: Record<string, unknown>) {
  const errors: Record<string, string> = {};
  const name = String(input.name || "").trim(),
    email = String(input.email || "").trim(),
    message = String(input.message || "").trim(),
    subject = String(input.subject || "").trim();
  if (name.length < 2 || name.length > 100)
    errors.name = "Nama harus 2–100 karakter.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254)
    errors.email = "Email tidak valid.";
  if (message.length < 20 || message.length > 5000)
    errors.message = "Pesan harus 20–5.000 karakter.";
  if (!contactTopics.includes(subject))
    errors.subject = "Pilih topik yang tersedia.";
  if (input.website) errors.website = "Pengiriman tidak valid.";
  return { errors, data: { name, email, message, subject } };
}
export const isPublished = (row: Row, now = Date.now()) =>
  row.status === "published" &&
  (!row.published_at || Date.parse(text(row.published_at)) <= now);
export const publicRow = (row: Row, definition: Module): Row =>
  Object.fromEntries(
    Object.entries(row).filter(
      ([key]) =>
        key === "id" ||
        key === "status" ||
        key === "published_at" ||
        key === "updated_at" ||
        key === "is_visible" ||
        key === "is_active" ||
        key === "visibility" ||
        key === "expires_at" ||
        definition.fields.some((f) => f.name.split(".")[0] === key) ||
        key.endsWith("_path") ||
        [
          "cover_image_url",
          "image_url",
          "avatar_url",
          "hero_image_url",
          "logo_url",
          "resume_url",
          "og_image_url",
        ].includes(key),
    ),
  );

export function origin(settings: Row = {}) {
  const source =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.SITE_URL ||
    text(settings.site_url || settings.canonical_url);
  try {
    return new URL(source || "http://localhost:3000").origin;
  } catch {
    return "http://localhost:3000";
  }
}
