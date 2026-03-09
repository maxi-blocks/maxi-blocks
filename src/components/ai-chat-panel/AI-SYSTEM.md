# Maxi AI System — Architecture Reference

A comprehensive guide to the AI chat panel: how messages flow, where decisions are made, and how the codebase is organized.

---

## Table of Contents

1. [Overview](#overview)
2. [Directory Map](#directory-map)
3. [Message Lifecycle](#message-lifecycle)
4. [Layer 1 — Routing (client-side, instant)](#layer-1--routing-client-side-instant)
5. [Layer 2 — AI API (cloud, async)](#layer-2--ai-api-cloud-async)
6. [Layer 3 — Action Execution](#layer-3--action-execution)
7. [Scope System](#scope-system)
8. [Block Registry](#block-registry)
9. [Style Card System](#style-card-system)
10. [Color System](#color-system)
11. [Conversation Flows (FSM)](#conversation-flows-fsm)
12. [Icon & Pattern Search](#icon--pattern-search)
13. [Prompt System](#prompt-system)
14. [Attribute System](#attribute-system)
15. [Lower-level Command Router](#lower-level-command-router)
16. [Suggestions & Typesense](#suggestions--typesense)
17. [Hooks](#hooks)
18. [Tests](#tests)
19. [How to Add a New Block](#how-to-add-a-new-block)
20. [Debugging](#debugging)

---

## Overview

The Maxi AI system is a natural-language interface embedded in the Gutenberg block editor. It lets users describe design changes in plain English ("make the heading bigger", "add a blue border to the selected container", "set the button text to Buy now") and applies them directly to blocks — or sends complex queries to an AI API (OpenAI / Anthropic / Gemini) for reasoning.

**Key design principles:**

- **Router-first**: A client-side pattern-matching pipeline handles the majority of common requests instantly, without an API call.
- **Separation of concerns**: The router returns a typed `RouteResult` (data only). The hook (`useAiChat.js`) owns all side effects (state, block dispatch, API calls).
- **Pure routing functions**: `buildRoutingContext` and `routeClientSide` have no React dependencies; they can be tested independently.
- **Three scopes**: Every action is applied to either the *selection* (one block), the *page* (all matching blocks), or *global* (Style Card tokens).

---

## Directory Map

```
src/components/ai-chat-panel/
├── AI-SYSTEM.md           ← this file
├── AiChatPanel.js         Main panel React component
├── index.js               Panel entry point / exports
├── mount.js               Mounts the panel into the Gutenberg sidebar
├── editor.scss            Panel styles
├── iconSearch.js          Top-level Typesense icon search helper
├── patternSearch.js       Top-level Cloud Library pattern search helper
├── skillContext.js        Per-block skill summaries injected into AI prompts
│
├── ai/                    Pure AI logic (no React)
│   ├── README.md          Quick notes on adding blocks
│   ├── registry.js        Registers all blocks (patterns, handler, prompt)
│   ├── style-card.js      Style Card patterns, selectors, and handlers
│   │
│   ├── actions/           Action parsing, planning, execution, schema
│   ├── attributes/        Attribute registry, types, defaults, normalisation
│   ├── blocks/            Per-block patterns and update handlers (17 blocks)
│   ├── color/             Color normalisation, palette tokens, background update
│   ├── commands/          Low-level command router (slash + NL → attribute patch)
│   ├── editor/            Editor bridge helpers
│   ├── editorBridge/      Apply / batch / undo patch helpers
│   ├── icons/             Icon search and suggestion
│   ├── patterns/          LAYOUT_PATTERNS, cloud icon pattern, targeting helpers
│   ├── prompts/           System prompt, per-block prompts, template prompts
│   ├── router/            High-level routing pipeline (intentRouter, commandRouter)
│   ├── suggestions/       Autocomplete suggestions (Typesense + local)
│   └── utils/             Shared utilities (spacing, responsive, context detection…)
│
├── components/
│   └── ChatWindow/        Chat UI component
│
├── hooks/
│   ├── useAiChat.js       Core hook — orchestrates everything
│   ├── useAiChatHistory.js Persistent message history
│   ├── useDebounce.js
│   ├── useDraggable.js
│   └── usePersistentState.js
│
├── jest/                  Jest config, setup, and mocks
└── __tests__/             34 unit tests
```

---

## Message Lifecycle

```
User types a message
        │
        ▼
useAiChat.js  sendMessage()
        │
        ├─ buildRoutingContext(rawMessage, { scope, selectedBlock, messagesRef, allBlocks })
        │       → RoutingContext (pure, no side effects)
        │
        ├─ routeClientSide(rawMessage, ctx, select)
        │       → RouteResult  (pure, no side effects)
        │
        ├─ switch (routeResult.type)
        │   ├─ 'action'           → queueDirectAction(payload)
        │   ├─ 'clarify'          → push message to chat state, stop
        │   ├─ 'flow'             → set conversationContext, open sidebar accordion
        │   ├─ 'immediate_updates'→ registry.batch() block attribute updates
        │   ├─ 'insert_block'     → createBlock() + insertBlocks() (blank WP block)
        │   ├─ 'cloud_icon'       → handleCloudIconSearch() async
        │   ├─ 'create_block'     → handleCreateBlock() async (Cloud Library)
        │   └─ 'passthrough'      → send to AI API  ──────────────┐
        │                                                          │
        │                                           PHP proxy endpoint
        │                                     /wp-json/maxi-blocks/v1.0/ai/chat
        │                                     (OpenAI / Anthropic / Gemini)
        │                                                          │
        └─ parseAndExecuteAction(aiResponse.action)  ◄────────────┘
                → attribute patch → updateBlockAttributes()
```

---

## Layer 1 — Routing (client-side, instant)

### `ai/router/intentRouter.js`

`buildRoutingContext(rawMessage, state)` — builds a `RoutingContext` from the raw message and current editor state. Pure function; called once per message.

Key fields computed:

| Field | Purpose |
|---|---|
| `lowerMessage` | Lower-cased message |
| `hexColor` | Hex colour extracted from message |
| `isGlobalScope` | `scope === 'global'` |
| `isTextSelection` | Selected block is text/list-item |
| `textLinkUrl` | URL in message (text context only) |
| `isButtonContext` / `isTextContext` / `isImageContext` / … | Block-type hints |
| `metaTargetBlock` / `dcTargetBlock` | Resolved target for meta/CSS/DC actions |
| `hasShapeDividerIntent` / `hasShapeDividerStyle` | Shape divider mentions |
| `spacingIntent` | Parsed `{ base, side }` spacing intent |
| `isImageRequest` | Message or context targets images |
| `requestedTarget` | Explicit block target from message |
| `skipLayoutPatterns` | Skip the LAYOUT_PATTERNS loop |

### `ai/router/commandRouter.js`

`routeClientSide(rawMessage, ctx, selectFn)` — tries 9 routing sections in order. Returns a `RouteResult` on the first match, or `{ type: 'passthrough' }`.

**Routing order:**

| # | Section | Handles |
|---|---|---|
| 1 | `routeTextLink` | URL in text selection → set anchor link |
| 2 | `routeAttributeGroups` | 20+ attribute-group builders (L, Meta, CSS, DC, Button A/B/C/I, Text List/L/P/C, Container A-Z) |
| 3 | `routeNumericPatterns` | Spacing with number, image sizing, size limits, border radius |
| 4 | `routeDirectRemovals` | "remove border", "square corners", "remove shadow", alignment |
| 5 | `routeHexColor` | Direct `#rrggbb` colour application |
| 6 | `routeShapeDivider` | Shape divider location / style clarification |
| 7 | `routeLayoutPatterns` | LAYOUT_PATTERNS loop (see below) |
| 8 | `routeGap` | Gap with/without numeric value |
| 9 | — | Returns `{ type: 'passthrough' }` |

**LAYOUT_PATTERNS loop** (section 7) iterates `ai/patterns/layoutPatterns.js` and dispatches to sub-routers by `pattern.property`:

- `flow_*` → `FlowResult` or `ImmediateUpdatesResult`
- `cloud_icon` → `CloudIconResult`
- `color_clarify` → `ActionResult` or `ClarifyResult`
- `aesthetic` → `ActionResult` (apply_theme)
- `insert_block` → `{ type: 'insert_block', params: { blockType } }` (blank WP block)
- `create_block` → `{ type: 'create_block', params }` (Cloud Library search)
- `use_prompt` → `ActionResult` or `ClarifyResult`
- standard → `ActionResult`

### `ai/router/types.js`

JSDoc typedefs for the full routing type system. Key types:

- `RoutingContext` — input to `routeClientSide`
- `RouteResult` — discriminated union of all possible outcomes
- `ActionResult`, `ClarifyResult`, `FlowResult`, `ImmediateUpdatesResult`, `CloudIconResult`, `CreateBlockResult`, `PassthroughResult`

### `ai/router/slashCommands.js`

- `isSlashCommand(input)` — true when input starts with `/`
- `parseSlashCommand(input)` — re-export from `ai/commands/slashParser`

---

## Layer 2 — AI API (cloud, async)

When `routeClientSide` returns `{ type: 'passthrough' }`, `useAiChat.js` builds a prompt and POSTs to the WordPress REST endpoint:

```
POST /wp-json/maxi-blocks/v1.0/ai/chat
```

The PHP proxy forwards to whichever provider is configured (OpenAI GPT-4, Anthropic Claude, Google Gemini). The response is a JSON action object:

```json
{
  "action": "MODIFY_BLOCK" | "CLARIFY" | "update_style_card" | "apply_theme" | ...,
  "payload": { ... },
  "message": "Human-readable confirmation"
}
```

`parseAndExecuteAction()` in `useAiChat.js` handles each action type:

| Action | What it does |
|---|---|
| `MODIFY_BLOCK` | Update one or more blocks' attributes |
| `MODIFY_BLOCK op:add` | Insert a new blank Maxi block |
| `CLARIFY` | Push a clarification message with option buttons |
| `update_style_card` | Update Style Card tokens (global scope) |
| `apply_theme` | Apply an aesthetic theme preset |
| `update_selection` | Update selected block attributes directly |
| `update_page` | Batch-update all matching blocks on page |

---

## Layer 3 — Action Execution

### `parseAndExecuteAction(action, context)`

The main action dispatcher inside `useAiChat.js`. Handles property normalisation, scope resolution, and block attribute writes.

**Property normalisation** — `normalizeActionProperty(property, value)` resolves aliases (via `ai/actions/actionPropertyAliases.js`), strips dashes, detects breakpoint suffixes (`_general`, `_xl`, etc.), and routes to the right handler.

**Scope resolution for `MODIFY_BLOCK`:**
- `selection` → operates on `selectedBlock` only
- `page` → `collectBlocks(allBlocks, matchFn)` to find all relevant blocks

**Attribute writes** — `updateBlockAttributes(clientId, attributes)` from `core/block-editor`.

### `queueDirectAction(payload)`

Lightweight wrapper used by the router's `'action'` result. Immediately calls `parseAndExecuteAction` without going through the AI API.

---

## Scope System

Three scopes control which blocks are targeted:

| Scope | Target | UI |
|---|---|---|
| `selection` | The currently selected block | Default when a block is selected |
| `page` | All matching blocks on the page | User can switch scope in panel |
| `global` | Style Card tokens (site-wide design system) | Global scope selector |

The scope is read from panel state and injected into both the routing context and the AI prompt:

```
USER INTENT SCOPE: PAGE
- SELECTION: Apply change only to the selected block.
- PAGE: Apply change to all relevant blocks on the entire page.
- GLOBAL: Apply change to the site-wide Style Card.
```

---

## Block Registry

`ai/registry.js` — the single place that registers all 17 Maxi blocks:

```js
{
  key: 'button',
  match: blockName => blockName.includes('button'),
  target: 'button',
  patterns: BUTTON_PATTERNS,   // regex patterns → attribute patches
  handler: handleButtonUpdate, // complex update handler
  prompt: BUTTON_MAXI_PROMPT,  // injected into AI system prompt
}
```

**Registered blocks:** accordion, button, column, container, divider, group, icon, image, map, number-counter, pane, row, search, slide, slider, text, video.

`getAiHandlerForBlock(blockName)` and `getAiHandlerForTarget(target)` resolve handlers at runtime.

**`ai/blocks/<block>.js`** — each file exports:
- `<BLOCK>_PATTERNS` — array of `{ regex, property, value?, target?, selectionMsg?, pageMsg? }`
- `handle<Block>Update(action, block)` — handles complex updates not covered by generic property mapping

---

## Style Card System

`ai/style-card.js` — handles the global scope: design tokens applied site-wide.

- `STYLE_CARD_PATTERNS` — regex patterns for style card updates (font family, size, color, palette)
- `useStyleCardData()` — React hook providing current style card data
- `createStyleCardHandlers()` — returns handlers bound to dispatch
- `buildStyleCardContext()` — builds the AI context string for global scope

AI prompt for global scope uses `STYLE_CARD_MAXI_PROMPT` and `META_MAXI_PROMPT`.

---

## Color System

`ai/color/` — color normalisation, palette lookup, and background updates.

| File | Purpose |
|---|---|
| `colorClarify.js` | `buildColorUpdate(target, color, block)` — resolves color token or hex |
| `backgroundUpdate.js` | `updateBackgroundColor(clientId, color, attrs, prefix)` |
| `color.tokens.js` / `tokens.js` | Maxi color token mapping |
| `palette.js` | Palette slot resolution |
| `colorSuggest.js` | Color suggestion helpers |
| `normalizeColor.js` | Normalises hex, rgb, named colors |

> **Important:** Background palette updates only write `background-active-media-general`, palette status/color, and the first background layer. Do not add breakpoint fan-out or layer re-ordering without verifying in the UI.

Debug: `window.__MAXI_AI_DEBUG_BG = true` or `localStorage.maxiAiDebugBackground = '1'`

---

## Conversation Flows (FSM)

Some requests require multi-step clarification before applying a change. The flow FSM is triggered by `flow_*` patterns in `LAYOUT_PATTERNS`.

**How it works:**

1. Router matches a `flow_*` pattern → returns `FlowResult` with `flowContext` and initial `message`
2. Hook sets `conversationContext` state and pushes the initial message with option buttons
3. User clicks an option → message is fed back to `sendMessage()` with the existing `conversationContext`
4. `conversationContext` disambiguates the reply and applies the resolved action

**Examples of flows:**
- Spacing ("add padding") — asks for value if none given
- Shape divider location — asks top/bottom if not specified
- Colour — asks which element if ambiguous

---

## Icon & Pattern Search

### Cloud Icon Search

Triggered by `cloud_icon` route result. `handleCloudIconSearch()` in `useAiChat.js`:

1. Extracts icon query from message (`extractIconQuery`, `extractIconQueries`)
2. Searches Typesense via `findBestIcon()` / `findIconCandidates()`
3. Detects style intent (`extractIconStyleIntent`, `stripIconStylePhrases`)
4. Applies SVG to icon blocks (`updateBlockAttributes`)
5. Optionally matches icons to titles (`matchTitlesToIconsIntent`)

`ai/icons/` — icon search and suggestion helpers.
`ai/patterns/cloudIcon.js` — the `CLOUD_ICON_PATTERN` regex entry for `LAYOUT_PATTERNS`.

### Cloud Library Pattern Search

Triggered by `create_block` route result. `handleCreateBlock()` in `useAiChat.js`:

1. `extractPatternQuery(rawMessage)` — extracts the search term
2. `findBestPattern(query)` — searches the Cloud Library REST API
3. `onRequestInsertPattern(gutenbergCode, false, true, targetClientId)` — inserts the pattern

### Direct Block Insertion

Triggered by `insert_block` route result (for primitive types: container, row, column):

```js
createBlock('maxi-blocks/container-maxi')
dispatch('core/block-editor').insertBlocks(newBlock)
```

No Cloud Library search needed for blank primitive blocks.

---

## Prompt System

`ai/prompts/` — system prompt construction.

| File | Purpose |
|---|---|
| `system.js` | Base system prompt |
| `contextBuilder.js` | Builds the full context string injected per message |
| `responseFormat.js` | JSON response format instructions |
| `safety.js` | Safety guidelines |
| `<block>.js` | Per-block capability descriptions (17 files) |
| `style-card.js` | Global scope prompt |
| `meta.js` | Meta/CSS advanced prompt |
| `interaction-builder.js` | Interaction Builder prompt |
| `advanced-css.js` | Advanced CSS prompt |

`ai/prompts/blocks/` — block-specific prompt modules used by `contextBuilder.js`.

`ai/prompts/templates/` — text transformation templates: explain, fixGrammar, generateIdeas, rewrite, summarize, translate.

`skillContext.js` — condensed per-block skill summaries injected into the AI context at runtime. Each entry has `name`, `purpose`, `keyControls`, `patterns`, and `accessibility`.

---

## Attribute System

`ai/attributes/` — the attribute registry that maps human-readable property names to Maxi block attribute keys.

| File | Purpose |
|---|---|
| `attributeRegistry.js` | Registry class: `resolveAttribute(path, { block })` |
| `attributeTypes.js` | `ATTRIBUTE_TYPES` — type definitions (color, size, boolean…) |
| `attributeDefaults.js` | Default value lookup |
| `attributePaths.js` | Attribute path resolution |
| `attributeCoverage.js` | Coverage reporting |
| `attributes.catalog.js` | Full attribute catalogue |
| `attributes.normalize.js` | Normalises raw attribute values |
| `attributes.validate.js` | Validates attribute values |
| `maxi-block-attributes.json` | Raw attribute data |
| `manifest.js` | Registry manifest |
| `normalizeAttributes.js` | Entry-point normaliser |

`ai/actions/actionPropertyAliases.js` — maps AI-generated property names to canonical Maxi attribute keys (e.g. `"fontSize"` → `"font-size-general"`).

---

## Lower-level Command Router

`ai/commands/commandRouter.js` — a separate, lower-level router used for slash commands and NL attribute patches. Distinct from `ai/router/commandRouter.js`.

```js
routeCommand(input, { blockName, registry })
  → { ok, patch: [Op], error, suggestions, humanSummary }
```

Input can be a slash command (`/set font-size 24`) or natural language. Returns an array of attribute patch operations built by `patchBuilder.js`.

| File | Purpose |
|---|---|
| `slashParser.js` | Parses `/command arg value` syntax |
| `nlParser.js` | Parses natural language attribute instructions |
| `patchBuilder.js` | `createSetOp`, `createIncrementOp`, `createToggleOp`, … |
| `patchValidators.js` | Validates ops before they reach the editor |
| `errorMessages.js` | Structured error messages |

`ai/editorBridge/` — applies patches to the block editor:
- `applyPatch.js` — applies a single patch
- `batchApplyPatch.js` — batches multiple patches
- `undoRedo.js` — undo/redo integration
- `selection.js` — selection helpers

---

## Suggestions & Typesense

`ai/suggestions/` — autocomplete suggestions shown in the chat input.

| File | Purpose |
|---|---|
| `typesenseClient.js` | Typesense search client |
| `suggestionsService.js` | Main service: queries Typesense + local |
| `localSuggest.js` | Local (offline) suggestions |
| `buildSuggestions.js` | Builds suggestion list |
| `cache.js` | Suggestion cache |
| `iconSearch.js` | Icon-specific suggestion search |
| `patternSearch.js` | Pattern-specific suggestion search |
| `suggestionTypes.js` | Suggestion type constants |

---

## Hooks

### `useAiChat.js`

The core hook (~5000 lines). Orchestrates the entire message lifecycle:

- Reads editor state (`selectedBlock`, `allBlocks`, `scope`)
- Calls `buildRoutingContext` + `routeClientSide`
- Dispatches on `RouteResult.type`
- Contains `handleCloudIconSearch` and `handleCreateBlock` async handlers
- Calls the PHP AI proxy for passthroughs
- Runs `parseAndExecuteAction` on AI responses
- Manages `messages`, `isLoading`, `conversationContext` state

### `useAiChatHistory.js`

Persists message history across panel open/close using `usePersistentState`.

### `usePersistentState.js`

Persists React state to `localStorage` with a key prefix.

### `useDraggable.js`

Makes the chat panel draggable within the viewport.

### `useDebounce.js`

Standard debounce hook used for input suggestions.

---

## Tests

34 Jest unit tests in `__tests__/`:

```
accordion.attributes.test.js    button.attributes.test.js
button.content-patterns.test.js button.icon-patterns.test.js
color.test.js                   column.attributes.test.js
commands.test.js                container.attributes.test.js
contextDetection.test.js        dc.attributes.test.js
divider.attributes.test.js      group.attributes.test.js
icon.attributes.test.js         iconFlow.test.js
image.attributes.test.js        meta.aAttributes.test.js
number-counter.attributes.test.js openFlowSidebar.test.js
relations.ops.test.js           shared.text-attributes.test.js
suggestions.test.js             targeting.test.js
text.attributes.test.js         typesenseSearch.test.js
...and more
```

Run with: `npm test`

---

## How to Add a New Block

1. **Create `ai/blocks/<block>.js`**

```js
export const MY_BLOCK_PATTERNS = [
  { regex: /some pattern/i, property: 'some_prop', value: 'someValue',
    selectionMsg: 'Done.', pageMsg: 'Applied to all.' },
];

export const handleMyBlockUpdate = (action, block) => {
  // Return attribute changes for complex cases
  return { 'some-attribute-general': action.value };
};
```

2. **Add `ai/prompts/<block>.js`** (optional but recommended)

```js
export default `MY_BLOCK: description of key properties and patterns.`;
```

3. **Register in `ai/registry.js`**

```js
import { MY_BLOCK_PATTERNS, handleMyBlockUpdate } from './blocks/my-block';
import MY_BLOCK_PROMPT from './prompts/my-block';

// Add to AI_BLOCKS array:
{
  key: 'my-block',
  match: blockName => blockName.includes('my-block'),
  target: 'my-block',
  patterns: MY_BLOCK_PATTERNS,
  handler: handleMyBlockUpdate,
  prompt: MY_BLOCK_PROMPT,
},
```

4. **Add a block sidebar target helper in `ai/blocks/<block>.js`** if the block has inspector accordion sections the AI should open.

---

## Debugging

| Method | Purpose |
|---|---|
| `window.__MAXI_AI_DEBUG_BG = true` | Log background color changes |
| `localStorage.maxiAiDebugBackground = '1'` | Persistent background debug |
| Browser console | `[Maxi AI]` prefixed logs from `useAiChat.js` |
| `[Maxi AI Debug]` logs | Action parsing and MODIFY_BLOCK scope logs |

The PHP proxy endpoint is at:
```
/wp-json/maxi-blocks/v1.0/ai/chat
```
