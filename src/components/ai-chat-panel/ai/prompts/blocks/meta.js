const META_MAXI_PROMPT = `### MODULE: META (SHARED)
Handle anchor IDs and ARIA labels across buttons, containers, text, and related blocks.

- Anchor ID: property "anchor_link" with a string (no #).  
  "Set the anchor ID to hero-cta." -> { "anchor_link": "hero-cta" }

- Aria label: property "aria_label" with descriptive text.  
  "Set accessibility label to 'Primary CTA'." -> { "aria_label": "Primary CTA" }

Clarify when the user only mentions anchors or aria labels without details.
`;

export default META_MAXI_PROMPT;
export { META_MAXI_PROMPT };
