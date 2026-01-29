const extractQuotedText = message => {
	if (!message) return null;
	const match = message.match(/["']([^"']+)["']/);
	return match ? match[1].trim() : null;
};

const extractValueFromPatterns = (message, patterns) => {
	if (!message) return null;
	for (const pattern of patterns) {
		const match = message.match(pattern);
		if (match && match[1]) return match[1].trim();
	}
	return null;
};

const sanitizeAnchorId = value =>
	String(value || '').replace(/[^a-zA-Z0-9-_]/g, '');

export const extractAnchorLink = message => {
	const lowerMessage = String(message || '').toLowerCase();
	const hasAnchorHint = /anchor|section\s*(?:id|anchor)|jump\s*link|in[-\s]*page\s*link/.test(
		lowerMessage
	);
	const quoted = hasAnchorHint ? extractQuotedText(message) : null;
	const raw =
		quoted ||
		extractValueFromPatterns(message, [
			/(?:anchor(?:[\s_-]*(?:link|id|name))?|section\s*(?:id|anchor)|jump\s*link|in[-\s]*page\s*link)\s*(?:to|=|:|is)?\s*(#?[a-zA-Z0-9-_]+)/i,
			/(?:set|use)\s*(?:#?([a-zA-Z0-9-_]+))\s*(?:as\s*)?(?:the\s*)?(?:anchor(?:\s*(?:id|link|name))?|section\s*id)/i,
		]);
	if (!raw) return null;
	const cleaned = sanitizeAnchorId(String(raw).replace(/^#/, ''));
	return cleaned || null;
};

export const extractAriaLabel = message => {
	const lowerMessage = String(message || '').toLowerCase();
	const hasAriaHint = /aria|accessibility|screen\s*reader/.test(lowerMessage);
	const quoted = hasAriaHint ? extractQuotedText(message) : null;
	if (quoted) return quoted;
	return extractValueFromPatterns(message, [
		/(?:aria[\s_-]*label|accessibility\s*label|screen\s*reader\s*label)\s*(?:to|=|:|is)?\s*(.+)$/i,
	]);
};

export const buildContainerMetaAction = (message, { scope = 'selection' } = {}) => {
	const actionType = scope === 'page' ? 'update_page' : 'update_selection';
	const actionTarget = actionType === 'update_page' ? { target_block: 'container' } : {};

	const anchorLink = extractAnchorLink(message);
	if (anchorLink) {
		return {
			action: actionType,
			property: 'anchor_link',
			value: anchorLink,
			message: 'Anchor set.',
			...actionTarget,
		};
	}

	const ariaLabel = extractAriaLabel(message);
	if (ariaLabel) {
		return {
			action: actionType,
			property: 'aria_label',
			value: ariaLabel,
			message: 'Aria label set.',
			...actionTarget,
		};
	}

	return null;
};

export const validateContainerMetaAction = action => {
	if (!action || typeof action !== 'object') {
		return { ok: false, error: 'Missing action.' };
	}
	if (!['anchor_link', 'aria_label'].includes(action.property)) {
		return { ok: false, error: 'Unsupported property.' };
	}
	if (typeof action.value !== 'string' || !action.value.trim()) {
		return { ok: false, error: 'Invalid value.' };
	}
	return { ok: true };
};

export const buildContainerMetaAttributeChanges = (
	property,
	value,
	attributes = {}
) => {
	const textValue = String(value || '');

	switch (property) {
		case 'anchor_link':
			return { anchorLink: textValue };
		case 'aria_label':
			return {
				ariaLabels: {
					...(attributes?.ariaLabels || {}),
					container: textValue,
				},
			};
		default:
			return null;
	}
};

export const buildContainerMetaPatch = (property, value) => {
	const textValue = String(value || '');
	switch (property) {
		case 'anchor_link':
			return [{ op: 'set', path: 'anchorLink', value: textValue }];
		case 'aria_label':
			return [
				{ op: 'set', path: 'ariaLabels.container', value: textValue },
			];
		default:
			return [];
	}
};

export const getContainerMetaSidebarTarget = property => {
	if (property === 'anchor_link') {
		return { tabIndex: 1, accordion: 'add anchor link' };
	}
	if (property === 'aria_label') {
		return { tabIndex: 1, accordion: 'aria label' };
	}
	return null;
};

export default {
	extractAnchorLink,
	extractAriaLabel,
	buildContainerMetaAction,
	validateContainerMetaAction,
	buildContainerMetaAttributeChanges,
	buildContainerMetaPatch,
	getContainerMetaSidebarTarget,
};
