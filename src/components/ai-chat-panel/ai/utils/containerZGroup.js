const BREAKPOINT_ALIASES = [
	{
		key: 'xxl',
		regex: /\bxxl\b|extra\s*wide|ultra\s*wide|wide\s*screen|wide\s*desktop/i,
	},
	{ key: 'xl', regex: /\bxl\b|desktop|large\s*screen/i },
	{ key: 'l', regex: /\bl\b|laptop|notebook/i },
	{ key: 'm', regex: /\bm\b|tablet|medium/i },
	{ key: 's', regex: /\bs\b|small/i },
	{ key: 'xs', regex: /\bxs\b|mobile|phone|handset/i },
	{
		key: 'general',
		regex: /\bgeneral\b|base\s*breakpoint|default\s*breakpoint/i,
	},
];

const extractNumericValue = (message, patterns) => {
	if (!message) return null;
	for (const pattern of patterns) {
		const match = message.match(pattern);
		if (match && match[1]) {
			const num = Number.parseFloat(match[1]);
			if (Number.isFinite(num)) return num;
		}
	}
	return null;
};

const extractBreakpointToken = message => {
	const lower = String(message || '').toLowerCase();
	for (const entry of BREAKPOINT_ALIASES) {
		if (entry.regex.test(lower)) return entry.key;
	}
	return null;
};

const normalizeValueWithBreakpoint = rawValue => {
	if (
		rawValue &&
		typeof rawValue === 'object' &&
		!Array.isArray(rawValue) &&
		Object.prototype.hasOwnProperty.call(rawValue, 'value')
	) {
		return {
			value: rawValue.value,
			breakpoint: rawValue.breakpoint || null,
		};
	}

	return { value: rawValue, breakpoint: null };
};

const extractZIndexValue = message => {
	const lower = String(message || '').toLowerCase();
	if (!/z[-\s]*index/.test(lower)) return null;
	return extractNumericValue(message, [
		/z[-\s]*index\s*(?:to|=|:|is)?\s*(-?\d+)/i,
		/(-?\d+)\s*z[-\s]*index/i,
	]);
};

const buildZIndexChanges = value => {
	const { value: rawValue, breakpoint } = normalizeValueWithBreakpoint(value);
	const numeric = Number(rawValue);
	if (!Number.isFinite(numeric)) return null;
	const key = breakpoint ? `z-index-${breakpoint}` : 'z-index-general';
	return { [key]: numeric };
};

export const buildContainerZGroupAction = (message, { scope = 'selection' } = {}) => {
	const actionType = scope === 'page' ? 'update_page' : 'update_selection';
	const actionTarget = actionType === 'update_page' ? { target_block: 'container' } : {};

	const zIndexValue = extractZIndexValue(message);
	if (zIndexValue === null) return null;

	const breakpoint = extractBreakpointToken(message);
	return {
		action: actionType,
		property: 'z_index',
		value: breakpoint ? { value: zIndexValue, breakpoint } : zIndexValue,
		message: 'Z-index updated.',
		...actionTarget,
	};
};

export const buildContainerZGroupAttributeChanges = (property, value) => {
	if (!property) return null;
	const normalized = String(property).replace(/-/g, '_');

	switch (normalized) {
		case 'z_index':
			return buildZIndexChanges(value);
		default:
			return null;
	}
};

export const getContainerZGroupSidebarTarget = property => {
	if (!property) return null;
	const normalized = String(property).replace(/-/g, '_');

	if (normalized === 'z_index') {
		return { tabIndex: 1, accordion: 'z-index' };
	}

	return null;
};

export default {
	buildContainerZGroupAction,
	buildContainerZGroupAttributeChanges,
	getContainerZGroupSidebarTarget,
};
