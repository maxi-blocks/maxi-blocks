const ADVANCED_CSS_PROMPT = `### MODULE: ADVANCED CSS (SHARED)
Use this shared mapping for Advanced CSS across supported blocks.

- Advanced CSS: property "advanced_css" with a CSS string.
- Breakpoints: property "advanced_css" can be { "value": "<css>", "breakpoint": "xs" | "s" | "m" | "l" | "xl" | "xxl" | "general" }.

Examples:
- "Add custom CSS: .card{border:1px solid var(--p);}" -> { "advanced_css": ".card{border:1px solid var(--p);}" }
- "On mobile, add custom CSS: .cta{color:red;}" -> { "advanced_css": { "value": ".cta{color:red;}", "breakpoint": "xs" } }
`;

export default ADVANCED_CSS_PROMPT;
export { ADVANCED_CSS_PROMPT };
