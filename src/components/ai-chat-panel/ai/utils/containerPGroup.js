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

const shouldScaleResponsiveUnit = (unit, forceScale) => {
	if (forceScale) return true;
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

const buildResponsiveScaledValues = ({ value, unit, forceScale = false, min = null } = {}) => {
	const numericValue = Number(value);
	const safeValue = Number.isFinite(numericValue) ? numericValue : 0;
	const canScale = shouldScaleResponsiveUnit(unit, forceScale);
	const values = {};

	RESPONSIVE_BREAKPOINTS.forEach(bp => {
		const factor = canScale ? getResponsiveScaleFactor(bp) : 1;
		let nextValue = safeValue * factor;
		if (Number.isFinite(nextValue) && min !== null) {
			nextValue = Math.max(min, nextValue);
		}
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
			rawValue.width ??
			rawValue.height;
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

const buildPaddingChanges = (value, { side = null } = {}) => {
	const { value: rawValue, unit, breakpoint } = normalizeValueWithBreakpoint(value);
	const parsed = parseUnitValue({ value: rawValue, unit });
	const sides = side ? [side] : ['top', 'right', 'bottom', 'left'];
	const syncValue = side ? 'none' : 'all';
	const changes = {};

	if (breakpoint) {
		const suffix = `-${breakpoint}`;
		sides.forEach(sideKey => {
			changes[`padding-${sideKey}${suffix}`] = parsed.value;
			changes[`padding-${sideKey}-unit${suffix}`] = parsed.unit;
		});
		changes[`padding-sync${suffix}`] = syncValue;
		return changes;
	}

	const values = buildResponsiveScaledValues({
		value: parsed.value,
		unit: parsed.unit,
	});

	RESPONSIVE_BREAKPOINTS.forEach(bp => {
		const suffix = `-${bp}`;
		sides.forEach(sideKey => {
			changes[`padding-${sideKey}${suffix}`] = values[bp];
			changes[`padding-${sideKey}-unit${suffix}`] = parsed.unit;
		});
		changes[`padding-sync${suffix}`] = syncValue;
	});

	return changes;
};

const buildPositionAxisChanges = (axis, value) => {
	const { value: rawValue, unit, breakpoint } = normalizeValueWithBreakpoint(value);
	const parsed = parseUnitValue({ value: rawValue, unit });
	const suffix = breakpoint ? `-${breakpoint}` : '-general';
	return {
		[`position-${axis}${suffix}`]: parsed.value,
		[`position-${axis}-unit${suffix}`]: parsed.unit,
		[`position-sync${suffix}`]: 'none',
	};
};

const buildPositionModeChanges = value => {
	const { value: rawValue, breakpoint } = normalizeValueWithBreakpoint(value);
	const mode = rawValue ? String(rawValue) : 'inherit';
	const suffix = breakpoint ? `-${breakpoint}` : '-general';
	return { [`position${suffix}`]: mode };
};

const extractPaddingIntent = message => {
	const lower = String(message || '').toLowerCase();
	if (!lower.includes('padding') && !lower.includes('pad')) return null;

	const sideMatch = lower.match(/\b(top|right|bottom|left)\b/);
	const side = sideMatch ? sideMatch[1] : null;

	const isRemove =
		/\b(remove|clear|reset|delete|unset|none|zero)\b/.test(lower) ||
		/\bno\s+padding\b/.test(lower) ||
		/\bwithout\s+padding\b/.test(lower);

	if (isRemove) {
		return { side, value: 0, unit: 'px' };
	}

	const unitValue = extractUnitValue(message, [
		/padding(?:[-\s_]*(?:top|right|bottom|left))?\s*(?:to|=|:|is)?\s*(-?\d+(?:\.\d+)?)(px|%|vh|vw|em|rem|ch)?/i,
		/(?:top|right|bottom|left)[-\s_]*padding\s*(?:to|=|:|is)?\s*(-?\d+(?:\.\d+)?)(px|%|vh|vw|em|rem|ch)?/i,
	]);
	if (!unitValue) return null;
	return { side, ...unitValue };
};

const extractPositionAxisIntent = message => {
	const lower = String(message || '').toLowerCase();
	if (!/position|offset/.test(lower)) return null;

	const axisPatterns = [
		{ axis: 'top', pattern: /position[-\s_]*top\s*(?:to|=|:|is)?\s*(-?\d+(?:\.\d+)?)(px|%|vh|vw|em|rem|ch)?/i },
		{ axis: 'bottom', pattern: /position[-\s_]*bottom\s*(?:to|=|:|is)?\s*(-?\d+(?:\.\d+)?)(px|%|vh|vw|em|rem|ch)?/i },
		{ axis: 'left', pattern: /position[-\s_]*left\s*(?:to|=|:|is)?\s*(-?\d+(?:\.\d+)?)(px|%|vh|vw|em|rem|ch)?/i },
		{ axis: 'right', pattern: /position[-\s_]*right\s*(?:to|=|:|is)?\s*(-?\d+(?:\.\d+)?)(px|%|vh|vw|em|rem|ch)?/i },
		{ axis: 'top', pattern: /top[-\s_]*(?:position|offset)\s*(?:to|=|:|is)?\s*(-?\d+(?:\.\d+)?)(px|%|vh|vw|em|rem|ch)?/i },
		{ axis: 'bottom', pattern: /bottom[-\s_]*(?:position|offset)\s*(?:to|=|:|is)?\s*(-?\d+(?:\.\d+)?)(px|%|vh|vw|em|rem|ch)?/i },
		{ axis: 'left', pattern: /left[-\s_]*(?:position|offset)\s*(?:to|=|:|is)?\s*(-?\d+(?:\.\d+)?)(px|%|vh|vw|em|rem|ch)?/i },
		{ axis: 'right', pattern: /right[-\s_]*(?:position|offset)\s*(?:to|=|:|is)?\s*(-?\d+(?:\.\d+)?)(px|%|vh|vw|em|rem|ch)?/i },
	];

	for (const { axis, pattern } of axisPatterns) {
		const match = message.match(pattern);
		if (match && match[1]) {
			return {
				axis,
				value: Number.parseFloat(match[1]),
				unit: match[2] || 'px',
			};
		}
	}

	return null;
};

const extractPositionMode = message => {
	const lower = String(message || '').toLowerCase();
	if (!/(position|absolute|relative|fixed|sticky|static|inherit|default)/.test(lower)) {
		return null;
	}
	if (/\bsticky\b/.test(lower)) return 'sticky';
	if (/\babsolute\b/.test(lower)) return 'absolute';
	if (/\brelative\b/.test(lower)) return 'relative';
	if (/\bfixed\b/.test(lower)) return 'fixed';
	if (/\bstatic\b/.test(lower)) return 'static';
	if (/\binherit\b|\bdefault\b/.test(lower)) return 'inherit';
	return null;
};

export const buildContainerPGroupAction = (message, { scope = 'selection' } = {}) => {
	const actionType = scope === 'page' ? 'update_page' : 'update_selection';
	const actionTarget = actionType === 'update_page' ? { target_block: 'container' } : {};

	const paddingIntent = extractPaddingIntent(message);
	if (paddingIntent) {
		const breakpoint = extractBreakpointToken(message);
		const property = paddingIntent.side ? `padding_${paddingIntent.side}` : 'padding';
		const value = {
			value: paddingIntent.value,
			unit: paddingIntent.unit,
			...(breakpoint ? { breakpoint } : {}),
		};
		return {
			action: actionType,
			property,
			value,
			message: 'Padding updated.',
			...actionTarget,
		};
	}

	const positionAxisIntent = extractPositionAxisIntent(message);
	if (positionAxisIntent) {
		const breakpoint = extractBreakpointToken(message);
		return {
			action: actionType,
			property: `position_${positionAxisIntent.axis}`,
			value: {
				value: positionAxisIntent.value,
				unit: positionAxisIntent.unit,
				...(breakpoint ? { breakpoint } : {}),
			},
			message: 'Position updated.',
			...actionTarget,
		};
	}

	const positionMode = extractPositionMode(message);
	if (positionMode) {
		const breakpoint = extractBreakpointToken(message);
		return {
			action: actionType,
			property: 'position',
			value: breakpoint ? { value: positionMode, breakpoint } : positionMode,
			message: 'Position mode updated.',
			...actionTarget,
		};
	}

	return null;
};

export const buildContainerPGroupAttributeChanges = (property, value) => {
	if (!property) return null;
	const normalized = String(property).replace(/-/g, '_');

	switch (normalized) {
		case 'padding':
			return buildPaddingChanges(value);
		case 'padding_top':
			return buildPaddingChanges(value, { side: 'top' });
		case 'padding_bottom':
			return buildPaddingChanges(value, { side: 'bottom' });
		case 'padding_left':
			return buildPaddingChanges(value, { side: 'left' });
		case 'padding_right':
			return buildPaddingChanges(value, { side: 'right' });
		case 'position':
			return buildPositionModeChanges(value);
		case 'position_top':
			return buildPositionAxisChanges('top', value);
		case 'position_right':
			return buildPositionAxisChanges('right', value);
		case 'position_bottom':
			return buildPositionAxisChanges('bottom', value);
		case 'position_left':
			return buildPositionAxisChanges('left', value);
		default:
			return null;
	}
};

export const getContainerPGroupSidebarTarget = property => {
	if (!property) return null;
	const normalized = String(property).replace(/-/g, '_');

	if (
		[
			'padding',
			'padding_top',
			'padding_bottom',
			'padding_left',
			'padding_right',
		].includes(normalized)
	) {
		return { tabIndex: 0, accordion: 'margin / padding' };
	}

	if (
		[
			'position',
			'position_top',
			'position_right',
			'position_bottom',
			'position_left',
		].includes(normalized)
	) {
		return { tabIndex: 1, accordion: 'position' };
	}

	return null;
};

export default {
	buildContainerPGroupAction,
	buildContainerPGroupAttributeChanges,
	getContainerPGroupSidebarTarget,
};
