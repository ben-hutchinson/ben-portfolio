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
public/assets/characters/<character>/select/
public/assets/characters/<character>/idle/
```

## Technical Targets

* PNG with transparency.
* Crisp nearest-neighbor scaling.
* Base sprite height: 96px desktop.
* Character icon: 64x64.
* Center showcase uses scaled front sprite.

## File Naming Convention

```text
<character>_front.png
<character>_thumb.png
<character>_portrait.png
<character>_idle_01.png
<character>_idle_02.png
<character>_select.png
```

## Character Notes

### Ben

* Use provided headshot for face likeness.
* Green shirt reference can inspire palette.
* Add black trousers.
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
6. Export front sprite + idle variants.
7. Test in browser at real size.
8. Optimize file size.

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

Ship placeholders first. Replace assets without changing filenames when upgrading art later.
