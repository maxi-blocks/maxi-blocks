const RESPONSIVE_BREAKPOINTS = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];

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

const extractUnitValue = (message, patterns) => {
	if (!message) return null;
	for (const pattern of patterns) {
		const match = message.match(pattern);
		if (match && match[1]) {
			const value = Number.parseFloat(match[1]);
			if (!Number.isFinite(value)) continue;
			return { value, unit: match[2] || 'px' };
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
			unit: rawValue.unit,
			breakpoint: rawValue.breakpoint || null,
		};
	}

	return { value: rawValue, unit: null, breakpoint: null };
};

const parseUnitValue = (rawValue, fallbackUnit = 'px') => {
	if (rawValue === null || rawValue === undefined) {
		return { value: 0, unit: fallbackUnit };
	}

	if (typeof rawValue === 'number') {
		return { value: rawValue, unit: fallbackUnit };
	}

	if (typeof rawValue === 'object') {
		const size = rawValue.value ?? rawValue.size ?? rawValue.amount ?? rawValue.width;
		const unit = rawValue.unit || fallbackUnit;
		return { value: Number(size) || 0, unit };
	}

	const raw = String(rawValue).trim();
	const match = raw.match(/^(-?\d+(?:\.\d+)?)(px|%|vh|vw|em|rem|ch)?$/i);
	if (match) {
		return { value: Number(match[1]), unit: match[2] || fallbackUnit };
	}

	const parsed = Number.parseFloat(raw);
	return { value: Number.isNaN(parsed) ? 0 : parsed, unit: fallbackUnit };
};

const buildRowGapChanges = value => {
	const { value: rawValue, unit, breakpoint } = normalizeValueWithBreakpoint(value);
	const parsed = parseUnitValue({ value: rawValue, unit });
	const breakpoints = breakpoint ? [breakpoint] : RESPONSIVE_BREAKPOINTS;
	const changes = {};

	breakpoints.forEach(bp => {
		changes[`row-gap-${bp}`] = parsed.value;
		changes[`row-gap-unit-${bp}`] = parsed.unit;
	});

	return changes;
};

const extractRowGapIntent = message => {
	const lower = String(message || '').toLowerCase();
	if (
		!/(row[-\s]*gap|row[-\s]*spacing|gap\s*between\s*rows|vertical\s*gap)/.test(
			lower
		)
	) {
		return null;
	}

	const isRemove =
		/\b(remove|clear|reset|delete|unset|none|zero)\b/.test(lower) ||
		/\bno\s+row\s*gap\b/.test(lower) ||
		/\bwithout\s+row\s*gap\b/.test(lower);

	if (isRemove) {
		return { value: 0, unit: 'px' };
	}

	return extractUnitValue(message, [
		/row[-\s]*gap\s*(?:to|=|:|is)?\s*(-?\d+(?:\.\d+)?)(px|%|vh|vw|em|rem|ch)?/i,
		/row[-\s]*spacing\s*(?:to|=|:|is)?\s*(-?\d+(?:\.\d+)?)(px|%|vh|vw|em|rem|ch)?/i,
		/(?:gap|spacing)\s*between\s*rows\s*(?:to|=|:|is)?\s*(-?\d+(?:\.\d+)?)(px|%|vh|vw|em|rem|ch)?/i,
		/vertical\s*gap\s*(?:to|=|:|is)?\s*(-?\d+(?:\.\d+)?)(px|%|vh|vw|em|rem|ch)?/i,
	]);
};

export const buildContainerRGroupAction = (message, { scope = 'selection' } = {}) => {
	const actionType = scope === 'page' ? 'update_page' : 'update_selection';
	const actionTarget = actionType === 'update_page' ? { target_block: 'container' } : {};

	const rowGapIntent = extractRowGapIntent(message);
	if (rowGapIntent) {
		const breakpoint = extractBreakpointToken(message);
		return {
			action: actionType,
			property: 'row_gap',
			value: {
				value: rowGapIntent.value,
				unit: rowGapIntent.unit,
				...(breakpoint ? { breakpoint } : {}),
			},
			message: 'Row gap updated.',
		...actionTarget,
	};
	}

	return null;
};

export const buildContainerRGroupAttributeChanges = (property, value) => {
	if (!property) return null;
	const normalized = String(property).replace(/-/g, '_');

	switch (normalized) {
		case 'row_gap':
			return buildRowGapChanges(value);
		default:
			return null;
	}
};

export const getContainerRGroupSidebarTarget = property => {
	if (!property) return null;
	const normalized = String(property).replace(/-/g, '_');

	if (normalized === 'row_gap') {
		return { tabIndex: 1, accordion: 'flexbox' };
	}

	return null;
};

export default {
	buildContainerRGroupAction,
	buildContainerRGroupAttributeChanges,
	getContainerRGroupSidebarTarget,
};
