# Skill: MaxiBlocks Patterns

## Purpose
Patterns are reusable block compositions that help you assemble common layout sections quickly. MaxiBlocks includes a template library for discovering and inserting patterns directly from the editor.【F:README.md†L35-L56】

## Key Controls
- **Template library entry point:** The Cloud library Maxi block (`maxi-blocks/maxi-cloud`) is used to browse and insert templates or patterns from the MaxiBlocks library.【F:src/blocks/cloud-maxi/index.js†L21-L33】

## Common Patterns
- **Hero pattern:** Container + heading text + supporting paragraph + CTA button.
- **Feature grid:** Container + row + columns containing icon + heading + text.
- **Testimonial strip:** Container + slider or repeated group blocks.

## Accessibility Notes
- Ensure headings are in logical order across repeated patterns.
- Provide alt text for images and labels for icon-only controls.

## Examples
- Start from a hero pattern, then replace imagery and CTA text to fit the project.
- Duplicate a feature grid pattern and swap icon sets for variation.

## Gotchas / Troubleshooting
- If pattern styling feels inconsistent, apply a style card to re-skin related sections for uniformity.【F:README.md†L88-L98】
