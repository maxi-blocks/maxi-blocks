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

const extractValueFromPatterns = (message, patterns) => {
	if (!message) return null;
	for (const pattern of patterns) {
		const match = message.match(pattern);
		if (match && match[1]) return match[1].trim();
	}
	return null;
};

const extractUnitValue = (message, patterns) => {
	if (!message) return null;
	for (const pattern of patterns) {
		const match = message.match(pattern);
		if (match && match[1]) {
			const value = Number.parseFloat(match[1]);
			if (!Number.isFinite(value)) continue;
			return {
				value,
				unit: match[2] || 'px',
			};
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

const buildMarginChanges = (value, { side = null } = {}) => {
	const { value: rawValue, unit, breakpoint } = normalizeValueWithBreakpoint(value);
	const parsed = parseUnitValue({ value: rawValue, unit });
	const sides = side ? [side] : ['top', 'right', 'bottom', 'left'];
	const syncValue = side ? 'none' : 'all';
	const changes = {};

	if (breakpoint) {
		const suffix = `-${breakpoint}`;
		sides.forEach(sideKey => {
			changes[`margin-${sideKey}${suffix}`] = parsed.value;
			changes[`margin-${sideKey}-unit${suffix}`] = parsed.unit;
		});
		changes[`margin-sync${suffix}`] = syncValue;
		return changes;
	}

	const values = buildResponsiveScaledValues({
		value: parsed.value,
		unit: parsed.unit,
	});

	RESPONSIVE_BREAKPOINTS.forEach(bp => {
		const suffix = `-${bp}`;
		sides.forEach(sideKey => {
			changes[`margin-${sideKey}${suffix}`] = values[bp];
			changes[`margin-${sideKey}-unit${suffix}`] = parsed.unit;
		});
		changes[`margin-sync${suffix}`] = syncValue;
	});

	return changes;
};

const buildSizeChanges = (key, value) => {
	const { value: rawValue, unit, breakpoint } = normalizeValueWithBreakpoint(value);
	const parsed = parseUnitValue({ value: rawValue, unit });
	const changes = {};

	if (breakpoint) {
		const suffix = `-${breakpoint}`;
		changes[`${key}${suffix}`] = parsed.value;
		changes[`${key}-unit${suffix}`] = parsed.unit;
		return changes;
	}

	const values = buildResponsiveScaledValues({
		value: parsed.value,
		unit: parsed.unit,
	});

	RESPONSIVE_BREAKPOINTS.forEach(bp => {
		const suffix = `-${bp}`;
		changes[`${key}${suffix}`] = values[bp];
		changes[`${key}-unit${suffix}`] = parsed.unit;
	});

	return changes;
};

const extractMarginIntent = message => {
	const lower = String(message || '').toLowerCase();
	if (!lower.includes('margin')) return null;

	const sideMatch = lower.match(/\b(top|right|bottom|left)\b/);
	const side = sideMatch ? sideMatch[1] : null;

	const isRemove =
		/\b(remove|clear|reset|delete|unset|none|zero)\b/.test(lower) ||
		/\bno\s+margin\b/.test(lower) ||
		/\bwithout\s+margin\b/.test(lower);

	if (isRemove) {
		return { side, value: 0, unit: 'px' };
	}

	const unitValue = extractUnitValue(message, [
		/margin(?:[-\s_]*(?:top|right|bottom|left))?\s*(?:to|=|:|is)?\s*(-?\d+(?:\.\d+)?)(px|%|vh|vw|em|rem|ch)?/i,
		/(?:top|right|bottom|left)[-\s_]*margin\s*(?:to|=|:|is)?\s*(-?\d+(?:\.\d+)?)(px|%|vh|vw|em|rem|ch)?/i,
	]);
	if (!unitValue) return null;
	return { side, ...unitValue };
};

const extractMaxWidth = message =>
	extractUnitValue(message, [
		/max(?:imum)?[-\s_]*width\s*(?:to|=|:|is)?\s*(-?\d+(?:\.\d+)?)(px|%|vh|vw|em|rem|ch)?/i,
		/(?:limit|constrain|cap)[-\s_]*width\s*(?:to|=|:|is)?\s*(-?\d+(?:\.\d+)?)(px|%|vh|vw|em|rem|ch)?/i,
	]);

const extractMinWidth = message =>
	extractUnitValue(message, [
		/min(?:imum)?[-\s_]*width\s*(?:to|=|:|is)?\s*(-?\d+(?:\.\d+)?)(px|%|vh|vw|em|rem|ch)?/i,
		/(?:at\s*least)\s*(\d+(?:\.\d+)?)(px|%|vh|vw|em|rem|ch)?\s*wide/i,
	]);

const extractMaxHeight = message =>
	extractUnitValue(message, [
		/max(?:imum)?[-\s_]*height\s*(?:to|=|:|is)?\s*(-?\d+(?:\.\d+)?)(px|%|vh|vw|em|rem|ch)?/i,
		/(?:limit|constrain|cap)[-\s_]*height\s*(?:to|=|:|is)?\s*(-?\d+(?:\.\d+)?)(px|%|vh|vw|em|rem|ch)?/i,
	]);

const extractMinHeight = message =>
	extractUnitValue(message, [
		/min(?:imum)?[-\s_]*height\s*(?:to|=|:|is)?\s*(-?\d+(?:\.\d+)?)(px|%|vh|vw|em|rem|ch)?/i,
		/(?:at\s*least)\s*(\d+(?:\.\d+)?)(px|%|vh|vw|em|rem|ch)?\s*(?:tall|high)/i,
	]);

const extractMaxiVersion = (message, type) => {
	const lower = String(message || '').toLowerCase();
	if (type === 'current') {
		if (!/maxi\s*version|current\s*version/.test(lower)) return null;
		return extractValueFromPatterns(message, [
			/(?:current\s*maxi\s*version|maxi\s*version\s*current|current\s*version)\s*(?:to|=|:|is)?\s*([0-9a-zA-Z._-]+)/i,
		]);
	}
	if (type === 'origin') {
		if (!/origin\s*version|maxi\s*origin/.test(lower)) return null;
		return extractValueFromPatterns(message, [
			/(?:origin\s*maxi\s*version|maxi\s*origin\s*version|origin\s*version)\s*(?:to|=|:|is)?\s*([0-9a-zA-Z._-]+)/i,
		]);
	}
	return null;
};

const buildActionValue = (value, unit, breakpoint) => {
	if (breakpoint) {
		return { value, unit, breakpoint };
	}
	return unit ? `${value}${unit}` : value;
};

export const buildContainerMGroupAction = (message, { scope = 'selection' } = {}) => {
	const actionType = scope === 'page' ? 'update_page' : 'update_selection';
	const actionTarget = actionType === 'update_page' ? { target_block: 'container' } : {};

	const currentVersion = extractMaxiVersion(message, 'current');
	if (currentVersion) {
		return {
			action: actionType,
			property: 'maxi_version_current',
			value: currentVersion,
			message: 'Maxi version updated.',
			...actionTarget,
		};
	}

	const originVersion = extractMaxiVersion(message, 'origin');
	if (originVersion) {
		return {
			action: actionType,
			property: 'maxi_version_origin',
			value: originVersion,
			message: 'Maxi origin version updated.',
			...actionTarget,
		};
	}

	const breakpoint = extractBreakpointToken(message);

	const marginIntent = extractMarginIntent(message);
	if (marginIntent) {
		const property = marginIntent.side ? `margin_${marginIntent.side}` : 'margin';
		const value = buildActionValue(marginIntent.value, marginIntent.unit, breakpoint);
		return {
			action: actionType,
			property,
			value,
			message: 'Margin updated.',
			...actionTarget,
		};
	}

	const maxWidth = extractMaxWidth(message);
	if (maxWidth) {
		return {
			action: actionType,
			property: 'max_width',
			value: buildActionValue(maxWidth.value, maxWidth.unit, breakpoint),
			message: 'Max width updated.',
			...actionTarget,
		};
	}

	const minWidth = extractMinWidth(message);
	if (minWidth) {
		return {
			action: actionType,
			property: 'min_width',
			value: buildActionValue(minWidth.value, minWidth.unit, breakpoint),
			message: 'Min width updated.',
			...actionTarget,
		};
	}

	const maxHeight = extractMaxHeight(message);
	if (maxHeight) {
		return {
			action: actionType,
			property: 'max_height',
			value: buildActionValue(maxHeight.value, maxHeight.unit, breakpoint),
			message: 'Max height updated.',
			...actionTarget,
		};
	}

	const minHeight = extractMinHeight(message);
	if (minHeight) {
		return {
			action: actionType,
			property: 'min_height',
			value: buildActionValue(minHeight.value, minHeight.unit, breakpoint),
			message: 'Min height updated.',
			...actionTarget,
		};
	}

	return null;
};

export const buildContainerMGroupAttributeChanges = (property, value) => {
	if (!property) return null;
	const normalized = String(property).replace(/-/g, '_');

	switch (normalized) {
		case 'margin':
			return buildMarginChanges(value);
		case 'margin_top':
			return buildMarginChanges(value, { side: 'top' });
		case 'margin_bottom':
			return buildMarginChanges(value, { side: 'bottom' });
		case 'margin_left':
			return buildMarginChanges(value, { side: 'left' });
		case 'margin_right':
			return buildMarginChanges(value, { side: 'right' });
		case 'max_width':
			return buildSizeChanges('max-width', value);
		case 'min_width':
			return buildSizeChanges('min-width', value);
		case 'max_height':
			return buildSizeChanges('max-height', value);
		case 'min_height':
			return buildSizeChanges('min-height', value);
		case 'maxi_version_current':
			return { 'maxi-version-current': String(value ?? '') };
		case 'maxi_version_origin':
			return { 'maxi-version-origin': String(value ?? '') };
		default:
			return null;
	}
};

export const getContainerMGroupSidebarTarget = property => {
	if (!property) return null;
	const normalized = String(property).replace(/-/g, '_');

	if (
		[
			'margin',
			'margin_top',
			'margin_bottom',
			'margin_left',
			'margin_right',
		].includes(normalized)
	) {
		return { tabIndex: 0, accordion: 'margin / padding' };
	}

	if (
		[
			'min_width',
			'max_width',
			'min_height',
			'max_height',
		].includes(normalized)
	) {
		return { tabIndex: 0, accordion: 'height / width' };
	}

	if (normalized.startsWith('maxi_version')) {
		return { tabIndex: 0, accordion: 'block settings' };
	}

	return null;
};

export default {
	buildContainerMGroupAction,
	buildContainerMGroupAttributeChanges,
	getContainerMGroupSidebarTarget,
};
