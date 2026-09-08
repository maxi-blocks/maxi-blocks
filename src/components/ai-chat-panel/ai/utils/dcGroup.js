const DC_BOOLEAN_ATTRIBUTES = new Set([
	'dc-status',
	'dc-hide',
	'dc-contains-html',
	'dc-custom-delimiter-status',
	'dc-keep-only-text-content',
	'dc-hour12',
	'dc-link-status',
]);

const DC_NUMBER_ATTRIBUTES = new Set([
	'dc-accumulator',
	'dc-image-accumulator',
	'dc-acf-char-limit',
	'dc-author',
	'dc-id',
	'dc-limit',
	'dc-media-id',
	'dc-media-size',
]);

const DC_URL_ATTRIBUTES = new Set(['dc-link-url', 'dc-media-url']);

const normalizeDcProperty = raw =>
	String(raw || '')
		.trim()
		.toLowerCase()
		.replace(/[^a-z0-9_-]+/g, '')
		.replace(/_/g, '-');

const extractDcToken = message => {
	const match = String(message || '').match(/\bdc[-_][a-z0-9_-]+\b/i);
	if (!match) return null;
	const normalized = normalizeDcProperty(match[0]);
	if (!normalized.startsWith('dc-')) return null;
	return { property: normalized, rawToken: match[0] };
};

const parseBooleanIntent = message => {
	const lower = String(message || '').toLowerCase();
	if (/(disable|disabled|off|false|no|remove|stop)\b/.test(lower)) return false;
	if (/(enable|enabled|on|true|yes|add|start|activate)\b/.test(lower))
		return true;
	return null;
};

const extractNumber = message => {
	const match = String(message || '').match(/-?\d+(?:\.\d+)?/);
	if (!match) return null;
	const num = Number(match[0]);
	return Number.isFinite(num) ? num : null;
};

const extractQuotedValue = message => {
	const match = String(message || '').match(/["']([^"']+)["']/);
	return match ? match[1] : null;
};

const extractUrl = message => {
	const match = String(message || '').match(/https?:\/\/[^\s'"]+/i);
	return match ? match[0] : null;
};

const extractStringValue = (message, rawToken) => {
	const quoted = extractQuotedValue(message);
	if (quoted) return quoted;

	const lower = String(message || '').toLowerCase();
	const token = String(rawToken || '').toLowerCase();
	const tokenIndex = token ? lower.indexOf(token) : -1;
	const tail =
		tokenIndex >= 0 ? String(message).slice(tokenIndex + token.length) : message;

	const afterMatch = String(tail).match(/(?:to|as|=|:)\s*([^\n]+)/i);
	const candidate = (afterMatch ? afterMatch[1] : tail).trim();
	if (!candidate) return null;

	return candidate.replace(/^[\"']|[\"']$/g, '').trim();
};

const buildDcGroupAction = (
	message,
	{ scope = 'selection', targetBlock = null } = {}
) => {
	const rawMessage = String(message || '');
	const lower = rawMessage.toLowerCase();
	const actionType = scope === 'page' ? 'update_page' : 'update_selection';
	const actionTarget =
		actionType === 'update_page' && targetBlock
			? { target_block: targetBlock }
			: {};
	if (actionType === 'update_page' && !targetBlock) {
		return null;
	}

	let tokenData = extractDcToken(rawMessage);

	if (!tokenData && /(dynamic\s*content|dynamic|dc)\b/.test(lower)) {
		const statusIntent = parseBooleanIntent(lower);
		if (typeof statusIntent === 'boolean') {
			tokenData = { property: 'dc-status', rawToken: 'dynamic content' };
		}
	}

	if (!tokenData) return null;

	const { property, rawToken } = tokenData;
	let value = null;

	if (DC_BOOLEAN_ATTRIBUTES.has(property)) {
		const intent = parseBooleanIntent(lower);
		value = typeof intent === 'boolean' ? intent : true;
	} else if (DC_NUMBER_ATTRIBUTES.has(property)) {
		value = extractNumber(rawMessage);
		if (value === null) return null;
	} else if (DC_URL_ATTRIBUTES.has(property)) {
		value = extractUrl(rawMessage) || extractStringValue(rawMessage, rawToken);
		if (!value) return null;
	} else {
		value = extractStringValue(rawMessage, rawToken);
		if (!value) return null;
	}

	return {
		action: actionType,
		property: property.replace(/-/g, '_'),
		value,
		message: 'Dynamic content updated.',
		...actionTarget,
	};
};

const buildDcGroupAttributeChanges = (property, value) => {
	if (!property) return null;
	const normalized = normalizeDcProperty(property);
	if (!normalized.startsWith('dc-')) return null;
	return { [normalized]: value };
};

const getDcGroupSidebarTarget = (property, blockName = '') => {
	if (!property) return null;
	const normalized = normalizeDcProperty(property);
	if (!normalized.startsWith('dc-')) return null;
	if (normalized.startsWith('dc-link')) return null;

	const tabIndex =
		/(button|maxi-blocks\/button-maxi|image|maxi-blocks\/image-maxi)/i.test(
			String(blockName || '')
		)
			? 2
			: 1;

	return { tabIndex, accordion: 'dynamic content' };
};

export {
	buildDcGroupAction,
	buildDcGroupAttributeChanges,
	getDcGroupSidebarTarget,
	DC_BOOLEAN_ATTRIBUTES,
	DC_NUMBER_ATTRIBUTES,
	DC_URL_ATTRIBUTES,
};
