import {
  array,
  anchor,
  sectionAliases,
  text,
  modules,
  type Row,
} from "./domain";
import type { Bundle } from "./data";
export function sectionKind(row: Row) {
  const key = text(row.section_key);
  return key === "cta" ? "cta" : sectionAliases[key] || key;
}
export function sectionAnchor(row: Row) {
  return row.section_key === "cta"
    ? "collaborate"
    : row.section_key === "featured_projects"
      ? "featured-work"
      : anchor(sectionKind(row));
}
export function visibleSections(bundle: Bundle) {
  return (bundle.collections.sections?.data || []).filter((row) => {
    const kind = sectionKind(row);
    if (
      row.section_key === "featured_projects" &&
      !bundle.collections.projects?.error &&
      !bundle.collections.projects?.data.some((project) => project.is_featured)
    )
      return false;
    if (kind === "footer") return false;
    if (!modules[kind])
      return !!(
        row.title ||
        row.description ||
        row.image_url ||
        row.custom_data
      );
    const collection = bundle.collections[kind];
    return !!collection?.error || !!collection?.data.length;
  });
}

export function selectVersion(bundle: Bundle, version: Row): Bundle {
  const copy: Bundle = { ...bundle, collections: { ...bundle.collections } };
  for (const key of [
    "projects",
    "skills",
    "experiences",
    "educations",
    "certificates",
    "articles",
  ]) {
    const ids = new Set(array(version["selected_" + key]).map(text));
    copy.collections[key] = {
      ...bundle.collections[key],
      data: (bundle.collections[key]?.data || []).filter((row) =>
        ids.has(text(row.id)),
      ),
    };
  }
  const selectedSections = (bundle.collections.sections?.data || []).filter(
    (row) =>
      !["cta", "footer", "featured_projects"].includes(text(row.section_key)),
  );
  for (const key of [
    "skills",
    "projects",
    "experiences",
    "educations",
    "certificates",
    "articles",
  ]) {
    if (
      copy.collections[key]?.data.length &&
      !selectedSections.some((row) => row.section_key === key)
    )
      selectedSections.push({
        id: "version-" + key,
        section_key: key,
        title: modules[key].label,
        section_name: modules[key].label,
        is_visible: true,
      });
  }
  copy.collections.sections = {
    data: selectedSections,
    error: bundle.collections.sections?.error || null,
  };
  if (!version.show_contact) {
    copy.collections.social_links = { data: [], error: null };
    copy.settings = { ...copy.settings, owner_email: "", show_phone: false };
    copy.profile = copy.profile ? { ...copy.profile, phone: "" } : null;
    copy.collections.sections.data = copy.collections.sections.data.map(
      (row) =>
        row.section_key === "hero"
          ? {
              ...row,
              ...(text(row.primary_button_url).includes("#contact")
                ? { primary_button_url: "", primary_button_label: "" }
                : {}),
              ...(text(row.secondary_button_url).includes("#contact")
                ? { secondary_button_url: "", secondary_button_label: "" }
                : {}),
            }
          : row,
    );
  }
  return copy;
}
