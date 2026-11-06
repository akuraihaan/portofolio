export type PixelIconName = "arrow-up-right" | "arrow-down" | "plus" | "menu" | "close";

export function PixelIcon({ name }: { name: PixelIconName }) {
  return (
    <svg
      className="pixel-icon"
      viewBox="0 0 16 16"
      aria-hidden="true"
      focusable="false"
      shapeRendering="crispEdges"
    >
      {name === "arrow-up-right" && (
        <g fill="currentColor">
          <rect x="2" y="12" width="3" height="2" />
          <rect x="5" y="9" width="3" height="3" />
          <rect x="8" y="6" width="3" height="3" />
          <rect x="11" y="4" width="2" height="3" />
          <rect x="9" y="2" width="5" height="2" />
          <rect x="12" y="2" width="2" height="5" />
        </g>
      )}
      {name === "arrow-down" && (
        <g fill="currentColor">
          <rect x="7" y="2" width="2" height="9" />
          <rect x="4" y="8" width="3" height="2" />
          <rect x="9" y="8" width="3" height="2" />
          <rect x="5" y="10" width="6" height="2" />
          <rect x="7" y="12" width="2" height="2" />
        </g>
      )}
      {name === "plus" && (
        <path d="M8 2v12M2 8h12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" />
      )}
      {name === "menu" && (
        <g fill="currentColor">
          <rect x="2" y="3" width="12" height="2" />
          <rect x="2" y="7" width="12" height="2" />
          <rect x="2" y="11" width="12" height="2" />
        </g>
      )}
      {name === "close" && (
        <path d="m4 4 8 8m0-8-8 8" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" />
      )}
    </svg>
  );
}
