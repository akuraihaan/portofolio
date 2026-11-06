"use client";
import Link from "next/link";
import { useRef, useState } from "react";
import { contactTopics, validateContact } from "@/lib/domain";
export function ContactForm() {
  const [pending, setPending] = useState(false),
    [message, setMessage] = useState(""),
    [count, setCount] = useState(0),
    [errors, setErrors] = useState<Record<string, string>>({}),
    submission = useRef<string | null>(null),
    locked = useRef(false);
  function focusError(form: HTMLFormElement, fields: Record<string, string>) {
    const field = form.elements.namedItem(Object.keys(fields)[0]);
    if (field instanceof HTMLElement) field.focus();
  }
  return (
    <form
      className="contact-form"
      noValidate
      onSubmit={async (event) => {
        event.preventDefault();
        if (locked.current) return;
        const form = event.currentTarget;
        const data = Object.fromEntries(new FormData(form));
        const checked = validateContact(data);
        setErrors(checked.errors);
        setMessage("");
        if (Object.keys(checked.errors).length) {
          focusError(form, checked.errors);
          return;
        }
        locked.current = true;
        setPending(true);
        submission.current ??= crypto.randomUUID();
        try {
          const response = await fetch("/api/contact", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...data, submissionId: submission.current }),
          });
          const result = await response.json();
          if (!response.ok) {
            setErrors(result.fields || {});
            if (result.fields) focusError(form, result.fields);
            throw new Error(
              result.error || "Pesan belum tersimpan. Silakan coba lagi.",
            );
          }
          form.reset();
          setCount(0);
          submission.current = null;
          setMessage(
            "Pesan sudah tersimpan. Terima kasih telah menghubungi saya.",
          );
        } catch (error) {
          setMessage(
            error instanceof Error
              ? error.message
              : "Jaringan tidak tersedia. Isian Anda tetap tersimpan.",
          );
        } finally {
          locked.current = false;
          setPending(false);
        }
      }}
    >
      <div className="honeypot" aria-hidden="true">
        <label>
          Website
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <div className="contact-fields">
        {[
          ["name", "Nama", "text", "Nama Anda"],
          ["email", "Email", "email", "nama@email.com"],
        ].map(([name, label, type, placeholder]) => (
          <label key={name} htmlFor={`contact-${name}`}>
            {label}
            <input
              id={`contact-${name}`}
              name={name}
              type={type}
              placeholder={placeholder}
              required
              maxLength={name === "email" ? 254 : 100}
              autoComplete={name}
              aria-invalid={!!errors[name]}
              aria-describedby={errors[name] ? `error-${name}` : undefined}
            />
            {errors[name] && (
              <span className="field-error" id={`error-${name}`}>
                {errors[name]}
              </span>
            )}
          </label>
        ))}
      </div>
      <label htmlFor="contact-subject">
        Apa yang ingin Anda bicarakan?
        <select
          id="contact-subject"
          name="subject"
          required
          defaultValue=""
          aria-invalid={!!errors.subject}
          aria-describedby={errors.subject ? "error-subject" : undefined}
        >
          <option value="" disabled>
            Pilih topik
          </option>
          {contactTopics.map((topic) => (
            <option key={topic}>{topic}</option>
          ))}
        </select>
        {errors.subject && (
          <span className="field-error" id="error-subject">
            {errors.subject}
          </span>
        )}
      </label>
      <label htmlFor="contact-message">
        Pesan
        <textarea
          id="contact-message"
          name="message"
          placeholder="Ceritakan ide, kebutuhan, atau pertanyaan Anda…"
          required
          minLength={20}
          maxLength={5000}
          rows={5}
          onChange={(event) => setCount(event.target.value.length)}
          aria-invalid={!!errors.message}
          aria-describedby="message-count error-message"
        />
        <span id="message-count" className="field-hint">
          {count.toLocaleString("id-ID")} / 5.000 karakter · minimal 20
        </span>
        <span className="field-error" id="error-message">
          {errors.message}
        </span>
      </label>
      <div className="contact-submit">
        <button disabled={pending} type="submit">
          {pending ? "Menyimpan pesan…" : "Kirim pesan ↗"}
        </button>
        <p className="field-hint">
          Data Anda digunakan untuk membalas pesan.{" "}
          <Link href="/privacy">Baca kebijakan privasi.</Link>
        </p>
      </div>
      <p role="status" aria-live="polite">
        {message}
      </p>
    </form>
  );
}
