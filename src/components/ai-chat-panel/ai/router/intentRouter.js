/**
 * Intent router — derives a typed RoutingContext from a raw message and
 * the current editor state. Pure (no side-effects, no React state access).
 *
 * The returned context is consumed by routeClientSide() in commandRouter.js.
 */

import {
	extractHexColor,
	extractUrl,
	getSpacingIntent,
} from '../utils/messageExtractors';
import {
	isInteractionBuilderMessage,
	isTextContextForMessage,
} from '../utils/contextDetection';
import { getRequestedTargetFromMessage } from '../patterns/targeting';

/**
 * Build a RoutingContext from a raw user message and relevant editor state.
 *
 * @param {string} rawMessage   The user's raw input text.
 * @param {Object} state
 * @param {import('./types').Scope}   state.currentScope   Active scope.
 * @param {Object|null}               state.selectedBlock  Currently selected Gutenberg block.
 * @param {Object}                    state.messagesRef    React ref pointing at the messages array.
 * @param {Array}                     state.allBlocks      All blocks on the current page.
 * @returns {import('./types').RoutingContext}
 */
export const buildRoutingContext = (
	rawMessage,
	{ currentScope, selectedBlock, messagesRef, allBlocks = [] }
) => {
	const lowerMessage = rawMessage.toLowerCase();
	const hexColor = extractHexColor( rawMessage );
	const isGlobalScope = currentScope === 'global';

	// ── Last clarification message ──────────────────────────────────────────
	const lastClarificationMsg = messagesRef?.current?.findLast(
		m => m.role === 'assistant' && m.options
	);
	const lastClarifyContent =
		typeof lastClarificationMsg?.content === 'string'
			? lastClarificationMsg.content.toLowerCase()
			: '';

	// ── Text / link detection ────────────────────────────────────────────────
	const isTextSelection =
		selectedBlock?.name?.includes( 'text-maxi' ) ||
		selectedBlock?.name?.includes( 'list-item-maxi' );
	const textLinkUrl = isTextSelection ? extractUrl( rawMessage ) : null;

	// ── Block type contexts ──────────────────────────────────────────────────
	const isButtonContext =
		lowerMessage.includes( 'button' ) ||
		!!selectedBlock?.name?.includes( 'button' );
	const isTextContext = isTextContextForMessage(
		lowerMessage,
		selectedBlock?.name
	);
	const isImageContext =
		lowerMessage.includes( 'image' ) ||
		!!selectedBlock?.name?.includes( 'image-maxi' );
	const isDividerContext =
		lowerMessage.includes( 'divider' ) ||
		!!selectedBlock?.name?.includes( 'divider-maxi' );
	const isContainerContext =
		lowerMessage.includes( 'container' ) ||
		!!selectedBlock?.name?.includes( 'container' );

	// Target-block shortcuts for attribute-group builders
	const metaTargetBlock = isButtonContext
		? 'button'
		: isTextContext
		? 'text'
		: isContainerContext
		? 'container'
		: null;

	const dcTargetBlock = isButtonContext
		? 'button'
		: isImageContext
		? 'image'
		: isDividerContext
		? 'divider'
		: isTextContext
		? 'text'
		: null;

	// ── Shape divider ────────────────────────────────────────────────────────
	const hasShapeDividerIntent = /\bshape\s*-?\s*divider\b/.test(
		lowerMessage
	);
	const hasShapeDividerStyle = /\b(wave|waves|curve|slant|triangle)\b/.test(
		lowerMessage
	);

	// ── Spacing helpers ──────────────────────────────────────────────────────
	const hasExplicitNumericValue =
		/\b\d+(?:\.\d+)?\s*(px|%|em|rem|vh|vw)?\b/.test( lowerMessage );
	const spacingIntent = getSpacingIntent( rawMessage );

	// ── Image context ─────────────────────────────────────────────────────────
	const isImageClarifyContext =
		lastClarifyContent.includes( 'image' ) ||
		lastClarifyContent.includes( 'images' ) ||
		lastClarifyContent.includes( 'photo' ) ||
		lastClarifyContent.includes( 'picture' );
	const isImageRequest =
		lowerMessage.includes( 'image' ) ||
		lowerMessage.includes( 'photo' ) ||
		lowerMessage.includes( 'picture' ) ||
		!!selectedBlock?.name?.includes( 'image' ) ||
		isImageClarifyContext;

	// ── Layout-pattern guards ────────────────────────────────────────────────
	const requestedTarget = getRequestedTargetFromMessage( lowerMessage, {
		selectedBlockName: selectedBlock?.name,
		hasShapeDividerIntent,
	} );
	const skipLayoutPatterns =
		requestedTarget === 'border' ||
		isInteractionBuilderMessage( lowerMessage );

	return {
		lowerMessage,
		hexColor,
		currentScope,
		isGlobalScope,
		isTextSelection,
		textLinkUrl,
		isButtonContext,
		isTextContext,
		isImageContext,
		isDividerContext,
		isContainerContext,
		metaTargetBlock,
		dcTargetBlock,
		hasShapeDividerIntent,
		hasShapeDividerStyle,
		hasExplicitNumericValue,
		spacingIntent,
		isImageRequest,
		isImageClarifyContext,
		lastClarifyContent,
		requestedTarget,
		skipLayoutPatterns,
		selectedBlock,
		allBlocks,
	};
};
