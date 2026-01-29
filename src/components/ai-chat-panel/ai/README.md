# Maxi AI Module System

This folder keeps AI logic modular per block so `ai-chat-panel` stays maintainable.

Structure:
- `blocks/`: patterns + handlers per block.
- `prompts/`: system prompt snippets (style-card for global, plus block prompts: text, image, container, button, icon, divider, accordion, column, group, row, pane, slide, slider, map, search, number-counter, video).
- `registry.js`: single place to register blocks (patterns, handler, prompt).
- `style-card.js`: Style Card patterns, selectors, and handlers (global scope).

To add a new block:
1) Create `blocks/<block>.js` exporting `<BLOCK>_PATTERNS` and `handle<Block>Update`.
2) (Optional) Add `prompts/<block>.js` for prompt guidance.
3) Register the block in `registry.js` with `target`, `match`, `patterns`, `handler`, `prompt`.

Notes:
- Patterns are appended into the global matcher, so order matters.
- Use `target` to keep prompts scoped to the correct block type.
- For complex updates, prefer handler-driven changes instead of generic property mapping.
- Prompts document canonical properties; internal `flow_*` and `color_clarify` triggers stay pattern-only.

Background palette guardrails (important):
- Background palette updates are handled in `src/components/ai-chat-panel/index.js` via `updateBackgroundColor`.
- Keep that helper minimal: set `background-active-media-general`, palette status/color, and update the first background layer only.
- Avoid extra "sanity writes", breakpoint fan-out, or layer re-ordering unless you verify the UI. These changes broke palette selection.
- Debugging: set `window.__MAXI_AI_DEBUG_BG = true` or `localStorage.maxiAiDebugBackground = '1'` to log background changes.
