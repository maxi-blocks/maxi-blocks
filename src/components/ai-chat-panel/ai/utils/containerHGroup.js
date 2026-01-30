const BREAKPOINT_ALIASES = {
	desktop: 'xl',
	tablet: 'm',
	mobile: 'xs',
	phone: 'xs',
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

const parseUnitValue = rawValue => {
	if (rawValue === null || rawValue === undefined) {
		return { value: 0, unit: 'px' };
	}

	if (typeof rawValue === 'number') {
		return { value: rawValue, unit: 'px' };
	}

	if (typeof rawValue === 'object') {
		const size = rawValue.value ?? rawValue.size ?? rawValue.amount ?? rawValue.height;
		const unit = rawValue.unit || 'px';
		return { value: Number(size) || 0, unit };
	}

	const raw = String(rawValue).trim();
	const match = raw.match(/^(-?\d+(?:\.\d+)?)(px|%|vh|vw|em|rem|ch)?$/i);
	if (match) {
		return { value: Number(match[1]), unit: match[2] || 'px' };
	}

	const parsed = Number.parseFloat(raw);
	return { value: Number.isNaN(parsed) ? 0 : parsed, unit: 'px' };
};

const detectBreakpoint = message => {
	const lower = String(message || '').toLowerCase();
	for (const [alias, bp] of Object.entries(BREAKPOINT_ALIASES)) {
		if (lower.includes(alias)) return bp;
	}
	const match = lower.match(/\b(xx?l|xl|l|m|s|xs)\b/);
	return match ? match[1] : null;
};

const extractHeightValue = message => {
	const match = String(message || '').match(
		/(?:height|tall)\s*(?:to|=|:|is)?\s*(-?\d+(?:\.\d+)?)(px|%|vh|vw|em|rem|ch)?/i
	);
	if (!match) return null;
	return {
		value: Number(match[1]),
		unit: match[2] || 'px',
	};
};

export const buildContainerHGroupAction = (message, { scope = 'selection' } = {}) => {
	const heightValue = extractHeightValue(message);
	if (!heightValue) return null;

	const breakpoint = detectBreakpoint(message);
	const actionType = scope === 'page' ? 'update_page' : 'update_selection';
	const actionTarget = actionType === 'update_page' ? { target_block: 'container' } : {};

	return {
		action: actionType,
		property: 'height',
		value: { ...heightValue, ...(breakpoint ? { breakpoint } : {}) },
		message: 'Height updated.',
		...actionTarget,
	};
};

export const buildContainerHGroupAttributeChanges = (property, value) => {
	if (!property) return null;
	const normalized = String(property).replace(/-/g, '_');
	if (normalized !== 'height') return null;

	const { value: rawValue, unit, breakpoint } = normalizeValueWithBreakpoint(value);
	if (!breakpoint) return null;

	const parsed = parseUnitValue({ value: rawValue, unit });
	const changes = {
		[`height-${breakpoint}`]: parsed.value,
		[`height-unit-${breakpoint}`]: parsed.unit,
	};
	return changes;
};

export const getContainerHGroupSidebarTarget = property => {
	if (!property) return null;
	const normalized = String(property).replace(/-/g, '_');
	if (normalized === 'height') {
		return { tabIndex: 0, accordion: 'height / width' };
	}
	return null;
};

export default {
	buildContainerHGroupAction,
	buildContainerHGroupAttributeChanges,
	getContainerHGroupSidebarTarget,
};
