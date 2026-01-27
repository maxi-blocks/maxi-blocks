# Skill: MaxiBlocks Container Maxi

## Purpose
The Container Maxi block (`maxi-blocks/container-maxi`) is the core layout wrapper for MaxiBlocks. It wraps and structures sections, rows, and groups, and provides the foundation for spacing, sizing, and responsive layouts in templates and patterns.【F:src/blocks/container-maxi/block.json†L1-L13】

## Key Controls
- **Block registration:** `maxi-blocks/container-maxi` with the description "Wrap blocks within a container."【F:src/blocks/container-maxi/block.json†L1-L13】
- **Size, spacing, and visuals:** Background, border, box shadow, size, and margin/padding settings are available via the block's templates and copy/paste mapping for consistent reuse across containers.【F:src/blocks/container-maxi/data.js†L57-L89】
- **Shape dividers:** Top/bottom dividers include status, style, color, height, opacity, and scroll effects for section transitions.【F:src/blocks/container-maxi/data.js†L17-L55】
- **Callout arrows:** Arrow visibility, side, position, and size can be configured per breakpoint.【F:src/blocks/container-maxi/data.js†L39-L55】
- **Custom CSS targets:** Targets include container, before/after container, dividers, and background states.【F:src/blocks/container-maxi/data.js†L84-L108】

## Common Patterns
- **Section wrapper:** Apply background and spacing at the container level to keep inner blocks focused on content.【F:src/blocks/container-maxi/data.js†L57-L89】
- **Divided sections:** Use top/bottom dividers to create visual breaks between sections.【F:src/blocks/container-maxi/data.js†L17-L55】

## Accessibility Notes
- Maintain logical heading order inside the container (H1 → H2 → H3).
- Ensure background overlays preserve text contrast.

## Examples
- Hero section with background image on the container and CTA blocks inside.
- Alternating section dividers for long-form landing pages.

## Gotchas / Troubleshooting
- If dividers aren't visible, verify divider status and height/opacity settings for the correct edge (top/bottom).【F:src/blocks/container-maxi/data.js†L17-L55】
- If layout sizing feels inconsistent, verify max-width presets and units for the container.【F:src/blocks/container-maxi/data.js†L109-L121】
