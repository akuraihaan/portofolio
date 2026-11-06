"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { assignRole, updateMessage, saveMessageNotes, deleteMessage } from "@/app/actions";
import { text, type Row } from "@/lib/domain";
import { MediaPicker } from "./media-picker";
export function InboxStatus({ id, status, email, notes = "" }: { id: string; status: string; email?: string; notes?: string }) {
  const [message, setMessage] = useState(""),
    [note, setNote] = useState(notes),
    [pending, setPending] = useState(false);
  const router = useRouter();
  return (
    <div>
      <select
        aria-label="Status pesan"
        value={status}
        disabled={pending}
        onChange={async (e) => {
          setPending(true);
          try {
            const result = await updateMessage(id, e.target.value);
            setMessage(result.error || "Status tersimpan.");
            router.refresh();
          } finally {
            setPending(false);
          }
        }}
      >
        {["unread", "read", "followed_up", "archived"].map((s) => (
          <option key={s} value={s}>
            {
              (
                {
                  unread: "Baru",
                  read: "Dibaca",
                  followed_up: "Ditindaklanjuti",
                  archived: "Arsip",
                } as Record<string, string>
              )[s]
            }
          </option>
        ))}
      </select>
      <label>Catatan internal<textarea value={note} onChange={event=>setNote(event.target.value)} maxLength={5000} rows={3}/></label>
      <div className="actions"><button disabled={pending} onClick={async()=>{setPending(true);try{const result=await saveMessageNotes(id,note);setMessage(result.error || "Catatan tersimpan.");router.refresh();}finally{setPending(false);}}}>Simpan catatan</button>
      {email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && <a className="pill" href={"mailto:"+encodeURIComponent(email)}>Balas melalui email ↗</a>}
      <button disabled={pending} onClick={async()=>{if(!window.confirm("Hapus pesan ini secara permanen? Isi pesan dan catatan tidak dapat dipulihkan.")) return;setPending(true);try{const result=await deleteMessage(id);setMessage(result.error || "Pesan dihapus.");router.refresh();}finally{setPending(false);}}}>Hapus pesan</button></div>
      <p role="status">{message}</p>
    </div>
  );
}
export function RoleEditor({
  userId,
  roles,
  assigned,
}: {
  userId: string;
  roles: Row[];
  assigned: string[];
}) {
  const [message, setMessage] = useState(""),
    [pending, setPending] = useState(false);
  const router = useRouter();
  return (
    <div>
      {roles.map((role) => (
        <label key={text(role.id)}>
          <input
            type="checkbox"
            disabled={pending}
            checked={assigned.includes(text(role.id))}
            onChange={async (e) => {
              const remove = !e.target.checked;
              if (!window.confirm("Ubah peran akun ini?")) return;
              setPending(true);
              try {
                const result = await assignRole(userId, text(role.id), remove);
                setMessage(result.error || "Peran tersimpan.");
                router.refresh();
              } finally {
                setPending(false);
              }
            }}
          />
          {text(role.name)}
        </label>
      ))}
      <p role="status">{message}</p>
    </div>
  );
}
export function UploadLibrary({ rows }: { rows: Row[] }) {
  const [message, setMessage] = useState("");
  const router = useRouter();
  return (
    <>
      <MediaPicker
        rows={rows}
        onPick={(url) => {
          setMessage("Media: " + url);
          router.refresh();
        }}
      />
      <p role="status">{message}</p>
    </>
  );
}
