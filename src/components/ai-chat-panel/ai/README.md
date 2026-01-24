# Maxi AI Module System

This folder keeps AI logic modular per block so `ai-chat-panel` stays maintainable.

Structure:
- `blocks/`: patterns + handlers per block.
- `prompts/`: optional block-specific system prompt snippets.
- `registry.js`: single place to register blocks (patterns, handler, prompt).

To add a new block:
1) Create `blocks/<block>.js` exporting `<BLOCK>_PATTERNS` and `handle<Block>Update`.
2) (Optional) Add `prompts/<block>.js` for prompt guidance.
3) Register the block in `registry.js` with `target`, `match`, `patterns`, `handler`, `prompt`.

Notes:
- Patterns are appended into the global matcher, so order matters.
- Use `target` to keep prompts scoped to the correct block type.
- For complex updates, prefer handler-driven changes instead of generic property mapping.
