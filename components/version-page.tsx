import QRCode from "qrcode";
import { notFound } from "next/navigation";
import { Portfolio, PublicShell } from "./portfolio";
import { SharePrint } from "./share-print";
import {
  selectVersion,
  withVersionSnapshot,
  origin,
  type Bundle,
} from "@/lib/data";
import { text, type Row } from "@/lib/domain";
export async function VersionPage({
  bundle,
  version,
  preview = false,
}: {
  bundle: Bundle;
  version: Row;
  preview?: boolean;
}) {
  const url = origin(bundle.settings) + "/portfolio/" + text(version.slug),
    qr = await QRCode.toString(url, {
      type: "svg",
      margin: 1,
      color: { dark: "#000000", light: "#fff8f1" },
    });
  const selected = selectVersion(
    preview ? bundle : await withVersionSnapshot(bundle, version),
    version,
  );
  if (!preview && !["projects","skills","experiences","educations","certificates","articles"].some(key=>selected.collections[key]?.data.length)) notFound();
  return (
    <PublicShell bundle={selected}>
      <div
        className="shell section-heading"
        lang={text(version.language) || "id"}
      >
        <p className="eyebrow">{text(version.portfolio_type)}</p>
        {preview && <p className="notice">Draf · belum diterbitkan</p>}
        <h1>{text(version.title)}</h1>
        <p>{text(version.description)}</p>
        <p>{text(selected.profile?.full_name)}</p>
        {!preview && (
          <>
            <SharePrint url={url} slug={text(version.slug)} />
            <div
              className="version-qr"
              role="img"
              aria-label="QR tautan portofolio"
              dangerouslySetInnerHTML={{ __html: qr }}
            />
            <p className="print-only">{url}</p>
          </>
        )}
      </div>
      <Portfolio bundle={selected} version={version} />
    </PublicShell>
  );
}
