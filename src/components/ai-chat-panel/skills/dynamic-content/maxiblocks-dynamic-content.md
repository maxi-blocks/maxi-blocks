# Skill: MaxiBlocks Dynamic Content

## Purpose
Dynamic content lets MaxiBlocks blocks pull data from sources such as Advanced Custom Fields (ACF). MaxiBlocks already integrates with ACF to enable data-driven layouts across blocks and templates.【F:README.md†L170-L170】

## Key Controls
- **ACF integration:** MaxiBlocks supports ACF as a dynamic content source for blocks that can render field values dynamically.【F:README.md†L170-L170】
- **Context Loop pairing:** Dynamic content can be combined with Context Loop for post grids and archive templates.【F:README.md†L166-L170】

## Common Patterns
- **Dynamic card grid:** Loop through posts and bind fields (title, excerpt, image).
- **Profile sections:** Use ACF fields for profile image, role, and description.

## Accessibility Notes
- Ensure dynamic text maintains heading structure.
- Provide alt text for dynamically sourced images.

## Examples
- Team grid using ACF fields for name, role, and headshot.
- Product cards pulling price and featured image.

## Gotchas / Troubleshooting
- Provide fallback values or placeholder text when fields are empty.
- Confirm ACF fields exist and are assigned to the correct post type.【F:README.md†L170-L170】
