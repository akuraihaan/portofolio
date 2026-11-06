import "server-only";
import { validateContact } from "./domain";
import { publicClient } from "./supabase/server";
export async function submitContact(input: Record<string, unknown>) {
  const { data, errors } = validateContact(input);
  if (Object.keys(errors).length)
    return { status: 422, body: { error: "Periksa isian.", fields: errors } };
  if (!/^[\da-f-]{36}$/i.test(String(input.submissionId)))
    return {
      status: 422,
      body: { error: "Identitas pengiriman tidak valid." },
    };
  try {
    const client = publicClient();
    const { error } = await client.rpc("cms_submit_contact", {
      p_name: data.name,
      p_email: data.email,
      p_subject: data.subject,
      p_message: data.message,
      p_submission_id: input.submissionId,
    });
    if (error)
      return {
        status: error.code === "P0001" ? 429 : 503,
        body: {
          error:
            error.code === "P0001"
              ? "Batas pengiriman tercapai. Tunggu 15 menit sebelum mencoba lagi; isian Anda tetap tersedia."
              : "Pesan belum tersimpan. Silakan coba lagi.",
        },
      };
    return { status: 201, body: { ok: true } };
  } catch {
    return { status: 503, body: { error: "Layanan pesan belum tersedia." } };
  }
}
