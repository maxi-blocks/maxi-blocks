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

const sanitizeUniqueID = sanitizeAnchorId;


export const extractAnchorLink = message => {
	const lowerMessage = String(message || '').toLowerCase();
	if (/https?:\/\//.test(lowerMessage) || /\bwww\./.test(lowerMessage)) {
		return null;
	}
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

export const extractUniqueID = message => {
	const lowerMessage = String(message || '').toLowerCase();
	const hasUniqueHint = /\bunique[\s_-]*id\b|\buniqueid\b|\bunique_id\b/.test(
		lowerMessage
	);
	if (!hasUniqueHint) return null;

	const quoted = extractQuotedText(message);
	const raw =
		quoted ||
		extractValueFromPatterns(message, [
			/(?:unique[\s_-]*id|uniqueid|unique_id)\s*(?:to|=|:|is)?\s*([a-zA-Z0-9-_]+)/i,
		]);
	if (!raw) return null;
	const cleaned = sanitizeUniqueID(raw);
	return cleaned || null;
};

export const extractFirstOnHierarchy = message => {
	const lowerMessage = String(message || '').toLowerCase();
	if (
		!/(first\s*on\s*hierarchy|top[-\s]*level|root\s*level|top\s*of\s*hierarchy|primary\s*level)/.test(
			lowerMessage
		)
	) {
		return null;
	}

	if (/(disable|off|remove|unset|false|no)\b/.test(lowerMessage)) return false;
	if (/(enable|on|set|true|make|mark)\b/.test(lowerMessage)) return true;
	return true;
};

export const extractRelations = message => {
	const lowerMessage = String(message || '').toLowerCase();
	if (!/\brelations?\b/.test(lowerMessage)) return null;

	if (/(clear|remove|reset)\s*relations?/.test(lowerMessage)) {
		return [];
	}

	const start = message.indexOf('[');
	const end = message.lastIndexOf(']');
	if (start !== -1 && end > start) {
		try {
			const parsed = JSON.parse(message.slice(start, end + 1));
			return Array.isArray(parsed) ? parsed : null;
		} catch (error) {
			return null;
		}
	}

	return null;
};

const buildActionTarget = (actionType, targetBlock) => {
	if (actionType !== 'update_page') {
		return {};
	}
	if (targetBlock) {
		return { target_block: targetBlock };
	}
	return {};
};

export const buildMetaAGroupAction = (
	message,
	{ scope = 'selection', targetBlock } = {}
) => {
	const actionType = scope === 'page' ? 'update_page' : 'update_selection';
	const actionTarget = buildActionTarget(actionType, targetBlock);

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

	const uniqueID = extractUniqueID(message);
	if (uniqueID) {
		return {
			action: actionType,
			property: 'unique_id',
			value: uniqueID,
			message: 'Unique ID set.',
			...actionTarget,
		};
	}

	const relations = extractRelations(message);
	if (Array.isArray(relations)) {
		return {
			action: actionType,
			property: 'relations',
			value: relations,
			message: 'Relations updated.',
			...actionTarget,
		};
	}

	const firstOnHierarchy = extractFirstOnHierarchy(message);
	if (typeof firstOnHierarchy === 'boolean') {
		return {
			action: actionType,
			property: 'is_first_on_hierarchy',
			value: firstOnHierarchy,
			message: 'Hierarchy position updated.',
			...actionTarget,
		};
	}

	return null;
};

export const buildMetaAGroupAttributeChanges = (
	property,
	value,
	{ attributes = {}, targetKey = 'container' } = {}
) => {
	if (!property) return null;
	const textValue = String(value || '');
	switch (property) {
		case 'anchor_link':
			return { anchorLink: textValue };
		case 'unique_id':
			return { uniqueID: textValue };
		case 'aria_label': {
			return {
				ariaLabels: {
					...(attributes?.ariaLabels || {}),
					[targetKey]: textValue,
				},
			};
		}
		case 'relations':
			return { relations: Array.isArray(value) ? value : [] };
		case 'is_first_on_hierarchy':
			return { isFirstOnHierarchy: Boolean(value) };
		default:
			return null;
	}
};

export const getMetaSidebarTarget = property => {
	if (!property) return null;
	if (property === 'anchor_link') {
		return { tabIndex: 1, accordion: 'add anchor link' };
	}
	if (property === 'unique_id') {
		return { tabIndex: 0, accordion: 'block settings' };
	}
	if (property === 'aria_label') {
		return { tabIndex: 1, accordion: 'aria label' };
	}
	if (property === 'is_first_on_hierarchy') {
		return { tabIndex: 0, accordion: 'block settings' };
	}
	if (property === 'relations') {
		return { tabIndex: 1, accordion: 'interaction builder' };
	}
	return null;
};

export const resolveMetaTargetKey = blockName => {
	const name = String(blockName || '').toLowerCase();
	if (name.includes('button')) return 'button';
	if (name.includes('text-maxi') || name.includes('list-item-maxi')) return 'text';
	if (name.includes('container')) return 'container';
	return 'container';
};

export default {
	extractAnchorLink,
	extractAriaLabel,
	buildMetaAGroupAction,
	buildMetaAGroupAttributeChanges,
	getMetaSidebarTarget,
	resolveMetaTargetKey,
	extractFirstOnHierarchy,
	extractRelations,
};
