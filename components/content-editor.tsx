"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  modules,
  text,
  strings,
  array,
  getPath,
  setPath,
  type Row,
  type Json,
  type Field,
} from "@/lib/domain";
import { saveEntry } from "@/app/actions";
import { JsonEditor } from "./json-editor";
import { MediaPicker } from "./media-picker";
import { MediaImage } from "./media";
export function ContentEditor({
  moduleKey,
  id,
  initial,
  revisionAt,
  relations,
  media,
}: {
  moduleKey: string;
  id: string;
  initial: Row;
  revisionAt?: string;
  relations: Record<string, Row[]>;
  media: Row[];
}) {
  const definition = modules[moduleKey],
    router = useRouter(),
    [value, setValue] = useState(initial),
    [dirty, setDirty] = useState(false),
    [busy, setBusy] = useState(false),
    [message, setMessage] = useState(""),
    [errors, setErrors] = useState<Record<string, string>>({}),
    [expected, setExpected] = useState(revisionAt);
  useEffect(() => {
    function leave(e: BeforeUnloadEvent) {
      if (dirty) {
        e.preventDefault();
        e.returnValue = "";
      }
    }
    window.addEventListener("beforeunload", leave);
    function navigate(event: MouseEvent) {
      const link = (event.target as Element)?.closest("a[href]");
      if (
        dirty &&
        link &&
        !link.getAttribute("href")?.startsWith("#") &&
        !window.confirm(
          "Ada perubahan yang belum disimpan. Tinggalkan halaman dan buang perubahan?",
        )
      ) {
        event.preventDefault();
        event.stopPropagation();
      }
    }
    document.addEventListener("click", navigate, true);
    return () => {
      window.removeEventListener("beforeunload", leave);
      document.removeEventListener("click", navigate, true);
    };
  }, [dirty]);
  function change(path: string, next: Json) {
    setValue((old) => {
      const copy = structuredClone(old);
      setPath(copy, path, next);
      const slugify = (input: string) =>
        input
          .normalize("NFKD")
          .replace(/[\u0300-\u036f]/g, "")
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, "");
      if (
        (path === "title" || path === "name") &&
        !initial.slug &&
        (!old.slug || old.slug === slugify(text(old[path]))) &&
        definition.fields.some((field) => field.name === "slug")
      )
        copy.slug = slugify(text(next));
      if (
        definition.fields.some(
          (field) =>
            field.name === path && ["image", "file"].includes(field.type),
        )
      )
        setPath(copy, path.replace(/_url$/, "_path"), "");
      return copy;
    });
    setDirty(true);
  }
  const groupOf = (field: Field) =>
    field.group ||
    (["image", "file"].includes(field.type)
      ? "Media"
      : /sort_order|featured|seo_|meta_description|slug|expires_at|is_public/.test(
            field.name,
          )
        ? "Publikasi"
        : ["textarea", "json"].includes(field.type)
          ? "Isi"
          : "Informasi");
  async function save(
    intent: "draft" | "publish" | "hide" | "delete",
    preview = false,
  ) {
    if (busy) return;
    if (
      (intent === "delete" || intent === "hide" || intent === "publish") &&
      !window.confirm(
        intent === "delete"
          ? "Pindahkan konten ini ke tempat sampah selama 30 hari? Konten akan hilang dari publik."
          : intent === "hide"
            ? "Sembunyikan konten dari publik?"
            : "Terbitkan perubahan ini ke situs publik?",
      )
    )
      return;
    setBusy(true);
    setMessage("");
    try {
      const result = await saveEntry(moduleKey, id, value, intent, expected);
      if (result.error) {
        if (result.updatedAt) setExpected(result.updatedAt);
        setMessage(result.error);
        setErrors(result.fields || {});
        const first = Object.keys(result.fields || {})[0];
        if (first)
          requestAnimationFrame(() =>
            document.getElementById("field-" + first)?.focus(),
          );
        return;
      }
      setDirty(false);
      setErrors({});
      setExpected(result.updatedAt);
      setMessage(
        intent === "draft"
          ? "Revisi privat tersimpan. Situs publik belum berubah."
          : "Perubahan berhasil disimpan.",
      );
      if (intent === "delete") {
        router.push("/admin/" + moduleKey);
        router.refresh();
      } else if (preview) router.push("/preview/" + moduleKey + "/" + id);
      else {
        router.replace("/admin/" + moduleKey + "/" + id);
        router.refresh();
      }
    } catch {
      setMessage(
        "Operasi gagal. Perubahan lokal masih tersedia; coba kembali.",
      );
    } finally {
      setBusy(false);
    }
  }
  return (
    <>
      <p className="eyebrow">
        {definition.label} /{" "}
        {initial.status === "published" || initial.visibility === "published"
          ? "Konten terbit"
          : "Konten"}
      </p>
      <h1>
        {text(value.title || value.name || value.full_name) || "Konten baru."}
      </h1>
      <Link href={"/admin/" + moduleKey}>← Kembali ke daftar</Link>
      {initial.id && (
        <Link href={"/admin/history?module=" + moduleKey + "&id=" + id}>
          Riwayat revisi ↗
        </Link>
      )}
      <p className="notice">
        {dirty
          ? "Ada perubahan yang belum disimpan."
          : "Simpan draft untuk membuat revisi privat. Terbitkan untuk memperbarui situs."}
      </p>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          void save("draft");
        }}
      >
        {["Informasi", "Media", "Isi", "Publikasi"].map((group) => (
          <fieldset className="editor-group" key={group}>
            <legend>{group}</legend>
            <div className="editor-fields">
              {definition.fields
                .filter((field) => groupOf(field) === group)
                .map((field) => {
                  const v = getPath(value, field.name),
                    fieldId = "field-" + field.name;
                  return (
                    <div
                      className={
                        "editor-field " +
                        ([
                          "textarea",
                          "json",
                          "relation",
                          "image",
                          "file",
                        ].includes(field.type)
                          ? "wide"
                          : "")
                      }
                      key={field.name}
                    >
                      <label htmlFor={fieldId}>
                        {field.label}
                        {field.required ? " *" : ""}
                      </label>
                      {field.type === "json" ? (
                        <JsonEditor
                          value={v ?? {}}
                          onChange={(next) => change(field.name, next)}
                          label={field.label}
                        />
                      ) : field.type === "relation" ? (
                        <div className="relation-list">
                          {!field.required &&
                            [
                              "project_id",
                              "article_id",
                              "playground_id",
                            ].includes(field.name) && (
                              <button
                                type="button"
                                onClick={() => change(field.name, null)}
                              >
                                Kosongkan pilihan
                              </button>
                            )}
                          {(relations[field.table || ""] || []).map((row) => (
                            <label key={text(row.id)}>
                              <input
                                type={
                                  [
                                    "project_id",
                                    "article_id",
                                    "playground_id",
                                  ].includes(field.name)
                                    ? "radio"
                                    : "checkbox"
                                }
                                name={field.name}
                                checked={
                                  [
                                    "project_id",
                                    "article_id",
                                    "playground_id",
                                  ].includes(field.name)
                                    ? v === row.id
                                    : array(v).includes(text(row.id))
                                }
                                onChange={(e) =>
                                  change(
                                    field.name,
                                    [
                                      "project_id",
                                      "article_id",
                                      "playground_id",
                                    ].includes(field.name)
                                      ? text(row.id)
                                      : e.target.checked
                                        ? [...array(v), text(row.id)]
                                        : array(v).filter((x) => x !== row.id),
                                  )
                                }
                              />
                              {text(
                                row.title ||
                                  row.name ||
                                  row.company ||
                                  row.institution,
                              )}
                            </label>
                          ))}
                        </div>
                      ) : field.type === "boolean" ? (
                        <input
                          id={fieldId}
                          type="checkbox"
                          checked={v === true}
                          onChange={(e) => change(field.name, e.target.checked)}
                        />
                      ) : field.type === "select" ? (
                        <select
                          id={fieldId}
                          value={text(v)}
                          onChange={(e) => change(field.name, e.target.value)}
                        >
                          <option value="">Pilih…</option>
                          {field.options?.map((o) => (
                            <option key={o}>{o}</option>
                          ))}
                        </select>
                      ) : ["textarea", "tags"].includes(field.type) ? (
                        <textarea
                          id={fieldId}
                          value={
                            field.type === "tags"
                              ? strings(v).join("\n")
                              : text(v)
                          }
                          onChange={(e) =>
                            change(
                              field.name,
                              field.type === "tags"
                                ? e.target.value.split("\n")
                                : e.target.value,
                            )
                          }
                          aria-invalid={!!errors[field.name]}
                          aria-describedby={
                            errors[field.name] ? fieldId + "-error" : undefined
                          }
                        />
                      ) : (
                        <input
                          id={fieldId}
                          type={
                            ["number", "date", "email"].includes(field.type)
                              ? field.type
                              : "text"
                          }
                          value={text(v)}
                          onChange={(e) =>
                            change(
                              field.name,
                              field.type === "number"
                                ? e.target.value === ""
                                  ? null
                                  : Number(e.target.value)
                                : field.type === "date"
                                  ? e.target.value || null
                                  : e.target.value,
                            )
                          }
                          aria-invalid={!!errors[field.name]}
                          aria-describedby={
                            errors[field.name] ? fieldId + "-error" : undefined
                          }
                        />
                      )}{" "}
                      {["image", "file"].includes(field.type) && (
                        <>
                          {field.type === "image" && text(v) && (
                            <MediaImage
                              src={text(v)}
                              alt={field.label}
                              contain
                            />
                          )}
                          <MediaPicker
                            rows={media}
                            onPick={(url, path) => {
                              change(field.name, url);
                              change(
                                field.name.replace(/_url$/, "_path"),
                                path,
                              );
                            }}
                          />
                        </>
                      )}
                      {errors[field.name] && (
                        <p className="field-error" id={fieldId + "-error"}>
                          {errors[field.name]}
                        </p>
                      )}
                    </div>
                  );
                })}
            </div>
          </fieldset>
        ))}
        <p role="status">{message}</p>
        <div className="editor-actions">
          <button disabled={busy} type="submit">
            {busy ? "Memproses…" : "Simpan draft"}
          </button>
          <button
            disabled={busy}
            type="button"
            onClick={() => save("draft", true)}
          >
            Simpan & preview
          </button>
          <button disabled={busy} type="button" onClick={() => save("publish")}>
            Terbitkan
          </button>
          {definition.status && (
            <button disabled={busy} type="button" onClick={() => save("hide")}>
              Sembunyikan
            </button>
          )}
          <button
            disabled={busy || moduleKey === "profile"}
            type="button"
            onClick={() => save("delete")}
          >
            Hapus
          </button>
        </div>
      </form>
    </>
  );
}
