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
12. [Recovery System](#recovery-system)
13. [Icon & Pattern Search](#icon--pattern-search)
14. [Prompt System](#prompt-system)
15. [Attribute System](#attribute-system)
16. [Lower-level Command Router](#lower-level-command-router)
17. [Suggestions & Typesense](#suggestions--typesense)
18. [Hooks](#hooks)
19. [Tests](#tests)
20. [How to Add a New Block](#how-to-add-a-new-block)
21. [Debugging](#debugging)

---

## Overview

The Maxi AI system is a natural-language interface embedded in the Gutenberg block editor. It lets users describe design changes in plain English ("make the heading bigger", "add a blue border to the selected container", "set the button text to Buy now") and applies them directly to blocks — or sends complex queries to an AI API (OpenAI / Anthropic / Gemini) for reasoning.

**Key design principles:**

- **Router-first**: A client-side pattern-matching pipeline handles the majority of common requests instantly, without an API call.
- **Separation of concerns**: The router returns a typed `RouteResult` (data only). The hook layer owns all side effects (state, block dispatch, API calls).
- **Pure routing functions**: `buildRoutingContext` and `routeClientSide` have no React dependencies; they can be tested independently.
- **Three scopes**: Every action is applied to either the *selection* (one block), the *page* (all matching blocks), or *global* (Style Card tokens).
- **Modular hooks**: `useAiChat.js` is a thin orchestrator that composes eight focused sub-hooks. Each sub-hook is responsible for one cohesive area (drag, blocks, sidebar, cloud, recovery, actions, messages).
- **Recovery over failure**: When an operation cannot proceed, the system builds a conversational recovery response with action chips instead of showing a generic error.

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
│   ├── useAiChat.js            Thin orchestrator — composes all sub-hooks, exposes public API
│   ├── useAiChatActions.js     parseAndExecuteAction, normalizeActionProperty, resolveButtonIconFromTypesense
│   ├── useAiChatBlocks.js      handleUpdatePage, handleUpdateSelection, applyHoverAnimation
│   ├── useAiChatCloud.js       getContentAreaClientId, runCloudLibraryIntent (FSE + Cloud Library)
│   ├── useAiChatDrag.js        Panel drag-and-drop state and mouse event handlers
│   ├── useAiChatHistory.js     Persistent message history (load/save/delete)
│   ├── useAiChatMessages.js    sendMessage, handleKeyDown, handleSuggestion
│   ├── useAiChatRecovery.js    buildRecoveryResponse, handleRecoveryChoice
│   ├── useAiChatSidebar.js     openSidebarForProperty — maps properties to sidebar panels
│   ├── useDebounce.js          Standard debounce hook
│   ├── useDraggable.js         Lower-level draggable primitive
│   └── usePersistentState.js   Persists state to localStorage
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
useAiChatMessages.js  sendMessage()
        │
        ├─ Check conversationContext (recovery / insert_block / color_what flows)
        │       → if active context, route to handleRecoveryChoice() or flow handler
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
        │   ├─ 'insert_block'     → createBlock() + insertBlocks() with FSE-aware rootClientId
        │   ├─ 'cloud_icon'       → handleCloudIconSearch() async
        │   ├─ 'create_block'     → runCloudLibraryIntent() async (Cloud Library)
        │   └─ 'passthrough'      → send to AI API  ──────────────┐
        │                                                          │
        │                                           PHP proxy endpoint
        │                                     /wp-json/maxi-blocks/v1.0/ai/chat
        │                                     (OpenAI / Anthropic / Gemini)
        │                                                          │
        └─ parseAndExecuteAction(aiResponse.action)  ◄────────────┘
                → attribute patch → updateBlockAttributes()
                → on failure     → buildRecoveryResponse() with option chips
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
| 0 | `routePostManagement` | publish, save, draft, set title, set slug, preview, schedule — **runs first** to prevent mis-routing to text/font handlers |
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

When `routeClientSide` returns `{ type: 'passthrough' }`, `useAiChatMessages.js` builds a prompt and POSTs to the WordPress REST endpoint:

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

`parseAndExecuteAction()` in `useAiChatActions.js` handles each action type:

| Action | What it does |
|---|---|
| `MODIFY_BLOCK` | Update one or more blocks' attributes |
| `MODIFY_BLOCK op:add` | Insert a new blank Maxi block |
| `CLARIFY` | Push a clarification message with option buttons |
| `CLOUD_MODAL_UI` | Drive the Cloud Library UI to insert a pattern |
| `update_style_card` | Update Style Card tokens (global scope) |
| `apply_theme` | Apply an aesthetic theme preset |
| `update_selection` | Update selected block attributes directly |
| `update_page` | Batch-update all matching blocks on page |

> **Note:** Post/page management commands (`publish`, `save`, `draft`, `set_title`, `set_slug`, `preview`, `schedule`) are handled entirely client-side by `routePostManagement` and never reach the AI API.

---

## Layer 3 — Action Execution

### `useAiChatActions.js` — `parseAndExecuteAction(action, context)`

The main action dispatcher. Handles property normalisation, scope resolution, and block attribute writes.

**Property normalisation** — `normalizeActionProperty(property, value)` resolves aliases (via `ai/actions/actionPropertyAliases.js`), strips dashes, detects breakpoint suffixes (`_general`, `_xl`, etc.), and routes to the right handler.

**Scope resolution for `MODIFY_BLOCK`:**
- `selection` → operates on `selectedBlock` only
- `page` → `collectBlocks(allBlocks, matchFn)` to find all relevant blocks

**Attribute writes** — `updateBlockAttributes(clientId, attributes)` from `core/block-editor`.

**Failure path** — when an attribute patch cannot be applied (no selection, wrong block type, etc.), the action calls `buildRecoveryResponse()` and adds option chips to the chat instead of showing a bare error string.

### `queueDirectAction(payload)` (in `useAiChatMessages.js`)

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
| `colorClarify.js` | `getColorTargetFromMessage(msg, block)` resolves ambiguous colour targets; `buildColorUpdate(target, color, block)` builds the attribute patch |
| `backgroundUpdate.js` | `updateBackgroundColor(clientId, color, attrs, prefix)` — always ensures a colour background layer exists, creating a default one if needed |
| `color.tokens.js` / `tokens.js` | Maxi color token mapping |
| `palette.js` | Palette slot resolution |
| `colorSuggest.js` | Color suggestion helpers |
| `normalizeColor.js` | Normalises hex, rgb, named colors |

**Background layer behaviour:** `updateBackgroundColor` always processes `background-layers`. If the attribute is `undefined` or an empty array, a new default `"color"` layer is created. This means the AI can add a colour background layer even when none previously existed.

**Colour target disambiguation:** `getColorTargetFromMessage` returns `'element'` for ambiguous inputs (e.g. bare "change colour"), triggering the clarification flow ("Colour of what would you like to change?") rather than inferring a target aggressively.

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
- Colour — asks which element if ambiguous (`color_what` context)

**`conversationContext` shapes used:**

| `mode` | Triggered by | Purpose |
|---|---|---|
| `recovery` | Failure paths | Offer contextual recovery options |
| `insert_block` | Block insertion failure | Ask where/how to insert |
| `color_what` | Ambiguous colour request | Ask which element to colour |
| flow key (e.g. `spacing`) | `flow_*` route | Multi-step flow disambiguation |

---

## Recovery System

`useAiChatRecovery.js` — replaces bare error strings with a conversational recovery path.

**`buildRecoveryResponse(failureType, context)`**

Called from failure paths inside `parseAndExecuteAction`, `sendMessage`, and `handleSuggestion`. Returns a message object with:
- A human-readable explanation of what went wrong
- An `options` array of labeled chips the user can click

Failure types handled: `no_selection`, `no_blocks_inserted`, `wrong_block_type`, `flow_state_error`, `lost_track`, and more.

**`handleRecoveryChoice(choice, context)`**

Called when the user clicks a recovery chip. Dispatches the chosen recovery action:
- Retry the original operation
- Select a block and try again
- Open the Cloud Library
- Start over

**Forward reference pattern:** `useAiChatRecovery` depends on `sendMessage` (defined later in `useAiChatMessages`). The orchestrator (`useAiChat.js`) creates a `sendMessageRef` and passes a stable proxy `(...args) => sendMessageRef.current?.(...args)` to the recovery hook, then sets `sendMessageRef.current = sendMessage` after messages hook is initialised.

---

## Icon & Pattern Search

### Cloud Icon Search

Triggered by `cloud_icon` route result. `handleCloudIconSearch()` in `useAiChatMessages.js`:

1. Extracts icon query from message (`extractIconQuery`, `extractIconQueries`)
2. Searches Typesense via `findBestIcon()` / `findIconCandidates()`
3. Detects style intent (`extractIconStyleIntent`, `stripIconStylePhrases`)
4. Applies SVG to icon blocks (`updateBlockAttributes`)
5. Optionally matches icons to titles (`matchTitlesToIconsIntent`)

`ai/icons/` — icon search and suggestion helpers.
`ai/patterns/cloudIcon.js` — the `CLOUD_ICON_PATTERN` regex entry for `LAYOUT_PATTERNS`.

### Cloud Library Pattern Search

Triggered by `create_block` route result. `runCloudLibraryIntent()` in `useAiChatCloud.js`:

1. `extractPatternQuery(rawMessage)` — extracts the search term
2. `findBestPattern(query)` — searches the Cloud Library REST API
3. `onRequestInsertPattern(gutenbergCode, false, true, targetClientId)` — inserts the pattern

### Direct Block Insertion

Triggered by `insert_block` route result (for primitive types: container, row, column):

```js
createBlock('maxi-blocks/container-maxi')
dispatch('core/block-editor').insertBlocks(newBlock, undefined, rootClientId)
```

`rootClientId` is resolved via `getContentAreaClientId()` (in `useAiChatCloud.js`), which recursively walks the block tree to find the `core/post-content` block in FSE (Full Site Editing) themes. This prevents blocks being inserted at the template root level (header/footer area) instead of the page content area.

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

The hook layer is split into one thin orchestrator and eight focused sub-hooks. All sub-hooks receive their dependencies as explicit arguments (no circular imports).

### `useAiChat.js` — Orchestrator (~320 lines)

Owns all top-level React state and WordPress data selectors:
- `messages`, `input`, `isLoading`, `scope`, `scopeChosen`, `conversationContext`, `showHistory`
- `useSelect` for `selectedBlock`, `allBlocks`, `postTypeLabel`
- `useDispatch` for `updateBlockAttributes`, `undoPost`, `undoSite`
- `useRegistry` for transactional batch writes

Composes sub-hooks in dependency order, exposes the public API returned to `AiChatPanel.js`.

Handles undo, scope change, auto-scope-reset, scroll-to-bottom, and palette colour helpers directly (they are trivial and don't warrant extraction).

### `useAiChatDrag.js` (~62 lines)

Panel drag-and-drop. Manages `position`, `isDragging`, `dragOffset` state and `handleMouseDown`, `handleMouseMove`, `handleMouseUp` event handlers. Cleans up global listeners via `useEffect`.

### `useAiChatBlocks.js` (~637 lines)

Core block manipulation:
- `handleUpdatePage(action)` — applies attribute changes to all matching blocks on the page
- `handleUpdateSelection(action)` — applies attribute changes to the currently selected block, with Interaction Builder / relations support and a parent-fallback for block types that can't accept the target attribute directly. Uses `skipParentFallback` guard for direct `selected` scope operations.
- `applyHoverAnimation(clientId, animationType)` — writes hover animation attributes

Always reads fresh block data via `select('core/block-editor').getBlock(clientId)` for imperative writes — never relies on the stale `allBlocks` snapshot from `useSelect`.

### `useAiChatSidebar.js` (~313 lines)

`openSidebarForProperty(property, block)` — maps a block property name to the correct sidebar accordion panel and tab, then dispatches the appropriate panel-open action. Imports all `get*SidebarTarget` helpers from the `ai/utils/` group files.

### `useAiChatCloud.js` (~197 lines)

FSE context detection and Cloud Library integration:
- `getContentAreaClientId()` — recursively walks the block tree to find `core/post-content`; returns `undefined` on non-FSE setups
- `runCloudLibraryIntent(query, targetClientId)` — searches the Cloud Library, drives the Cloud Modal UI, and inserts the best pattern

### `useAiChatRecovery.js` (~219 lines)

Conversational recovery system:
- `buildRecoveryResponse(failureType, context)` — returns a message object with option chips
- `handleRecoveryChoice(choice, context)` — dispatches recovery actions (retry, select block, open Cloud Library, reset)

Receives `sendMessage` as a forwarded reference from the orchestrator to avoid a circular dependency with `useAiChatMessages`.

### `useAiChatActions.js` (~1285 lines)

Action parsing and execution:
- `parseAndExecuteAction(action, context)` — the main AI response dispatcher; handles all action types (`MODIFY_BLOCK`, `CLARIFY`, `CLOUD_MODAL_UI`, `update_selection`, `update_page`, `update_style_card`, `apply_theme`)
- `normalizeActionProperty(property, value)` — resolves aliases, strips dashes, detects breakpoint suffixes
- `resolveButtonIconFromTypesense(query)` — async Typesense lookup for button icon SVG

Contains an inner `openSidebarForProperty` that extends the hook-level version with link/text-link toolbar handling specific to `parseAndExecuteAction` context.

### `useAiChatMessages.js` (~1344 lines)

User message handling:
- `sendMessage(text?, opts?)` — full message pipeline: context checks → routing → API call → action execution → recovery fallback
- `handleKeyDown(e)` — keyboard handler (Enter to send, Shift+Enter for newline)
- `handleSuggestion(suggestion)` — handles clicks on suggestion chips and option buttons

Contains `handleCloudIconSearch` and `queueDirectAction` as inner functions.

### `useAiChatHistory.js` (~97 lines)

Persists message history across panel open/close using `usePersistentState`. Exposes `chatHistory`, `currentChatId`, `saveCurrentChat`, `startNewChat`, `loadChat`, `deleteHistoryItem`.

### `usePersistentState.js`

Persists React state to `localStorage` with a key prefix.

### `useDraggable.js`

Lower-level draggable primitive (used by `useAiChatDrag`).

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
| `window.maxiBlocksDebug = true` | Enable all `[Maxi AI Debug]` logs |
| Browser console `[Maxi AI]` prefix | General operational logs from hook layer |
| Browser console `[Maxi AI Debug]` prefix | Verbose action parsing / MODIFY_BLOCK scope logs |
| Browser console `[Maxi AI Intercept]` prefix | Direct (router-bypassing) action execution logs |

The PHP proxy endpoint is at:
```
/wp-json/maxi-blocks/v1.0/ai/chat
```
