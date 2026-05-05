# PIXELLAB_MCP.md

## Purpose

Configure PixelLab once in Codex so sprite generation is available across this repo and future repos.

## Live Codex MCP Server

PixelLab exposes an HTTP MCP server at:

```text
https://api.pixellab.ai/mcp
```

Authentication uses a bearer token.

## Codex Config Stanza

Add this to `~/.codex/config.toml`:

```toml
[mcp_servers.pixellab]
url = "https://api.pixellab.ai/mcp"
transport = "http"

[mcp_servers.pixellab.env]
AUTHORIZATION = "Bearer <PIXELLAB_TOKEN>"
```

If your Codex build expects custom headers instead of environment-driven auth, mirror the install command shown on PixelLab's site:

```text
claude mcp add pixellab https://api.pixellab.ai/mcp -t http -H "Authorization: Bearer <PIXELLAB_TOKEN>"
```

The equivalent Codex setup should preserve the same `Authorization: Bearer ...` header.

## Recommended Use In This Portfolio

Generate only the assets the app now expects:

```text
public/assets/characters/<character>/pixellab/rotations/south.png
public/assets/characters/<character>/pixellab/rotations/east.png
public/assets/characters/<character>/pixellab/animations/<animation-id>/east/frame_000.png
```

Current active characters:

* `ben`
* `dog`
* `cat`

## Prompt Guidance

Use prompts that constrain:

* front-facing sprite
* transparent background
* 96px-tall character target
* dark arcade / space sci-fi palette
* subtle shading, readable silhouette
* same style family across all characters

Example:

```text
Create a front-facing pixel art character sprite of a black dog with a purple harness, modern retro 16-bit style, transparent background, readable silhouette, subtle top-down shading, suitable for a dark sci-fi portfolio UI.
```

## Notes

* Do not regenerate large sprite rotation sets for this portfolio.
* Keep filenames stable so the app does not need code changes when art is refreshed.
