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

const getResponsiveScaleFactor = breakpoint => {
	if (breakpoint === 'm' || breakpoint === 's') return 0.6;
	if (breakpoint === 'xs') return 0.4;
	return 1;
};

const shouldScaleResponsiveUnit = unit => {
	const normalizedUnit = String(unit || '').toLowerCase();
	return !['', '-', '%', 'vw', 'vh', 'ch'].includes(normalizedUnit);
};

const roundResponsiveValue = (value, unit) => {
	const numeric = Number(value);
	if (!Number.isFinite(numeric)) return value;
	const normalizedUnit = String(unit || '').toLowerCase();
	if (normalizedUnit === 'px') {
		if (Math.abs(numeric) < 2) return Math.round(numeric * 100) / 100;
		return Math.round(numeric);
	}
	return Math.round(numeric * 100) / 100;
};

const buildResponsiveScaledValues = ({ value, unit } = {}) => {
	const numericValue = Number(value);
	const safeValue = Number.isFinite(numericValue) ? numericValue : 0;
	const canScale = shouldScaleResponsiveUnit(unit);
	const values = {};

	RESPONSIVE_BREAKPOINTS.forEach(bp => {
		const factor = canScale ? getResponsiveScaleFactor(bp) : 1;
		const nextValue = safeValue * factor;
		values[bp] = roundResponsiveValue(nextValue, unit);
	});

	return values;
};

const parseUnitValue = (rawValue, fallbackUnit = 'px') => {
	if (rawValue === null || rawValue === undefined) {
		return { value: 0, unit: fallbackUnit };
	}

	if (typeof rawValue === 'number') {
		return { value: rawValue, unit: fallbackUnit };
	}

	if (typeof rawValue === 'object') {
		const size =
			rawValue.value ??
			rawValue.size ??
			rawValue.amount ??
			rawValue.width;
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

const isFitContentValue = value => {
	if (!value) return false;
	const lower = String(value).toLowerCase();
	return (
		lower.includes('fit-content') ||
		lower.includes('fit content') ||
		lower === 'auto' ||
		lower === 'fit'
	);
};

const buildFitContentChanges = breakpoint => {
	if (breakpoint) {
		return { [`width-fit-content-${breakpoint}`]: true };
	}

	const changes = {};
	RESPONSIVE_BREAKPOINTS.forEach(bp => {
		changes[`width-fit-content-${bp}`] = true;
	});
	return changes;
};

const buildWidthChanges = value => {
	const { value: rawValue, unit, breakpoint } = normalizeValueWithBreakpoint(value);

	if (isFitContentValue(rawValue)) {
		return buildFitContentChanges(breakpoint);
	}

	const parsed = parseUnitValue({ value: rawValue, unit });
	const changes = {};

	if (breakpoint) {
		changes[`width-${breakpoint}`] = parsed.value;
		changes[`width-unit-${breakpoint}`] = parsed.unit;
		changes[`width-fit-content-${breakpoint}`] = false;
		return changes;
	}

	const values = buildResponsiveScaledValues({
		value: parsed.value,
		unit: parsed.unit,
	});

	RESPONSIVE_BREAKPOINTS.forEach(bp => {
		changes[`width-${bp}`] = values[bp];
		changes[`width-unit-${bp}`] = parsed.unit;
		changes[`width-fit-content-${bp}`] = false;
	});

	return changes;
};

const extractWidthIntent = message => {
	const lower = String(message || '').toLowerCase();
	if (!/(width|wide)/.test(lower)) return null;
	if (
		/max(?:imum)?\s*width/.test(lower) ||
		/min(?:imum)?\s*width/.test(lower) ||
		/full\s*width|edge\s*to\s*edge/.test(lower)
	) {
		return null;
	}

	if (
		/fit[-\s]*content/.test(lower) ||
		/\bwidth\s*auto\b/.test(lower) ||
		/\bauto\s*width\b/.test(lower) ||
		/hug\s*content/.test(lower) ||
		/shrink\s*to\s*content/.test(lower)
	) {
		return { type: 'fit-content' };
	}

	const unitValue = extractUnitValue(message, [
		/width\s*(?:to|=|:|is)?\s*(-?\d+(?:\.\d+)?)(px|%|vh|vw|em|rem|ch)?/i,
		/(-?\d+(?:\.\d+)?)(px|%|vh|vw|em|rem|ch)?\s*wide\b/i,
		/\bwide\s*(?:to|=|:|is)?\s*(-?\d+(?:\.\d+)?)(px|%|vh|vw|em|rem|ch)?/i,
	]);
	if (!unitValue) return null;
	return { type: 'width', value: unitValue.value, unit: unitValue.unit };
};

export const buildContainerWGroupAction = (message, { scope = 'selection' } = {}) => {
	const actionType = scope === 'page' ? 'update_page' : 'update_selection';
	const actionTarget = actionType === 'update_page' ? { target_block: 'container' } : {};

	const intent = extractWidthIntent(message);
	if (!intent) return null;

	const breakpoint = extractBreakpointToken(message);
	if (intent.type === 'fit-content') {
		return {
			action: actionType,
			property: 'width',
			value: breakpoint ? { value: 'fit-content', breakpoint } : 'fit-content',
			message: 'Width updated.',
			...actionTarget,
		};
	}

	return {
		action: actionType,
		property: 'width',
		value: breakpoint
			? { value: intent.value, unit: intent.unit, breakpoint }
			: { value: intent.value, unit: intent.unit },
		message: 'Width updated.',
		...actionTarget,
	};
};

export const buildContainerWGroupAttributeChanges = (property, value) => {
	if (!property) return null;
	const normalized = String(property).replace(/-/g, '_');

	switch (normalized) {
		case 'width':
			return buildWidthChanges(value);
		case 'width_fit_content': {
			const { breakpoint } = normalizeValueWithBreakpoint(value);
			const isEnabled = value === undefined ? true : Boolean(value);
			if (!isEnabled) return null;
			return buildFitContentChanges(breakpoint);
		}
		default:
			return null;
	}
};

export const getContainerWGroupSidebarTarget = property => {
	if (!property) return null;
	const normalized = String(property).replace(/-/g, '_');

	if (['width', 'width_fit_content'].includes(normalized)) {
		return { tabIndex: 0, accordion: 'height / width' };
	}

	return null;
};

export default {
	buildContainerWGroupAction,
	buildContainerWGroupAttributeChanges,
	getContainerWGroupSidebarTarget,
};
