# Skill: MaxiBlocks Text Maxi

## Purpose
Text Maxi (`maxi-blocks/text-maxi`) is the core text block for inserting, modifying, and styling text content in MaxiBlocks layouts.【F:src/blocks/text-maxi/block.json†L1-L21】

## Key Controls
- **Block registration:** `maxi-blocks/text-maxi` with the description "Insert, modify or style text."【F:src/blocks/text-maxi/block.json†L1-L13】
- **Splitting support:** Text splitting is enabled via `supports.splitting` for editor effects and controls.【F:src/blocks/text-maxi/block.json†L12-L17】
- **Style card hooks:** Text Maxi registers color-related style card properties for styling workflows.【F:src/blocks/text-maxi/block.json†L19-L26】

## Common Patterns
- **Headings and body copy:** Use Text Maxi for headings, paragraphs, labels, and helper text.
- **Stacked text groups:** Combine multiple Text Maxi blocks inside Group Maxi for title + subtitle stacks.

## Accessibility Notes
- Maintain a logical heading hierarchy.
- Ensure sufficient color contrast for text on backgrounds.

## Examples
- Section heading + lead paragraph in a hero layout.
- Label and value pairs inside a stats block.

## Gotchas / Troubleshooting
- If text styling doesn't match expectations, confirm the applied style card color settings.【F:src/blocks/text-maxi/block.json†L19-L26】
