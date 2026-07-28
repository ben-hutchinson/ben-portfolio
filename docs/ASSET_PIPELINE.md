# ASSET_PIPELINE.md

## Purpose

Define a repeatable process for turning raw photos and references into production-ready pixel assets for the portfolio website.

## Art Direction

* Modern retro pixel art.
* Dark arcade / space sci-fi aesthetic.
* Professional, charming, not gimmicky.
* Consistent proportions across all characters.

## Characters

* Ben (main character)
* Dog
* Cat

## Source Inputs

Store raw references only in source folders.

```text
public/assets/characters/<character>/source/
```

## Production Outputs

```text
public/assets/characters/<character>/pixellab/rotations/
public/assets/characters/<character>/pixellab/animations/<animation-id>/<direction>/
```

## Technical Targets

* PNG with transparency.
* Crisp nearest-neighbor scaling.
* Rotation sprites should include at least `south.png` and `east.png`.
* Runner animation frames only need the `east` direction for the current mission runner.
* Center showcase uses the `south` rotation sprite.

## File Naming Convention

```text
rotations/south.png
rotations/east.png
animations/<animation-id>/east/frame_000.png
animations/<animation-id>/east/frame_001.png
...
```

## Character Notes

### Ben

* Use provided headshot for face likeness.
* Green shirt reference can inspire palette.
* Command v2 uses warm sand beige (`#CBBF9E`) trousers.
* Add black shoes.
* Friendly, confident posture.

### Dog

* Use black coat.
* Include purple harness.
* Slightly heroic / loyal stance.
* Optional tail wag idle.

### Cat

* Black fur with white chest patch and paws.
* Curious expression.
* Optional blink idle.

## Production Workflow

1. Import source image.
2. Remove background.
3. Block silhouette at larger working scale.
4. Reduce to limited palette.
5. Add facial/features details.
6. Export Pixellab rotations and east-facing runner frames.
7. Test in browser at real size.
8. Optimize file size.

## Command Crew v2

Command Crew v2 uses two deliberately related rendering tiers:

* **Hero tier:** high-detail modern 32-bit pixel art exported as WebP, no
  larger than 1024×1024 and no larger than 350 KB. Preserve the editable PNG
  source outside runtime paths.
* **Gameplay tier:** simplified derivatives on exact 104×104 transparent PNG
  canvases. Use chunkier clusters, stable proportions, a shared baseline, and
  a restrained one-to-two-pixel silver/violet edge highlight. This tier is not
  a new costume and must preserve each character's established identity,
  colours, clothing, and proportions.

The approved gameplay palette must be reviewed on command navy (`#0E2148`),
deep violet (`#483AA0`), and silver (`#C7CCD8`).

### Command v2 output contract

```text
public/assets/characters/<character>/command-v2/hero.webp
public/assets/characters/<character>/command-v2/rotations/south.png
public/assets/characters/<character>/command-v2/rotations/east.png
public/assets/characters/<character>/command-v2/runner/frame_000.png
...
public/assets/characters/<character>/command-v2/runner/frame_007.png
```

All runtime paths are declared in
`public/assets/characters/command-v2-manifest.json`.

### Transparent gameplay workflow

1. Generate a south-facing still and an east-facing eight-frame run sheet on
   a perfectly flat chroma-key background.
2. Remove the key with the installed ImageGen chroma-removal helper using a
   soft matte and despill.
3. Identify the eight separated animation components, preserving overlapping
   frame extents without clipping.
4. Fit every sprite to the 104×104 canvas with nearest-neighbour resampling
   only, center horizontally, and align the lowest opaque pixel to the shared
   baseline.
5. Confirm RGBA output, transparent corners, exact dimensions, eight runner
   frames per character, and readability on all three approved surfaces.
6. Keep all pre-v2 assets unchanged until browser review is complete.

## Recommended Tools

* PixelLab MCP
* LibreSprite
* Piskel
* Photoshop (nearest-neighbor)
* GIMP

## Quality Checklist

* Silhouette readable at small size.
* No blurry scaling.
* Consistent palette language.
* Transparent background.
* Looks good on dark UI.
* Loads quickly.

## Integration Contract

All assets should be referenced from `src/data/characters.ts`. No hardcoded image paths scattered through components.

## Versioning Rule

Keep filenames and animation IDs stable once referenced from `src/data/characters.ts`.
