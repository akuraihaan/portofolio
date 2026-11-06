import type { CSSProperties } from "react";
import { strings, text, type Row } from "@/lib/domain";

type ArtworkStyle = CSSProperties & {
  "--art-bg": string;
  "--art-main": string;
  "--art-alt": string;
};

const palettes = {
  analytics: ["#182239", "#a998ff", "#76e0c4"],
  access: ["#172b31", "#75dbc5", "#f0bd70"],
  dayak: ["#30212b", "#f0bd70", "#f29ab0"],
  wetlands: ["#132b35", "#75dbc5", "#91c8ed"],
  converter: ["#302b20", "#e8c47e", "#91c8ed"],
  notes: ["#30232b", "#ef9f8b", "#b9a9ff"],
  data: ["#1c2035", "#a998ff", "#87c8ef"],
  default: ["#1b2432", "#81b8ee", "#f0bd70"],
} as const;

export function ProjectArtwork({ project }: { project: Row }) {
  const content = [
    project.title,
    project.category,
    project.summary,
    ...strings(project.technologies),
  ]
    .map(text)
    .join(" ")
    .toLowerCase();
  const theme = /learning|analytics|tailwind|dashboard/.test(content)
    ? "analytics"
    : /bisindo|isyarat/.test(content)
      ? "access"
      : /ikan|lahan basah|wetland/.test(content)
        ? "wetlands"
        : /dayak|kuis|game edukasi/.test(content)
          ? "dayak"
          : /konversi|converter|satuan panjang/.test(content)
            ? "converter"
            : /catatan|notes|pencatatan/.test(content)
              ? "notes"
              : /python|scraping|data|dataset/.test(content)
                ? "data"
                : /android|mobile|aplikasi/.test(content)
                  ? "access"
                  : "default";
  const [background, main, alternate] = palettes[theme];
  const style: ArtworkStyle = {
    "--art-bg": background,
    "--art-main": main,
    "--art-alt": alternate,
  };

  return (
    <div className={`project-artwork artwork-${theme}`} style={style} aria-hidden="true">
      <svg viewBox="0 0 640 360" role="presentation" shapeRendering="crispEdges">
        <rect width="640" height="360" fill="var(--art-bg)" />
        <rect x="424" y="34" width="150" height="150" fill="var(--art-main)" opacity=".1" />
        <rect x="54" y="48" width="532" height="264" fill="none" stroke="var(--art-alt)" strokeOpacity=".32" strokeWidth="2" />
        <rect x="54" y="48" width="532" height="34" fill="var(--art-alt)" opacity=".08" />
        <rect x="72" y="62" width="8" height="8" fill="var(--art-main)" />
        <rect x="88" y="62" width="8" height="8" fill="var(--art-alt)" />
        <rect x="104" y="62" width="8" height="8" fill="#f2e8d5" opacity=".7" />
        {theme === "analytics" && (
          <>
            <rect x="82" y="104" width="216" height="164" fill="#101827" />
            <path d="M104 238h176M104 202h176M104 166h176M104 130h176" stroke="#39445a" strokeWidth="2" />
            <path className="artwork-bars" d="M116 218h22v20h-22zm38-42h22v62h-22zm38 18h22v44h-22zm38-70h22v114h-22z" fill="var(--art-main)" />
            <rect x="328" y="104" width="224" height="72" fill="#101827" />
            <rect x="350" y="126" width="84" height="10" fill="var(--art-alt)" />
            <rect x="350" y="146" width="154" height="6" fill="#e8e2d6" opacity=".46" />
            <rect x="328" y="194" width="104" height="74" fill="#101827" />
            <rect x="448" y="194" width="104" height="74" fill="#101827" />
            <rect x="348" y="214" width="26" height="26" fill="var(--art-main)" />
            <rect x="468" y="214" width="26" height="26" fill="var(--art-alt)" />
          </>
        )}
        {(theme === "access" || theme === "notes") && (
          <>
            <rect x="88" y="108" width="190" height="156" fill="#101827" />
            <rect x="110" y="130" width="60" height="60" fill="var(--art-main)" opacity=".85" />
            <rect x="184" y="130" width="72" height="12" fill="#f2e8d5" opacity=".8" />
            <rect x="184" y="154" width="54" height="8" fill="#f2e8d5" opacity=".38" />
            <rect x="110" y="208" width="146" height="8" fill="var(--art-alt)" />
            <rect x="110" y="230" width="110" height="8" fill="#f2e8d5" opacity=".26" />
            {theme === "access" ? (
              <>
                <rect x="356" y="94" width="118" height="190" fill="var(--art-alt)" />
                <rect x="366" y="104" width="98" height="170" fill="#101827" />
                <rect x="390" y="126" width="50" height="50" fill="var(--art-main)" />
                <rect x="380" y="194" width="70" height="10" fill="#f2e8d5" opacity=".8" />
                <rect x="380" y="216" width="52" height="8" fill="#f2e8d5" opacity=".35" />
                <rect x="380" y="246" width="70" height="12" fill="var(--art-alt)" />
                <path className="artwork-hand" d="M132 174h12v-12h12v-12h12v12h12v12h12v12h-12v12h-12v12h-12v-12h-12v-12h-12z" fill="#101827" opacity=".78" />
              </>
            ) : (
              <>
                <rect x="356" y="94" width="152" height="190" fill="var(--art-alt)" />
                <rect x="368" y="106" width="128" height="166" fill="#101827" />
                <rect x="390" y="126" width="12" height="12" fill="var(--art-main)" />
                <rect x="414" y="128" width="58" height="8" fill="#f2e8d5" opacity=".8" />
                <rect x="390" y="158" width="12" height="12" fill="var(--art-main)" />
                <rect x="414" y="160" width="66" height="8" fill="#f2e8d5" opacity=".52" />
                <rect x="390" y="190" width="12" height="12" fill="var(--art-main)" />
                <rect x="414" y="192" width="48" height="8" fill="#f2e8d5" opacity=".52" />
                <path className="artwork-pencil" d="m430 238 38-38 12 12-38 38h-12z" fill="var(--art-alt)" />
                <path d="m430 238 10 10h-10z" fill="#f2e8d5" />
              </>
            )}
          </>
        )}
        {theme === "dayak" && (
          <>
            <rect x="96" y="104" width="214" height="164" fill="#101827" />
            <rect x="116" y="124" width="174" height="14" fill="var(--art-main)" />
            <rect x="116" y="158" width="174" height="36" fill="var(--art-alt)" />
            <rect x="116" y="208" width="76" height="36" fill="#7bc8a4" />
            <rect x="202" y="208" width="88" height="36" fill="#7388d4" />
            <g className="artwork-mascot">
              <rect x="366" y="112" width="112" height="112" fill="var(--art-main)" />
              <rect x="392" y="84" width="56" height="28" fill="var(--art-main)" />
              <rect x="392" y="224" width="56" height="28" fill="var(--art-main)" />
              <rect x="338" y="140" width="28" height="56" fill="var(--art-main)" />
              <rect x="478" y="140" width="28" height="56" fill="var(--art-main)" />
              <rect x="394" y="140" width="24" height="24" fill="#101827" />
              <rect x="442" y="140" width="24" height="24" fill="#101827" />
              <rect x="406" y="184" width="48" height="12" fill="#101827" />
            </g>
          </>
        )}
        {theme === "wetlands" && (
          <>
            <path d="M94 236h440v34H94z" fill="#183b47" />
            <path className="artwork-water" d="M94 250h440m-404 14h74m52-14h94m68 14h92" stroke="var(--art-alt)" strokeWidth="4" opacity=".68" />
            <path d="M124 236v-74h12v-34h12v108zm28 0v-52h12v-28h12v80zm278 0v-82h12v-38h12v120zm28 0v-54h12v-36h12v90z" fill="#75a98e" />
            <g className="artwork-fish">
              <path d="M204 188h24v-12h48v12h24v24h-24v12h-48v-12h-24z" fill="var(--art-main)" />
              <path d="m180 200 24-12v24zm120 0 22-18v36z" fill="var(--art-alt)" />
              <rect x="246" y="188" width="8" height="8" fill="#101827" />
            </g>
            <path d="M348 150h18v-16h14v-18h12v120h-12v-18h-14v-16h-18" fill="var(--art-alt)" />
            <circle cx="398" cy="130" r="4" fill="#f2e8d5" />
            <circle cx="418" cy="110" r="3" fill="#f2e8d5" opacity=".65" />
          </>
        )}
        {theme === "converter" && (
          <>
            <rect x="100" y="118" width="356" height="142" fill="#101827" />
            <rect x="120" y="140" width="112" height="42" fill="var(--art-main)" />
            <rect x="352" y="140" width="82" height="42" fill="var(--art-alt)" />
            <path className="artwork-convert-arrow" d="M254 154h72m-18-16 18 16-18 16" fill="none" stroke="#f2e8d5" strokeWidth="8" strokeLinecap="square" />
            <path d="M118 210h300m-284 0v24m28-24v14m28-14v24m28-24v14m28-24v24m28-24v14m28-14v24m28-24v14m28-24v24" stroke="var(--art-alt)" strokeWidth="4" />
            <rect x="468" y="106" width="52" height="156" fill="#344052" />
            <path d="M480 118v22m0 12v22m0 12v22m0 12v22" stroke="#f2e8d5" strokeWidth="5" />
            <rect x="476" y="178" width="36" height="14" fill="var(--art-main)" />
          </>
        )}
        {theme === "data" && (
          <>
            <rect x="88" y="106" width="302" height="164" fill="#101827" />
            <rect x="88" y="106" width="302" height="28" fill="var(--art-main)" opacity=".2" />
            <rect x="110" y="156" width="14" height="14" fill="var(--art-alt)" />
            <rect x="136" y="158" width="182" height="8" fill="#f2e8d5" opacity=".75" />
            <rect x="110" y="184" width="14" height="14" fill="var(--art-main)" />
            <rect x="136" y="186" width="148" height="8" fill="#f2e8d5" opacity=".46" />
            <rect x="110" y="212" width="14" height="14" fill="var(--art-alt)" />
            <rect x="136" y="214" width="204" height="8" fill="#f2e8d5" opacity=".65" />
            <g className="artwork-cubes">
              <rect x="430" y="126" width="74" height="74" fill="var(--art-main)" />
              <rect x="454" y="102" width="74" height="74" fill="var(--art-alt)" />
              <rect x="454" y="176" width="74" height="74" fill="#7187d4" />
              <rect x="430" y="200" width="74" height="74" fill="#78c6a6" />
            </g>
          </>
        )}
        {theme === "default" && (
          <>
            <rect x="92" y="106" width="198" height="156" fill="#101827" />
            <rect x="112" y="128" width="66" height="66" fill="var(--art-main)" />
            <rect x="194" y="128" width="76" height="12" fill="var(--art-alt)" />
            <rect x="194" y="152" width="56" height="8" fill="#f2e8d5" opacity=".42" />
            <rect x="112" y="214" width="158" height="10" fill="var(--art-alt)" />
            <rect x="342" y="126" width="154" height="42" fill="var(--art-main)" />
            <rect x="370" y="190" width="126" height="42" fill="var(--art-alt)" />
            <rect x="398" y="254" width="98" height="12" fill="#f2e8d5" opacity=".6" />
          </>
        )}
        <g className="artwork-float" fill="var(--art-alt)">
          <rect x="526" y="110" width="10" height="10" />
          <rect x="544" y="128" width="7" height="7" />
          <rect x="514" y="137" width="6" height="6" />
        </g>
        <g className="artwork-float-two" fill="var(--art-main)">
          <rect x="508" y="165" width="6" height="6" />
          <rect x="532" y="178" width="8" height="8" />
          <rect x="556" y="159" width="5" height="5" />
        </g>
        <rect x="72" y="286" width="22" height="8" fill="var(--art-main)" />
        <rect x="102" y="286" width="8" height="8" fill="var(--art-alt)" />
        <rect x="566" y="286" width="8" height="8" fill="var(--art-alt)" />
      </svg>
    </div>
  );
}
