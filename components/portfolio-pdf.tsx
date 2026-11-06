import {
  Document,
  Page,
  Text,
  View,
  Link,
  Image as PdfImage,
  StyleSheet,
} from "@react-pdf/renderer";
import type { Bundle } from "@/lib/data";
import {
  text,
  strings,
  object,
  safeHref,
  titleOf,
  type Row,
} from "@/lib/domain";
const styles = StyleSheet.create({
  page: {
    padding: 54,
    paddingBottom: 68,
    fontFamily: "Helvetica",
    fontSize: 10,
    lineHeight: 1.65,
    color: "#25343b",
    backgroundColor: "#fbfaf7",
  },
  cover: {
    padding: 56,
    paddingBottom: 68,
    fontFamily: "Helvetica",
    fontSize: 10,
    lineHeight: 1.65,
    color: "#f4f0e7",
    backgroundColor: "#111a20",
  },
  coverTop: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 86 },
  coverLabel: { fontSize: 9, color: "#a8dac8", letterSpacing: 2 },
  coverPixels: { flexDirection: "row", gap: 5, alignItems: "flex-end" },
  coverPixel: { width: 9, height: 9, backgroundColor: "#a8dac8" },
  coverPixelGold: { width: 9, height: 17, backgroundColor: "#e9bd73" },
  coverPixelLavender: { width: 9, height: 13, backgroundColor: "#b9a9df" },
  label: { fontSize: 9, color: "#487c6a", letterSpacing: 1.5, marginBottom: 20 },
  title: {
    fontFamily: "Helvetica-Bold",
    fontSize: 39,
    lineHeight: 1.12,
    color: "#f4f0e7",
    marginBottom: 16,
  },
  coverRule: { width: 48, height: 3, backgroundColor: "#a8dac8", marginBottom: 26 },
  coverHeading: { fontFamily: "Helvetica-Bold", fontSize: 19, lineHeight: 1.35, color: "#e9bd73", marginBottom: 11 },
  coverParagraph: { maxWidth: 420, color: "#c0c8c8", fontSize: 11, lineHeight: 1.75, marginBottom: 23 },
  coverLink: { color: "#a8dac8", fontSize: 9, marginBottom: 8 },
  heading: { fontFamily: "Helvetica-Bold", fontSize: 16, lineHeight: 1.35, color: "#18272d", marginBottom: 7, marginTop: 20 },
  paragraph: { marginBottom: 12, color: "#35434a" },
  item: { marginBottom: 20, paddingBottom: 13, borderBottomWidth: 0.6, borderBottomColor: "#e4e2db" },
  meta: { fontSize: 8.5, color: "#65716f", marginBottom: 10, letterSpacing: 0.2 },
  sectionRule: { width: 38, height: 2, backgroundColor: "#b49bdc", marginBottom: 4 },
  footer: {
    position: "absolute",
    bottom: 26,
    left: 54,
    right: 54,
    flexDirection: "row",
    justifyContent: "space-between",
    fontSize: 8,
    color: "#74807d",
  },
  coverFooter: { color: "#a9b6b4" },
  image: { maxHeight: 230, objectFit: "contain", marginBottom: 16 },
  qr: { width: 72, height: 72, marginTop: 18 },
});
export function PortfolioPdf({
  bundle,
  version,
  url,
  qr,
  images = {},
}: {
  bundle: Bundle;
  version: Row;
  url: string;
  qr: string;
  images?: Record<string, string>;
}) {
  const labels: Record<string, string> = {
    projects: "Studi kasus",
    skills: "Keahlian",
    experiences: "Pengalaman",
    educations: "Pendidikan",
    certificates: "Sertifikasi",
    articles: "Tulisan",
    achievements: "Prestasi",
    testimonials: "Testimoni",
  };
  const order = [
    ...new Set([...strings(version.section_order), ...Object.keys(labels)]),
  ].filter((key) => labels[key] && bundle.collections[key]?.data.length);
  const owner = text(bundle.profile?.full_name);
  return (
    <Document
      title={text(version.title)}
      author={owner}
      subject={text(version.description)}
      language={text(version.language) || "id"}
    >
      <Page size="A4" style={styles.cover}>
        <View style={styles.coverTop}>
          <Text style={styles.coverLabel}>PORTOFOLIO / {text(version.portfolio_type).toUpperCase()}</Text>
          <View style={styles.coverPixels}>
            <View style={styles.coverPixel} /><View style={styles.coverPixelLavender} /><View style={styles.coverPixelGold} /><View style={styles.coverPixel} />
          </View>
        </View>
        <Text style={styles.title}>{owner}</Text>
        <View style={styles.coverRule} />
        <Text style={styles.coverHeading}>{text(version.title)}</Text>
        <Text style={styles.coverParagraph}>{text(version.description)}</Text>
        {version.show_contact && (
          <View style={styles.item}>
            {text(bundle.settings.owner_email) && (
              <Link style={styles.coverLink} src={"mailto:" + text(bundle.settings.owner_email)}>
                {text(bundle.settings.owner_email)}
              </Link>
            )}
            {(bundle.collections.social_links?.data || [])
              .filter((row) => row.show_in_contact && safeHref(row.url))
              .map((row) => (
                <Link key={text(row.id)} style={styles.coverLink} src={safeHref(row.url)!}>
                  {text(row.label)}: {text(row.url)}
                </Link>
              ))}
          </View>
        )}
        <Link style={styles.coverLink} src={url}>BUKA VERSI ONLINE</Link>
        <PdfImage src={qr} style={styles.qr} />
        <Text style={[styles.meta, { color: "#a9b6b4", marginTop: 9 }]}>
          Diekspor{" "}
          {new Date().toLocaleDateString("id-ID", {
            timeZone: "Asia/Makassar",
          })}
        </Text>
        <View style={[styles.footer, styles.coverFooter]} fixed>
          <Text>{owner}</Text>
          <Text
            render={({ pageNumber, totalPages }) =>
              `${pageNumber} / ${totalPages}`
            }
          />
        </View>
      </Page>
      {order.map((key) => (
        <Page size="A4" style={styles.page} key={key}>
          <Text style={styles.label}>{labels[key].toUpperCase()}</Text>
          <View style={styles.sectionRule} />
          {(bundle.collections[key]?.data || []).map((row) => (
            <View key={text(row.id)} style={styles.item}>
              <Text style={styles.heading} minPresenceAhead={55}>
                {titleOf(row)}
              </Text>
              <Text style={styles.meta}>
                {[
                  row.role,
                  row.role_title,
                  row.project_year,
                  row.issuer,
                  row.category,
                ]
                  .map(text)
                  .filter(Boolean)
                  .join(" / ")}
              </Text>
              {images[text(row.id)] && (
                <PdfImage src={images[text(row.id)]} style={styles.image} />
              )}
              <Text style={styles.paragraph}>
                {text(row.summary || row.description || row.excerpt || row.quote)}
              </Text>
              {strings(row.technologies).length > 0 && (
                <Text style={styles.meta}>
                  {strings(row.technologies).join(" / ")}
                </Text>
              )}
              {Object.entries(object(row.case_study))
                .filter(([, value]) => text(value))
                .map(([field, value]) => (
                  <View key={field}>
                    <Text
                      style={{ fontSize: 12, marginTop: 12, marginBottom: 5 }}
                      minPresenceAhead={35}
                    >
                      {(
                        {
                          background: "Latar belakang",
                          problem: "Masalah",
                          goal: "Tujuan",
                          contribution: "Kontribusi pribadi",
                          process: "Proses",
                          decisions: "Keputusan",
                          outcome: "Hasil",
                          lessons: "Refleksi",
                        } as Record<string, string>
                      )[field] || field.replaceAll("_", " ")}
                    </Text>
                    <Text style={styles.paragraph}>{text(value)}</Text>
                  </View>
                ))}
              {["project_url", "repository_url", "credential_url"]
                .filter((field) => safeHref(row[field]))
                .map((field) => (
                  <Link key={field} src={safeHref(row[field])!}>
                    {text(row[field])}
                  </Link>
                ))}
            </View>
          ))}
          <View style={styles.footer} fixed>
            <Text>
              {owner} / {text(version.title)}
            </Text>
            <Text
              render={({ pageNumber, totalPages }) =>
                `${pageNumber} / ${totalPages}`
              }
            />
          </View>
        </Page>
      ))}
    </Document>
  );
}
