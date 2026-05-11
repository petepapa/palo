# System Patterns

## Button Styling Logic
- **Unified Global Hover**: All buttons share consistent hover, focus, and active states.
- **No Shadows**: Buttons intentionally have no box-shadows.
- **No Movement**: Buttons do not translate or move on interaction.

## Patch Management

This project uses `patch-package` to apply fixes directly to `accessible-astro-components` in `node_modules/`. The patch file is at `patches/accessible-astro-components+5.2.0.patch`.

### Current Patches

| Component | File | Fix Description |
|-----------|------|-----------------|
| Avatar | `src/components/avatar/Avatar.astro` | `.initials` span now uses `display: flex; align-items: center; justify-content: center; inline-size: 100%; block-size: 100%;` to ensure initials text is vertically and horizontally centered inside the avatar circle. |
| Badge | `src/components/badge/Badge.astro` | Circular badges (`isCircular`) now use fixed `inline-size`/`block-size` instead of `aspect-ratio` + `min-inline-size`/`min-block-size` to guarantee a perfect circle. Additionally, direct children of `badge.circular` are styled as flexbox with `align-items: center; justify-content: center; inline-size: 100%; block-size: 100%;` to ensure numbers/text are perfectly centered. |

### When Adding a New Patch
1. Edit the source file directly in `node_modules/accessible-astro-components/`
2. Run `npx patch-package accessible-astro-components` to regenerate the patch
3. Update this file with a description of the fix
4. Test the component in both dev (`npm run dev`) and build (`npm run build`)