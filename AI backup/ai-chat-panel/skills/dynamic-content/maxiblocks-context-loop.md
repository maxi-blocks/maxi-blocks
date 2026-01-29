# Skill: MaxiBlocks Context Loop

## Purpose
Context Loop is MaxiBlocks' query loop equivalent. It works with MaxiBlocks container, row, column, and group blocks to build dynamic layouts for blogs, product listings, and archives while respecting the responsive grid system.【F:README.md†L166-L167】

## Key Controls
- **Layout integration:** Context Loop is designed to operate within MaxiBlocks layout blocks (container, row, column, group).【F:README.md†L166-L167】
- **Dynamic pairing:** Context Loop works alongside dynamic content to populate block data from the current loop item.【F:README.md†L166-L170】

## Common Patterns
- **Post grid:** Container + row + columns with image, title, and excerpt.
- **Archive list:** Stacked groups for each loop item with metadata and CTA.

## Accessibility Notes
- Ensure repeated content includes unique, descriptive headings or labels.
- Avoid overly long lists without clear sectioning or pagination.

## Examples
- Blog archive grid with featured image, title, and excerpt.
- Product listing with price and "View product" button.

## Gotchas / Troubleshooting
- If the loop doesn't render items, confirm the Context Loop toggle is enabled on the container block.【F:README.md†L166-L167】
