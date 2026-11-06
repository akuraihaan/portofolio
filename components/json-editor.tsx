"use client";
import { useState } from "react";
import type { Json } from "@/lib/domain";
export function JsonEditor({
  value,
  onChange,
  label = "Nilai",
}: {
  value: Json;
  onChange: (value: Json) => void;
  label?: string;
}) {
  const [newKey, setNewKey] = useState("");
  if (Array.isArray(value))
    return (
      <div className="json-node">
        {value.map((item, i) => (
          <div className="json-entry" key={i}>
            <JsonEditor
              value={item}
              onChange={(v) => onChange(value.map((x, j) => (j === i ? v : x)))}
              label={label + " " + (i + 1)}
            />
            <button
              type="button"
              onClick={() => onChange(value.filter((_, j) => i !== j))}
            >
              Hapus item {i + 1}
            </button>
          </div>
        ))}
        <div className="actions">
          <button type="button" onClick={() => onChange([...value, ""])}>
            Tambah teks
          </button>
          <button type="button" onClick={() => onChange([...value, {}])}>
            Tambah kelompok
          </button>
        </div>
      </div>
    );
  if (value !== null && typeof value === "object")
    return (
      <div className="json-node">
        {Object.entries(value).map(([key, item]) => (
          <div key={key}>
            <JsonEditor
              value={item}
              label={key.replaceAll("_", " ")}
              onChange={(v) => onChange({ ...value, [key]: v })}
            />
            <button
              type="button"
              onClick={() =>
                onChange(
                  Object.fromEntries(
                    Object.entries(value).filter(([k]) => k !== key),
                  ),
                )
              }
            >
              Hapus {key}
            </button>
          </div>
        ))}
        <label>
          Nama informasi baru
          <input
            value={newKey}
            onChange={(e) => setNewKey(e.target.value)}
            placeholder="contoh: lokasi"
          />
        </label>
        <div className="actions">
          {[
            ["Teks", ""],
            ["Daftar", []],
            ["Kelompok", {}],
          ].map(([name, initial]) => (
            <button
              type="button"
              key={String(name)}
              disabled={!newKey.trim() || Object.hasOwn(value, newKey.trim())}
              onClick={() => {
                onChange({ ...value, [newKey.trim()]: initial as Json });
                setNewKey("");
              }}
            >
              {String(name)}
            </button>
          ))}
        </div>
      </div>
    );
  return (
    <label>
      {label}
      {typeof value === "boolean" ? (
        <input
          type="checkbox"
          checked={value}
          onChange={(e) => onChange(e.target.checked)}
        />
      ) : typeof value === "number" ? (
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
        />
      ) : (
        <textarea
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
    </label>
  );
}
