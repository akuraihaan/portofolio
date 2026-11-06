"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { saveRole, userActivation, mediaMetadata } from "@/app/actions";
import { text, type Row } from "@/lib/domain";
export function RoleManager({
  roles,
  permissions,
  mappings,
}: {
  roles: Row[];
  permissions: Row[];
  mappings: Row[];
}) {
  const [selected, setSelected] = useState<Row>({}),
    [ids, setIds] = useState<number[]>([]),
    [message, setMessage] = useState(""),
    [busy, setBusy] = useState(false);
  const router = useRouter();
  return (
    <details className="notice">
      <summary>Tambah atau sunting peran dan hak akses</summary>
      <label>
        Pilih peran
        <select
          onChange={(e) => {
            const row = roles.find((r) => text(r.id) === e.target.value) || {};
            setSelected(row);
            setIds(
              mappings
                .filter((m) => m.role_id === row.id)
                .map((m) => Number(m.permission_id)),
            );
          }}
        >
          <option value="">Peran baru</option>
          {roles.map((r) => (
            <option key={text(r.id)} value={text(r.id)}>
              {text(r.label || r.name)}
            </option>
          ))}
        </select>
      </label>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          if (!window.confirm("Simpan perubahan peran dan hak akses ini?"))
            return;
          setBusy(true);
          try {
            const result = await saveRole({
              id: selected.id ? Number(selected.id) : undefined,
              name: text(selected.name),
              label: text(selected.label),
              description: text(selected.description),
              permissions: ids,
            });
            setMessage(result.error || "Peran berhasil disimpan.");
            router.refresh();
          } finally {
            setBusy(false);
          }
        }}
      >
        {["name", "label", "description"].map((k) => (
          <label key={k}>
            {
              (
                {
                  name: "Nama internal",
                  label: "Label",
                  description: "Keterangan",
                } as Record<string, string>
              )[k]
            }
            <input
              required={k !== "description"}
              value={text(selected[k])}
              onChange={(e) =>
                setSelected({ ...selected, [k]: e.target.value })
              }
            />
          </label>
        ))}
        <div className="relation-list">
          {permissions.map((p) => (
            <label key={text(p.id)}>
              <input
                type="checkbox"
                checked={ids.includes(Number(p.id))}
                onChange={(e) =>
                  setIds(
                    e.target.checked
                      ? [...ids, Number(p.id)]
                      : ids.filter((id) => id !== Number(p.id)),
                  )
                }
              />
              {text(p.key)}
            </label>
          ))}
        </div>
        <button disabled={busy}>Simpan peran</button>
        <p role="status">{message}</p>
      </form>
    </details>
  );
}
export function AccountStatus({ id, active }: { id: string; active: boolean }) {
  const [message, setMessage] = useState(""),
    [busy, setBusy] = useState(false);
  const router = useRouter();
  return (
    <>
      <button
        disabled={busy}
        onClick={async () => {
          if (
            !window.confirm(
              active ? "Nonaktifkan akun ini?" : "Aktifkan akun ini?",
            )
          )
            return;
          setBusy(true);
          try {
            const r = await userActivation(id, !active);
            setMessage(r.error || "Status tersimpan.");
            router.refresh();
          } finally {
            setBusy(false);
          }
        }}
      >
        {active ? "Nonaktifkan akun" : "Aktifkan akun"}
      </button>
      <p role="status">{message}</p>
    </>
  );
}
export function MediaMetadata({ row }: { row: Row }) {
  const [message, setMessage] = useState(""),
    [busy, setBusy] = useState(false);
  return (
    <details>
      <summary>Sunting metadata</summary>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          const data = new FormData(e.currentTarget);
          setBusy(true);
          try {
            const r = await mediaMetadata(
              text(row.id),
              String(data.get("alt")),
              String(data.get("name")),
            );
            setMessage(r.error || "Metadata tersimpan.");
          } finally {
            setBusy(false);
          }
        }}
      >
        <label>
          Nama file
          <input name="name" defaultValue={text(row.file_name)} required />
        </label>
        <label>
          Deskripsi aksesibel
          <textarea name="alt" defaultValue={text(row.alt_text)} />
        </label>
        <button disabled={busy}>Simpan metadata</button>
        <p role="status">{message}</p>
      </form>
    </details>
  );
}
