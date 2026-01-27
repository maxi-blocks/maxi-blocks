# Skill: MaxiBlocks Button Maxi

## Purpose
Button Maxi (`maxi-blocks/button-maxi`) inserts and styles buttons for calls to action in MaxiBlocks layouts.【F:src/blocks/button-maxi/block.json†L1-L28】

## Key Controls
- **Block registration:** `maxi-blocks/button-maxi` with the description "Insert, modify or style a button."【F:src/blocks/button-maxi/block.json†L1-L13】
- **Style card hooks:** Button hover color/background/border settings are exposed for style card workflows.【F:src/blocks/button-maxi/block.json†L18-L28】

## Common Patterns
- **Primary CTA:** Single button in a hero or CTA strip.
- **Button rows:** Multiple Button Maxi blocks grouped with consistent spacing.

## Accessibility Notes
- Use clear, actionable button labels.
- Ensure visible focus states for keyboard users.

## Examples
- "Get started" button beneath a hero headline.
- Paired "Learn more" + "Contact" buttons in a CTA block.

## Gotchas / Troubleshooting
- If hover styles don't apply, confirm the style card hover elements are configured.【F:src/blocks/button-maxi/block.json†L18-L28】
