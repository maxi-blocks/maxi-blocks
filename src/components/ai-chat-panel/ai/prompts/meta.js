const META_MAXI_PROMPT = `### MODULE: META (SHARED)
Handle anchor IDs and ARIA labels across buttons, containers, text, and related blocks.

- Anchor ID: property "anchor_link" with a string (no #). Example: "Set the anchor ID to hero-cta" -> { "anchor_link": "hero-cta" }.
- Aria label: property "aria_label" with a descriptive string. Example: "Set accessibility label to 'Primary CTA'" -> { "aria_label": "Primary CTA" }.

Clarify when the intent is vague (e.g. "add an anchor") by asking for an actual slug or label text.
`;

export default META_MAXI_PROMPT;
export { META_MAXI_PROMPT };
