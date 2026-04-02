/**
 * Pure step-builder functions for multi-step AI flows.
 *
 * Each function returns a conversation step object that the flow engine
 * sends back to the chat panel to ask the user a question.
 * None of these functions modify state — they only produce plain objects.
 */

/**
 * Ask for a border style selection.
 *
 * @param {Array<{label: string, value: string}>} options
 * @returns {Object} ask_options conversation step
 */
export const askBorderStyle = (options) => ({
	action: 'ask_options',
	target: 'border_style',
	msg: 'Which border style?',
	options,
});

/**
 * Ask for a palette / colour selection.
 *
 * @param {string} target  - context key that will receive the chosen value
 * @param {string} msg     - question text shown to the user
 * @returns {Object} ask_palette conversation step
 */
export const askPalette = (target, msg) => ({
	action: 'ask_palette',
	target,
	msg,
});

/**
 * Ask for a border radius / corner style.
 *
 * @param {Array<{label: string, value: number|string}>} presets
 * @returns {Object} ask_options conversation step
 */
export const askRadius = (presets) => ({
	action: 'ask_options',
	target: 'radius_value',
	msg: 'Choose corner style:',
	options: presets,
});

/**
 * Ask for a shadow intensity selection.
 *
 * @param {boolean} includeOff - whether to add a "None / remove" option first
 * @returns {Object} ask_options conversation step
 */
export const askShadowIntensity = (includeOff = false) => ({
	action: 'ask_options',
	target: 'shadow_intensity',
	msg: 'Choose intensity:',
	options: [
		...(includeOff ? [{ label: 'None (remove shadow)', value: 'off' }] : []),
		{ label: 'Soft', value: 'soft' },
		{ label: 'Crisp', value: 'crisp' },
		{ label: 'Bold', value: 'bold' },
		{ label: 'Glow', value: 'glow' },
	],
});

/**
 * Ask for a text-polish mode.
 *
 * @returns {Object} ask_options conversation step
 */
export const askTextPolish = () => ({
	action: 'ask_options',
	target: 'text_polish',
	msg: 'How should I polish the typography?',
	options: [
		{ label: 'Standard / Safe (readability-first)', value: 'standard' },
		{ label: 'Modern / Clean (crisper hierarchy)', value: 'modern' },
		{ label: 'Bold / Full (high-impact emphasis)', value: 'bold' },
	],
});

/**
 * Build a generic apply step (used by the engine after all questions answered).
 *
 * @param {Object} attributes - the attribute map to write to the block
 * @param {string} message    - user-facing confirmation message
 * @returns {Object} apply conversation step
 */
export const applyStep = (attributes, message) => ({
	action: 'apply',
	attributes,
	done: true,
	message,
});
