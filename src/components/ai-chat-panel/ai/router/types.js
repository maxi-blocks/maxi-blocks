/**
 * Routing types for the AI chat message routing system.
 *
 * The routing pipeline transforms a raw user message into a typed RouteResult
 * that the hook can act on without containing any pattern-matching logic itself.
 */

/**
 * @typedef {'selection'|'page'|'global'} Scope
 */

/**
 * Computed context derived from the raw message and current editor state.
 * Built once per message by buildRoutingContext() and passed to routeClientSide().
 *
 * @typedef {Object} RoutingContext
 * @property {string}       lowerMessage             Lower-cased raw message
 * @property {string|null}  hexColor                 Hex colour extracted from message, or null
 * @property {Scope}        currentScope             Active scope ('selection'|'page'|'global')
 * @property {boolean}      isGlobalScope            True when scope === 'global'
 * @property {boolean}      isTextSelection          True when selected block is a text/list-item block
 * @property {string|null}  textLinkUrl              URL extracted from message (text context only)
 * @property {boolean}      isButtonContext           True when message or selection refers to buttons
 * @property {boolean}      isTextContext             True when message or selection refers to text
 * @property {boolean}      isImageContext            True when message or selection refers to images
 * @property {boolean}      isDividerContext          True when message or selection refers to dividers
 * @property {boolean}      isContainerContext        True when message or selection refers to containers
 * @property {string|null}  metaTargetBlock          Resolved block type for meta/CSS actions
 * @property {string|null}  dcTargetBlock            Resolved block type for dynamic-content actions
 * @property {boolean}      hasShapeDividerIntent    Message mentions a shape divider
 * @property {boolean}      hasShapeDividerStyle     Message names a specific divider style
 * @property {boolean}      hasExplicitNumericValue  Message contains a CSS-like numeric value
 * @property {Object|null}  spacingIntent            Parsed spacing intent { base, side }
 * @property {boolean}      isImageRequest           Message or context targets an image block
 * @property {boolean}      isImageClarifyContext    Last clarification was about images
 * @property {string}       lastClarifyContent       Lower-cased content of last clarification message
 * @property {string|null}  requestedTarget          Explicit block target extracted from message
 * @property {boolean}      skipLayoutPatterns       Skip the LAYOUT_PATTERNS loop
 * @property {Object|null}  selectedBlock            Currently selected Gutenberg block (or null)
 * @property {Array}        allBlocks                All blocks on the current page
 */

/**
 * A direct action object ready for parseAndExecuteAction().
 *
 * @typedef {Object} DirectAction
 * @property {string}      action       Action type (e.g. 'update_selection', 'update_page')
 * @property {string}      [property]   Block property to update
 * @property {*}           [value]      New value
 * @property {string}      [target_block] Target block type
 * @property {Object}      [payload]    Bulk property updates
 * @property {string}      [message]    Human-readable confirmation message
 */

/**
 * A chat message object (matches the shape stored in the messages state array).
 *
 * @typedef {Object} ChatMessage
 * @property {'assistant'} role
 * @property {string}      content
 * @property {boolean}     [executed]
 * @property {Array}       [options]
 * @property {string}      [optionsType]
 * @property {string}      [colorTarget]
 * @property {string}      [originalMessage]
 * @property {string}      [targetContext]
 * @property {string}      [spacingBase]
 * @property {string}      [spacingSide]
 * @property {string}      [alignmentType]
 * @property {boolean}     [shapeDividerLocation]
 * @property {string}      [shapeDividerTarget]
 * @property {string}      [gapTarget]
 */

/**
 * Router matched a simple action — call queueDirectAction(payload).
 *
 * @typedef {Object} ActionResult
 * @property {'action'} type
 * @property {DirectAction} payload
 */

/**
 * Router wants to show a clarification message — push message to chat state.
 *
 * @typedef {Object} ClarifyResult
 * @property {'clarify'} type
 * @property {ChatMessage} message
 */

/**
 * Router triggered a flow (FSM) — set conversation context and show first prompt.
 *
 * @typedef {Object} FlowResult
 * @property {'flow'} type
 * @property {Object}           flowContext     Data for setConversationContext()
 * @property {ChatMessage}      message         Initial flow message to push
 * @property {string|null}      sidebarProperty Property to open in the inspector sidebar
 */

/**
 * Router resolved a flow step that applies immediately (no conversation needed).
 *
 * @typedef {Object} ImmediateUpdatesResult
 * @property {'immediate_updates'} type
 * @property {Array<{clientId: string, attributes: Object}>} updates
 * @property {ChatMessage}      message
 * @property {string|null}      sidebarProperty
 */

/**
 * Router identified a cloud-icon search request.
 * The hook handles the async search and attribute updates.
 *
 * @typedef {Object} CloudIconParams
 * @property {string}   rawMessage
 * @property {string}   lowerMessage
 * @property {Scope}    currentScope
 * @property {Object|null} selectedBlock
 * @property {Array}    iconBlocksInScope
 * @property {Array}    buttonBlocksInScope
 * @property {boolean}  wantsMultipleIcons
 * @property {boolean}  matchTitlesToIconsIntent
 * @property {boolean}  matchTitlesIntent
 * @property {boolean}  shouldTreatAsIconTheme
 * @property {boolean}  hasIconBlocksInScope
 *
 * @typedef {Object} CloudIconResult
 * @property {'cloud_icon'} type
 * @property {CloudIconParams} params
 */

/**
 * Router identified a pattern/block creation request.
 * The hook handles the async Cloud Library search and insertion.
 *
 * @typedef {Object} CreateBlockParams
 * @property {string}      rawMessage
 * @property {string|null} targetClientId  clientId of the block to replace (or null)
 *
 * @typedef {Object} CreateBlockResult
 * @property {'create_block'} type
 * @property {CreateBlockParams} params
 */

/**
 * Router opens the Maxi Cloud Library block in the editor (and may run Typesense search).
 *
 * @typedef {Object} OpenCloudLibraryParams
 * @property {string} rawMessage Original user message for query extraction.
 *
 * @typedef {Object} OpenCloudLibraryResult
 * @property {'open_cloud_library'} type
 * @property {OpenCloudLibraryParams} params
 */

/**
 * Router opens the Style Cards cloud library browser.
 *
 * @typedef {Object} ScActionParams
 * @property {'activate'|'reset'|'delete'|'edit'|'current'} action
 * @property {string} [name]       Card name (for activate / delete / edit).
 * @property {string} rawMessage
 *
 * @typedef {Object} ScActionResult
 * @property {'sc_action'} type
 * @property {ScActionParams} params
 */

/**
 * @typedef {Object} BrowseCloudSCParams
 * @property {string}  query       Optional keyword extracted from the message (e.g. "dark", "minimal").
 * @property {string}  category    Optional color category extracted from the message (e.g. "Red", "Blue").
 * @property {boolean} importFirst  True when the user's intent is to import (auto-click first preview).
 * @property {boolean} showLocalOnly True when the user just wants to see local/saved style cards
 *                                   (opens SC editor only, skips the cloud library browser).
 * @property {string}  rawMessage   Original user message.
 *
 * @typedef {Object} BrowseCloudSCResult
 * @property {'browse_cloud_sc'} type
 * @property {BrowseCloudSCParams} params
 */

/**
 * No client-side pattern matched — send to the AI API.
 *
 * @typedef {Object} PassthroughResult
 * @property {'passthrough'} type
 */

/**
 * Discriminated union of all possible router outcomes.
 *
 * @typedef {ActionResult|ClarifyResult|FlowResult|ImmediateUpdatesResult|CloudIconResult|CreateBlockResult|OpenCloudLibraryResult|BrowseCloudSCResult|PassthroughResult} RouteResult
 */
