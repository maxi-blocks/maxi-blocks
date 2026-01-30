import {
	buildContainerMetaAction,
	buildContainerMetaAttributeChanges,
	getContainerMetaSidebarTarget,
} from './containerMeta';

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

const buildResponsiveBooleanChanges = (key, value) => {
	const changes = {};
	RESPONSIVE_BREAKPOINTS.forEach(bp => {
		changes[`${key}-${bp}`] = value;
	});
	return changes;
};

const buildResponsiveValueChanges = (key, value) => {
	const changes = {};
	RESPONSIVE_BREAKPOINTS.forEach(bp => {
		changes[`${key}-${bp}`] = value;
	});
	return changes;
};

export const extractAdvancedCss = message => {
	const raw = extractValueFromPatterns(message, [
		/(?:advanced|custom)[\s_-]*css\s*(?:to|=|:|is)?\s*([\s\S]+)$/i,
		/add\s*css\s*(?:to|=|:)?\s*([\s\S]+)$/i,
	]);
	if (!raw) return null;
	if (!/[{};]/.test(raw)) return null;
	return raw.trim();
};

export const extractArrowStatus = message => {
	const lower = String(message || '').toLowerCase();
	if (!lower.includes('arrow')) return null;
	if (/(show|enable|add).*(callout\s*)?arrow/.test(lower)) return true;
	if (/(hide|disable|remove).*(callout\s*)?arrow/.test(lower)) return false;
	return null;
};

export const extractArrowSide = message => {
	const lower = String(message || '').toLowerCase();
	if (!lower.includes('arrow')) return null;
	if (/\barrow\b.*\btop\b|\btop\b.*\barrow\b/.test(lower)) return 'top';
	if (/\barrow\b.*\bbottom\b|\bbottom\b.*\barrow\b/.test(lower)) return 'bottom';
	if (/\barrow\b.*\bleft\b|\bleft\b.*\barrow\b/.test(lower)) return 'left';
	if (/\barrow\b.*\bright\b|\bright\b.*\barrow\b/.test(lower)) return 'right';
	return null;
};

export const extractArrowPosition = message =>
	extractNumericValue(message, [
		/(?:arrow\s*(?:position|pos)|position\s*of\s*arrow)\s*(?:to|=|:|is)?\s*(\d+(?:\.\d+)?)/i,
		/\barrow\b.*\bposition\b.*?(\d+(?:\.\d+)?)/i,
	]);

export const extractArrowWidth = message =>
	extractNumericValue(message, [
		/(?:arrow\s*width|width\s*of\s*arrow)\s*(?:to|=|:|is)?\s*(\d+(?:\.\d+)?)/i,
		/\barrow\b.*?(\d+(?:\.\d+)?)\s*(?:px)?\s*(?:wide|width)/i,
	]);

export const extractAlignItemsValue = message => {
	const lower = String(message || '').toLowerCase();
	if (!/align[\s_-]*items/.test(lower)) return null;
	if (/\b(top|start)\b/.test(lower)) return 'flex-start';
	if (/\b(bottom|end)\b/.test(lower)) return 'flex-end';
	if (/\b(center|centre|middle)\b/.test(lower)) return 'center';
	if (/\bstretch\b/.test(lower)) return 'stretch';
	if (/\bbaseline\b/.test(lower)) return 'baseline';
	return null;
};

export const extractAlignContentValue = message => {
	const lower = String(message || '').toLowerCase();
	if (!/align[\s_-]*content/.test(lower)) return null;
	if (/space[-\s]*between/.test(lower)) return 'space-between';
	if (/space[-\s]*around/.test(lower)) return 'space-around';
	if (/space[-\s]*evenly/.test(lower)) return 'space-evenly';
	if (/\b(center|centre)\b/.test(lower)) return 'center';
	if (/\bstretch\b/.test(lower)) return 'stretch';
	if (/\b(start|top)\b/.test(lower)) return 'flex-start';
	if (/\b(end|bottom)\b/.test(lower)) return 'flex-end';
	return null;
};

export const extractJustifyContentValue = message => {
	const lower = String(message || '').toLowerCase();
	if (!/justify[\s_-]*content|space[-\s]*between|space[-\s]*around|space[-\s]*evenly/.test(lower)) {
		return null;
	}
	if (/space[-\s]*between/.test(lower)) return 'space-between';
	if (/space[-\s]*around/.test(lower)) return 'space-around';
	if (/space[-\s]*evenly/.test(lower)) return 'space-evenly';
	if (/\b(center|centre|middle)\b/.test(lower)) return 'center';
	if (/\b(start|left)\b/.test(lower)) return 'flex-start';
	if (/\b(end|right)\b/.test(lower)) return 'flex-end';
	return null;
};

export const buildContainerAGroupAction = (message, { scope = 'selection' } = {}) => {
	const actionType = scope === 'page' ? 'update_page' : 'update_selection';
	const actionTarget = actionType === 'update_page' ? { target_block: 'container' } : {};
	const breakpoint = extractBreakpointToken(message);

	const metaAction = buildContainerMetaAction(message, { scope });
	if (metaAction) return metaAction;

	const advancedCss = extractAdvancedCss(message);
	if (advancedCss) {
		return {
			action: actionType,
			property: 'advanced_css',
			value: breakpoint ? { value: advancedCss, breakpoint } : advancedCss,
			message: 'Advanced CSS set.',
			...actionTarget,
		};
	}

	const arrowStatus = extractArrowStatus(message);
	if (typeof arrowStatus === 'boolean') {
		return {
			action: actionType,
			property: 'arrow_status',
			value: breakpoint ? { value: arrowStatus, breakpoint } : arrowStatus,
			message: arrowStatus ? 'Callout arrow shown.' : 'Callout arrow hidden.',
			...actionTarget,
		};
	}

	const arrowSide = extractArrowSide(message);
	if (arrowSide) {
		return {
			action: actionType,
			property: 'arrow_side',
			value: breakpoint ? { value: arrowSide, breakpoint } : arrowSide,
			message: 'Arrow side set.',
			...actionTarget,
		};
	}

	const arrowPosition = extractArrowPosition(message);
	if (Number.isFinite(arrowPosition)) {
		return {
			action: actionType,
			property: 'arrow_position',
			value: breakpoint ? { value: arrowPosition, breakpoint } : arrowPosition,
			message: 'Arrow position set.',
			...actionTarget,
		};
	}

	const arrowWidth = extractArrowWidth(message);
	if (Number.isFinite(arrowWidth)) {
		return {
			action: actionType,
			property: 'arrow_width',
			value: breakpoint ? { value: arrowWidth, breakpoint } : arrowWidth,
			message: 'Arrow width set.',
			...actionTarget,
		};
	}

	const alignItemsValue = extractAlignItemsValue(message);
	if (alignItemsValue) {
		return {
			action: actionType,
			property: 'align_items_flex',
			value: breakpoint ? { value: alignItemsValue, breakpoint } : alignItemsValue,
			message: 'Aligned items.',
			...actionTarget,
		};
	}

	const alignContentValue = extractAlignContentValue(message);
	if (alignContentValue) {
		return {
			action: actionType,
			property: 'align_content',
			value: breakpoint ? { value: alignContentValue, breakpoint } : alignContentValue,
			message: 'Aligned content.',
			...actionTarget,
		};
	}

	const justifyContentValue = extractJustifyContentValue(message);
	if (justifyContentValue) {
		return {
			action: actionType,
			property: 'justify_content',
			value: breakpoint ? { value: justifyContentValue, breakpoint } : justifyContentValue,
			message: 'Justify content updated.',
			...actionTarget,
		};
	}

	return null;
};

export const buildContainerAGroupAttributeChanges = (
	property,
	value,
	{ block, attributes } = {}
) => {
	if (!property) return null;

	switch (property) {
		case 'anchor_link':
		case 'aria_label':
			return buildContainerMetaAttributeChanges(property, value, attributes);
		case 'advanced_css': {
			const { value: rawValue, breakpoint } = normalizeValueWithBreakpoint(value);
			const cssValue = String(rawValue || '');
			return breakpoint
				? { [`advanced-css-${breakpoint}`]: cssValue }
				: buildResponsiveValueChanges('advanced-css', cssValue);
		}
		case 'arrow_status': {
			const { value: rawValue, breakpoint } = normalizeValueWithBreakpoint(value);
			const status = Boolean(rawValue);
			return breakpoint
				? { [`arrow-status-${breakpoint}`]: status }
				: buildResponsiveBooleanChanges('arrow-status', status);
		}
		case 'arrow_side': {
			const { value: rawValue, breakpoint } = normalizeValueWithBreakpoint(value);
			const side = String(rawValue || 'bottom');
			return breakpoint
				? { [`arrow-side-${breakpoint}`]: side }
				: buildResponsiveValueChanges('arrow-side', side);
		}
		case 'arrow_position': {
			const { value: rawValue, breakpoint } = normalizeValueWithBreakpoint(value);
			const pos = Number(rawValue);
			const finalPos = Number.isFinite(pos) ? pos : 0;
			return breakpoint
				? { [`arrow-position-${breakpoint}`]: finalPos }
				: buildResponsiveValueChanges('arrow-position', finalPos);
		}
		case 'arrow_width': {
			const { value: rawValue, breakpoint } = normalizeValueWithBreakpoint(value);
			const width = Number(rawValue);
			const finalWidth = Number.isFinite(width) ? width : 0;
			return breakpoint
				? { [`arrow-width-${breakpoint}`]: finalWidth }
				: buildResponsiveValueChanges('arrow-width', finalWidth);
		}
		case 'align_items_flex': {
			const { value: rawValue, breakpoint } = normalizeValueWithBreakpoint(value);
			const alignValue = String(rawValue || '');
			const direction = String(block?.attributes?.['flex-direction-general'] || '').toLowerCase();
			const isColumn = direction.startsWith('column');
			const isMainAxisAlign = ['flex-start', 'center', 'flex-end'].includes(alignValue);
			const key = isColumn && isMainAxisAlign ? 'justify-content' : 'align-items';
			if (breakpoint) {
				return { [`${key}-${breakpoint}`]: alignValue };
			}
			return { [`${key}-general`]: alignValue };
		}
		case 'align_content': {
			const { value: rawValue, breakpoint } = normalizeValueWithBreakpoint(value);
			const alignValue = String(rawValue || '');
			return breakpoint
				? { [`align-content-${breakpoint}`]: alignValue }
				: { 'align-content-general': alignValue };
		}
		case 'justify_content': {
			const { value: rawValue, breakpoint } = normalizeValueWithBreakpoint(value);
			const justifyValue = String(rawValue || '');
			return breakpoint
				? { [`justify-content-${breakpoint}`]: justifyValue }
				: { 'justify-content-general': justifyValue };
		}
		default:
			return null;
	}
};

export const getContainerAGroupSidebarTarget = property => {
	if (!property) return null;
	const normalized = String(property).replace(/-/g, '_');

	if (normalized === 'anchor_link' || normalized === 'aria_label') {
		return getContainerMetaSidebarTarget(normalized);
	}

	if (normalized === 'advanced_css') {
		return { tabIndex: 1, accordion: 'advanced css' };
	}

	if (
		['arrow_status', 'arrow_side', 'arrow_position', 'arrow_width'].includes(
			normalized
		)
	) {
		return { tabIndex: 0, accordion: 'callout arrow' };
	}

	if (
		[
			'align_items',
			'align_items_flex',
			'align_content',
			'justify_content',
			'flex_direction',
			'flex_wrap',
			'gap',
			'row_gap',
			'column_gap',
		].includes(normalized)
	) {
		return { tabIndex: 1, accordion: 'flexbox' };
	}

	return null;
};

export default {
	buildContainerAGroupAction,
	buildContainerAGroupAttributeChanges,
	getContainerAGroupSidebarTarget,
	extractAdvancedCss,
	extractArrowStatus,
	extractArrowSide,
	extractArrowPosition,
	extractArrowWidth,
	extractAlignItemsValue,
	extractAlignContentValue,
	extractJustifyContentValue,
};
