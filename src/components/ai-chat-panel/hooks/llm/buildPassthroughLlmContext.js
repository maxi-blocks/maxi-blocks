/**
 * Internal dependencies
 */
import { buildStyleCardContext } from '../../ai/style-card';

/**
 * Recursive block summary for LLM context (subset of attrs, capped depth).
 *
 * @param {Object|null} block Block editor block object.
 * @param {number}      depth Nesting depth (capped at 4).
 * @returns {Object|null} Summary tree or null.
 */
export function summarizeBlockStructure(block, depth = 0) {
	if (!block || depth > 4) return null;

	const summary = {
		name: block.name,
		clientId: block.clientId,
		attributes: {
			...(block.attributes.layout ? { layout: block.attributes.layout } : {}),
			...(block.attributes.style ? { style: block.attributes.style } : {}),
			...(block.attributes.tagName ? { tagName: block.attributes.tagName } : {}),
			...(block.attributes.className ? { className: block.attributes.className } : {}),
			...(block.attributes.containerWidth
				? { containerWidth: block.attributes.containerWidth }
				: {}),
			...(block.attributes.contentWidth
				? { contentWidth: block.attributes.contentWidth }
				: {}),
		},
	};

	if (block.innerBlocks && block.innerBlocks.length > 0) {
		summary.innerBlocks = block.innerBlocks
			.map(child => summarizeBlockStructure(child, depth + 1))
			.filter(Boolean);
	}

	return summary;
}

/**
 * Appends selected-block details (full attributes + summarized inner tree) to context.
 *
 * @param {string}        context       Mutable context string (concat target).
 * @param {Object|null}   selectedBlock Selected block.
 * @param {Function}      logDebug      Optional logger.
 * @returns {string} Updated context.
 */
function appendSelectedBlockFocusContext(context, selectedBlock, logDebug) {
	if (!selectedBlock) {
		return `${context}\n\nNo block is currently selected.`;
	}
	const blockSummary = summarizeBlockStructure(selectedBlock);
	logDebug('Context Loop - Block Summary:', blockSummary);
	let next = `${context}\n\nUser has selected: ${selectedBlock.name}\nAttributes: ${JSON.stringify(
		selectedBlock.attributes,
		null,
		2
	)}`;
	if (blockSummary?.innerBlocks?.length > 0) {
		next += `\n\nInner Structure (Recursive): ${JSON.stringify(blockSummary.innerBlocks, null, 2)}`;
	}
	return next;
}

/**
 * Builds the scope + block + style-card string injected as "Context: ..." for passthrough LLM calls.
 * Selection scope includes the selected block once; page/global append a focus hint when a block is selected.
 *
 * @param {Object}        params
 * @param {string}        params.scope           'page' | 'selection' | 'global'
 * @param {Object|null}   params.selectedBlock   Selected block from the block editor, if any.
 * @param {Object}        params.activeStyleCard Active style card snapshot for context.
 * @param {Function}      params.logDebug        Debug logger (no-op when AI debug is off).
 * @returns {string} Context string for the second system message.
 */
export function buildPassthroughLlmContext({
	scope,
	selectedBlock,
	activeStyleCard,
	logDebug = () => {},
}) {
	let context = '';
	context += `\n\nUSER INTENT SCOPE: ${scope.toUpperCase()}`;
	context += `\n- SELECTION: Apply change only to the selected block.`;
	context += `\n- PAGE: Apply change to all relevant blocks on the entire page (use update_page).`;
	context += `\n- GLOBAL: Apply change to the site-wide Style Card (use update_style_card for specific tokens; apply_theme for vibes/palettes).`;
	context += `\n\nIMPORTANT: The user has explicitly selected to apply changes to "${scope.toUpperCase()}".`;

	if (scope === 'global') {
		context += `\nUse "update_style_card" for specific token changes (fonts, sizes, heading/body/button colors, palette slots).`;
		context += `\nUse "apply_theme" only for overall theme/aesthetic or palette generation requests.`;
		context += `\nExample: { "action": "update_style_card", "updates": { "headings": { "font-family-general": "Cormorant Garamond" } }, "message": "Updated heading font." }`;
	} else if (scope === 'selection') {
		context += `\n\nCRITICAL: You are in SELECTION mode. You MUST use the "update_selection" action.`;
		context += `\nThis targets the selected block AND its inner blocks (recursively).`;
		context += `\nDo not use update_page (would affect unselected) or apply_responsive_spacing (use update_selection instead).`;
		context = appendSelectedBlockFocusContext(context, selectedBlock, logDebug);
	} else if (scope === 'page') {
		context += `\n\nCRITICAL: You are in PAGE mode. You SHOULD use "update_page" or "apply_responsive_spacing" to affect multiple blocks if requested.`;
	}

	// Page / global: optional focus block without duplicating selection payload.
	if (scope !== 'selection') {
		context = appendSelectedBlockFocusContext(context, selectedBlock, logDebug);
	}

	const styleCardContext = buildStyleCardContext(activeStyleCard);
	if (styleCardContext) {
		context += styleCardContext;
	}

	return context;
}
