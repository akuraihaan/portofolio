export function validateUpload(name: string, type: string, size: number) {
  const extensions: Record<string, string[]> = {
    "image/jpeg": ["jpg", "jpeg"],
    "image/png": ["png"],
    "image/webp": ["webp"],
    "application/pdf": ["pdf"],
    "video/mp4": ["mp4"],
    "video/webm": ["webm"],
  };
  const ext = name.split(".").pop()?.toLowerCase() || "";
  const limit = type.startsWith("video/")
    ? 50 * 1024 * 1024
    : type === "application/pdf"
      ? 20 * 1024 * 1024
      : 10 * 1024 * 1024;
  return {
    ext,
    error:
      !extensions[type]?.includes(ext) ||
      !Number.isFinite(size) ||
      size <= 0 ||
      size > limit
        ? "Format atau ukuran tidak sesuai. Gambar 10 MB, PDF 20 MB, video 50 MB."
        : null,
  };
}
export function validSignature(bytes: Uint8Array, type: string) {
  const ascii = (start: number, end: number) =>
    new TextDecoder().decode(bytes.slice(start, end));
  if (bytes.length < 12) return false;
  if (type === "application/pdf") return ascii(0, 5) === "%PDF-";
  if (type === "image/png")
    return [137, 80, 78, 71, 13, 10, 26, 10].every((n, i) => bytes[i] === n);
  if (type === "image/jpeg")
    return bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255;
  if (type === "image/webp")
    return ascii(0, 4) === "RIFF" && ascii(8, 12) === "WEBP";
  if (type === "video/mp4") return ascii(4, 8) === "ftyp";
  if (type === "video/webm")
    return [26, 69, 223, 163].every((n, i) => bytes[i] === n);
  return false;
}
