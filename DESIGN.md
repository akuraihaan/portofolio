<!-- MIT licensed. Copyright and license: https://opendesignmd.com/licenses/ -->

# How emmi.framer.website is designed

## Overview

BWORIEY's portfolio presents a deliberately unpolished, craft-forward visual system that balances editorial refinement with playful spontaneity. The design operates across two distinct modes: a warm off-white canvas (`#FAF8F5`) for daytime browsing and a near-black dark mode (`#1A1917`) for dramatic contrast. The core personality emerges from the tension between classical serif typography—used for display and poetic moments—and utilitarian monospace for navigation, labels, and functional text. The layout rejects rigid grids in favor of scattered, collage-like compositions where cards, stickers, and image tiles appear to have been placed by hand. Tiny ASCII-art sprites and hand-drawn icons populate the negative space, reinforcing the developer's stated interests in prototyping, storytelling, and visual craft.

## Colors

| token | value | use |
|---|---|---|
| canvas | `#FAF8F5` | Primary page background in light mode; warm off-white with subtle cream undertone |
| canvas-dark | `#1A1917` | Dark mode background; near-black with warm charcoal quality |
| ink | `#000000` | Primary text on light backgrounds |
| ink-light | `#FAF8F5` | Text on dark backgrounds and orange surfaces |
| accent-orange | `#F05A28` | Primary interactive and highlight surfaces; info cards, active states |
| accent-peach | `#FFD4C2` | Secondary text box backgrounds; softer complement to orange |
| accent-green | `#C4D94E` | Label backgrounds, sprite details, and sporadic highlights |
| accent-blue | `#A8D0F0` | Sticker elements, decorative accents, and icon containers |

No gradients or shadows are employed; color blocks sit flat against the canvas.

## Typography

| token | family | size | weight | leading | tracking | use |
|---|---|---:|---:|---:|---:|---|
| hero-display | Cormorant Garamond (Self Modern alt) | 3rem | 400 | 1.1 | -0.01em | Large statements, about card headlines, poetic quotes |
| section-display | Cormorant Garamond | 2rem | 400 | 1.2 | 0em | Footer quotes, section introductions |
| body | Figtree | 1rem | 300 | 1.6 | 0em | Paragraph text, descriptions, general reading |
| body-mono | IBM Plex Mono | 0.875rem | 400 | 1.5 | 0em | Biographical details, technical annotations |
| label | IBM Plex Mono | 0.75rem | 400 | 1.4 | 0.05em | Small caps, metadata, category tags |
| navigation | IBM Plex Mono | 0.75rem | 400 | 1 | 0.02em | Header links, footer navigation columns |
