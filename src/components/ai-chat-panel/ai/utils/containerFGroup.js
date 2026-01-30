const RESPONSIVE_BREAKPOINTS = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];

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
		return { value: '0', unit: 'px' };
	}

	if (typeof rawValue === 'number') {
		return { value: String(rawValue), unit: 'px' };
	}

	const raw = String(rawValue).trim();
	if (!raw) return { value: '0', unit: 'px' };

	const match = raw.match(/^(-?\d+(?:\.\d+)?)(px|%|vh|vw|em|rem|ch)?$/i);
	if (match) {
		return { value: String(Number(match[1])), unit: match[2] || 'px' };
	}

	return { value: raw, unit: null };
};

const buildBreakpointChanges = (key, value, breakpoint) => {
	if (breakpoint) return { [`${key}-${breakpoint}`]: value };
	return { [`${key}-general`]: value };
};

const buildFlexBasisChanges = rawValue => {
	const { value, unit, breakpoint } = normalizeValueWithBreakpoint(rawValue);
	const parsed = parseUnitValue(value);
	const changes = buildBreakpointChanges('flex-basis', parsed.value, breakpoint);
	if (parsed.unit) {
		Object.assign(
			changes,
			buildBreakpointChanges('flex-basis-unit', parsed.unit, breakpoint)
		);
	}
	return changes;
};

const buildFlexGrowChanges = rawValue => {
	const { value, breakpoint } = normalizeValueWithBreakpoint(rawValue);
	return buildBreakpointChanges('flex-grow', Number(value), breakpoint);
};

const buildFlexShrinkChanges = rawValue => {
	const { value, breakpoint } = normalizeValueWithBreakpoint(rawValue);
	return buildBreakpointChanges('flex-shrink', Number(value), breakpoint);
};

const buildFlexDirectionChanges = rawValue => {
	const { value, breakpoint } = normalizeValueWithBreakpoint(rawValue);
	return buildBreakpointChanges('flex-direction', value, breakpoint);
};

const buildFlexWrapChanges = rawValue => {
	const { value, breakpoint } = normalizeValueWithBreakpoint(rawValue);
	return buildBreakpointChanges('flex-wrap', value, breakpoint);
};

const buildForceAspectRatioChanges = rawValue => {
	const { value, breakpoint } = normalizeValueWithBreakpoint(rawValue);
	return buildBreakpointChanges('force-aspect-ratio', Boolean(value), breakpoint);
};

const buildFullWidthChanges = rawValue => {
	const { value, breakpoint } = normalizeValueWithBreakpoint(rawValue);
	return buildBreakpointChanges('full-width', Boolean(value), breakpoint);
};

const extractFlexBasis = message => {
	const match = String(message || '').match(
		/(?:flex\s*basis|flex-basis)\s*(?:to|:|=|is)?\s*([0-9.\-]+(?:px|%|em|rem|vh|vw|ch)?)/i
	);
	return match ? match[1].trim() : null;
};

const extractFlexNumber = (message, label) => {
	const match = String(message || '').match(
		new RegExp(`(?:${label})\\s*(?:to|:|=|is)?\\s*([0-9.\\-]+)`, 'i')
	);
	return match ? Number(match[1]) : null;
};

const extractFlexDirection = message => {
	const lower = String(message || '').toLowerCase();
	if (!lower.includes('flex')) return null;
	if (/row-reverse/.test(lower)) return 'row-reverse';
	if (/column-reverse/.test(lower)) return 'column-reverse';
	if (/row|horizontal/.test(lower)) return 'row';
	if (/column|vertical/.test(lower)) return 'column';
	return null;
};

const extractFlexWrap = message => {
	const lower = String(message || '').toLowerCase();
	if (!lower.includes('wrap') && !lower.includes('flex')) return null;
	if (/wrap-reverse/.test(lower)) return 'wrap-reverse';
	if (/no\s*wrap|nowrap|single\s*line/.test(lower)) return 'nowrap';
	if (/wrap|multi\s*line|next\s*line/.test(lower)) return 'wrap';
	return null;
};

const extractForceAspectRatio = message => {
	const lower = String(message || '').toLowerCase();
	if (!/aspect\s*ratio/.test(lower)) return null;
	if (/disable|turn\s*off|unlock/.test(lower)) return false;
	if (/force|lock|keep|maintain/.test(lower)) return true;
	return null;
};

const extractFullWidth = message => {
	const lower = String(message || '').toLowerCase();
	if (/full\s*width|edge\s*to\s*edge|100%/.test(lower)) return true;
	return null;
};

export const buildContainerFGroupAction = (message, { scope = 'selection' } = {}) => {
	const actionType = scope === 'page' ? 'update_page' : 'update_selection';
	const actionTarget = actionType === 'update_page' ? { target_block: 'container' } : {};

	const flexBasis = extractFlexBasis(message);
	if (flexBasis) {
		return {
			action: actionType,
			property: 'flex_basis',
			value: flexBasis,
			message: 'Flex basis updated.',
			...actionTarget,
		};
	}

	const flexGrow = extractFlexNumber(message, 'flex\\s*grow|flex-grow');
	if (flexGrow !== null) {
		return {
			action: actionType,
			property: 'flex_grow',
			value: flexGrow,
			message: 'Flex grow updated.',
			...actionTarget,
		};
	}

	const flexShrink = extractFlexNumber(message, 'flex\\s*shrink|flex-shrink');
	if (flexShrink !== null) {
		return {
			action: actionType,
			property: 'flex_shrink',
			value: flexShrink,
			message: 'Flex shrink updated.',
			...actionTarget,
		};
	}

	const flexDirection = extractFlexDirection(message);
	if (flexDirection) {
		return {
			action: actionType,
			property: 'flex_direction',
			value: flexDirection,
			message: 'Flex direction updated.',
			...actionTarget,
		};
	}

	const flexWrap = extractFlexWrap(message);
	if (flexWrap) {
		return {
			action: actionType,
			property: 'flex_wrap',
			value: flexWrap,
			message: 'Flex wrap updated.',
			...actionTarget,
		};
	}

	const forceAspect = extractForceAspectRatio(message);
	if (forceAspect !== null) {
		return {
			action: actionType,
			property: 'force_aspect_ratio',
			value: forceAspect,
			message: 'Aspect ratio updated.',
			...actionTarget,
		};
	}

	const fullWidth = extractFullWidth(message);
	if (fullWidth !== null) {
		return {
			action: actionType,
			property: 'full_width',
			value: fullWidth,
			message: 'Full width updated.',
			...actionTarget,
		};
	}

	return null;
};

export const buildContainerFGroupAttributeChanges = (property, value) => {
	if (!property) return null;
	const normalized = String(property).replace(/-/g, '_');

	switch (normalized) {
		case 'flex_basis':
			return buildFlexBasisChanges(value);
		case 'flex_grow':
			return buildFlexGrowChanges(value);
		case 'flex_shrink':
			return buildFlexShrinkChanges(value);
		case 'flex_direction':
			return buildFlexDirectionChanges(value);
		case 'flex_wrap':
			return buildFlexWrapChanges(value);
		case 'force_aspect_ratio':
			return buildForceAspectRatioChanges(value);
		case 'full_width':
			return buildFullWidthChanges(value);
		default:
			return null;
	}
};

export const getContainerFGroupSidebarTarget = property => {
	if (!property) return null;
	const normalized = String(property).replace(/-/g, '_');
	if (
		[
			'flex_basis',
			'flex_grow',
			'flex_shrink',
			'flex_direction',
			'flex_wrap',
			'force_aspect_ratio',
			'full_width',
		].includes(normalized)
	) {
		return { tabIndex: 1, accordion: 'flexbox' };
	}
	return null;
};

export default {
	buildContainerFGroupAction,
	buildContainerFGroupAttributeChanges,
	getContainerFGroupSidebarTarget,
	RESPONSIVE_BREAKPOINTS,
};
