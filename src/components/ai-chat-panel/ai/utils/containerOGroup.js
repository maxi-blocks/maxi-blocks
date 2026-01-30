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

const extractNumericWithUnit = (message, patterns) => {
	if (!message) return null;
	for (const pattern of patterns) {
		const match = message.match(pattern);
		if (match && match[1]) {
			const num = Number.parseFloat(match[1]);
			if (!Number.isFinite(num)) continue;
			return { value: num, unit: match[2] || null };
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

const clampOpacity = value => {
	const numeric = Number(value);
	if (!Number.isFinite(numeric)) return null;
	return Math.min(1, Math.max(0, numeric));
};

const normalizeOpacityInput = (value, unit) => {
	if (value === null || value === undefined) return null;
	const numeric = Number(value);
	if (!Number.isFinite(numeric)) return null;
	if (unit === '%' || numeric > 1) {
		return clampOpacity(numeric / 100);
	}
	return clampOpacity(numeric);
};

const extractOpacityValue = message => {
	const lower = String(message || '').toLowerCase();
	if (!/opacity|transparent|transparency/.test(lower)) return null;

	const numericWithUnit = extractNumericWithUnit(message, [
		/opacity\s*(?:to|=|:|is)?\s*(-?\d+(?:\.\d+)?)(%)?/i,
		/(-?\d+(?:\.\d+)?)\s*%?\s*opacity/i,
		/(?:transparent|transparency)\s*(?:to|=|:|is)?\s*(-?\d+(?:\.\d+)?)(%)?/i,
	]);
	if (!numericWithUnit) return null;

	const value = normalizeOpacityInput(numericWithUnit.value, numericWithUnit.unit);
	return value === null ? null : value;
};

const extractOpacityHoverStatus = message => {
	const lower = String(message || '').toLowerCase();
	if (!/opacity/.test(lower) || !/hover/.test(lower)) return null;
	if (/(disable|turn\s*off|deactivate|remove)/.test(lower)) return false;
	if (/(enable|turn\s*on|activate|add)/.test(lower)) return true;
	return null;
};

const extractOrderValue = message => {
	const lower = String(message || '').toLowerCase();
	if (!lower.includes('order')) return null;
	if (/order\s*by|orderby/.test(lower)) return null;
	if (!/(flex|item|stack|order)/.test(lower)) return null;
	return extractNumericValue(message, [
		/\border\b\s*(?:to|=|:|is)?\s*(-?\d+)/i,
		/(-?\d+)\s*(?:order)\b/i,
	]);
};

const normalizeOverflowValue = value => {
	if (!value) return null;
	const lower = String(value).toLowerCase();
	if (/(hidden|clip)/.test(lower)) return 'hidden';
	if (/scroll/.test(lower)) return 'scroll';
	if (/auto/.test(lower)) return 'auto';
	if (/visible/.test(lower)) return 'visible';
	return null;
};

const extractOverflowIntent = message => {
	const lower = String(message || '').toLowerCase();
	if (!lower.includes('overflow')) return null;

	let axis = null;
	if (/overflow[-\s_]*x|\bhorizontal\b|\bx\b/.test(lower)) axis = 'x';
	if (/overflow[-\s_]*y|\bvertical\b|\by\b/.test(lower)) {
		axis = axis ? 'both' : 'y';
	}

	const valueMatch = message.match(
		/\boverflow(?:[-\s_]*(?:x|y))?\s*(?:to|=|:|is)?\s*(hidden|scroll|auto|visible|clip)\b/i
	);
	const keywordValue = valueMatch ? valueMatch[1] : null;
	const normalized = normalizeOverflowValue(keywordValue);
	if (!normalized) return null;

	return { axis: axis || 'both', value: normalized };
};

const buildOpacityChanges = (value, { isHover = false } = {}) => {
	const { value: rawValue, breakpoint } = normalizeValueWithBreakpoint(value);
	const clamped = clampOpacity(rawValue);
	if (clamped === null) return null;

	const suffix = breakpoint ? `-${breakpoint}` : '-general';
	const key = `opacity${suffix}${isHover ? '-hover' : ''}`;
	const changes = { [key]: clamped };
	if (isHover) {
		changes['opacity-status-hover'] = true;
	}
	return changes;
};

const buildOrderChanges = value => {
	const { value: rawValue, breakpoint } = normalizeValueWithBreakpoint(value);
	const numeric = Number(rawValue);
	if (!Number.isFinite(numeric)) return null;
	const key = breakpoint ? `order-${breakpoint}` : 'order-general';
	return { [key]: numeric };
};

const buildOverflowChanges = (axis, value) => {
	const { value: rawValue, breakpoint } = normalizeValueWithBreakpoint(value);
	const normalized = normalizeOverflowValue(rawValue);
	if (!normalized) return null;
	const suffix = breakpoint ? `-${breakpoint}` : '-general';
	const key = `overflow-${axis}${suffix}`;
	return { [key]: normalized };
};

export const buildContainerOGroupAction = (message, { scope = 'selection' } = {}) => {
	const actionType = scope === 'page' ? 'update_page' : 'update_selection';
	const actionTarget = actionType === 'update_page' ? { target_block: 'container' } : {};

	const opacityHoverStatus = extractOpacityHoverStatus(message);
	if (typeof opacityHoverStatus === 'boolean') {
		return {
			action: actionType,
			property: 'opacity_status_hover',
			value: opacityHoverStatus,
			message: opacityHoverStatus
				? 'Opacity hover enabled.'
				: 'Opacity hover disabled.',
			...actionTarget,
		};
	}

	const opacityValue = extractOpacityValue(message);
	if (opacityValue !== null) {
		const breakpoint = extractBreakpointToken(message);
		const isHover = /\bhover\b/i.test(message || '');
		return {
			action: actionType,
			property: isHover ? 'opacity_hover' : 'opacity',
			value: breakpoint ? { value: opacityValue, breakpoint } : opacityValue,
			message: 'Opacity updated.',
			...actionTarget,
		};
	}

	const orderValue = extractOrderValue(message);
	if (Number.isFinite(orderValue)) {
		const breakpoint = extractBreakpointToken(message);
		return {
			action: actionType,
			property: 'order',
			value: breakpoint ? { value: orderValue, breakpoint } : orderValue,
			message: 'Order updated.',
			...actionTarget,
		};
	}

	const overflowIntent = extractOverflowIntent(message);
	if (overflowIntent) {
		const breakpoint = extractBreakpointToken(message);
		if (overflowIntent.axis === 'x') {
			return {
				action: actionType,
				property: 'overflow_x',
				value: breakpoint
					? { value: overflowIntent.value, breakpoint }
					: overflowIntent.value,
				message: 'Overflow updated.',
				...actionTarget,
			};
		}
		if (overflowIntent.axis === 'y') {
			return {
				action: actionType,
				property: 'overflow_y',
				value: breakpoint
					? { value: overflowIntent.value, breakpoint }
					: overflowIntent.value,
				message: 'Overflow updated.',
				...actionTarget,
			};
		}
		return {
			action: actionType,
			property: 'overflow',
			value: breakpoint
				? { value: overflowIntent.value, breakpoint }
				: overflowIntent.value,
			message: 'Overflow updated.',
			...actionTarget,
		};
	}

	return null;
};

export const buildContainerOGroupAttributeChanges = (property, value) => {
	if (!property) return null;
	const normalized = String(property).replace(/-/g, '_');

	switch (normalized) {
		case 'opacity':
			return buildOpacityChanges(value, { isHover: false });
		case 'opacity_hover':
			return buildOpacityChanges(value, { isHover: true });
		case 'opacity_status_hover':
			return { 'opacity-status-hover': Boolean(value) };
		case 'order':
			return buildOrderChanges(value);
		case 'overflow':
			return {
				...(buildOverflowChanges('x', value) || {}),
				...(buildOverflowChanges('y', value) || {}),
			};
		case 'overflow_x':
			return buildOverflowChanges('x', value);
		case 'overflow_y':
			return buildOverflowChanges('y', value);
		default:
			return null;
	}
};

export const getContainerOGroupSidebarTarget = property => {
	if (!property) return null;
	const normalized = String(property).replace(/-/g, '_');

	if (
		[
			'opacity',
			'opacity_hover',
			'opacity_status_hover',
		].includes(normalized)
	) {
		return { tabIndex: 1, accordion: 'opacity' };
	}

	if (['order'].includes(normalized)) {
		return { tabIndex: 1, accordion: 'flexbox' };
	}

	if (['overflow', 'overflow_x', 'overflow_y'].includes(normalized)) {
		return { tabIndex: 1, accordion: 'overflow' };
	}

	return null;
};

export default {
	buildContainerOGroupAction,
	buildContainerOGroupAttributeChanges,
	getContainerOGroupSidebarTarget,
};
