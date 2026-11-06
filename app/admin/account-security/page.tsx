import { requireActor } from "@/lib/auth";
import { Mfa } from "@/components/mfa";
export default async function AccountSecurity() {
  await requireActor();
  return (
    <>
      <p className="eyebrow">Akun</p>
      <h1>Keamanan akun.</h1>
      <p>
        Aktifkan autentikasi dua langkah sebelum peluncuran penuh. Simpan akses
        pemulihan aplikasi autentikator di tempat yang aman.
      </p>
      <Mfa enroll />
    </>
  );
}
