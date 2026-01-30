import { extractAnchorLink, extractAriaLabel } from './containerMeta';

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

const buildResponsiveValueChanges = (key, value) => {
	const changes = {};
	RESPONSIVE_BREAKPOINTS.forEach(bp => {
		changes[`${key}-${bp}`] = value;
	});
	return changes;
};

export const extractAdvancedCss = message => {
	const raw = extractValueFromPatterns(message, [
		/(?:advanced|custom)[\s_-]*css\s*(?:to|for)\s*(?:the\s*)?button\s*(?:=|:|is)?\s*([\s\S]+)$/i,
		/(?:advanced|custom)[\s_-]*css\s*(?:to|=|:|is)?\s*([\s\S]+)$/i,
		/add\s*css\s*(?:to|for)\s*(?:the\s*)?button\s*(?:=|:)?\s*([\s\S]+)$/i,
		/add\s*css\s*(?:to|=|:)?\s*([\s\S]+)$/i,
	]);
	if (!raw) return null;
	if (!/[{};]/.test(raw)) return null;
	return raw.trim();
};

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

export const extractAlignmentValue = message => {
	const lower = String(message || '').toLowerCase();
	if (!/(align|alignment)/.test(lower)) return null;
	if (/align[\s_-]*items|align[\s_-]*content/.test(lower)) return null;
	if (/\b(text|label)\b/.test(lower)) return null;
	if (/\bleft\b/.test(lower)) return 'left';
	if (/\b(center|centre|middle)\b/.test(lower)) return 'center';
	if (/\bright\b/.test(lower)) return 'right';
	return null;
};

export const buildButtonAGroupAction = (message, { scope = 'selection' } = {}) => {
	const actionType = scope === 'page' ? 'update_page' : 'update_selection';
	const actionTarget = actionType === 'update_page' ? { target_block: 'button' } : {};
	const breakpoint = extractBreakpointToken(message);

	const anchorLink = extractAnchorLink(message);
	if (anchorLink) {
		return {
			action: actionType,
			property: 'anchor_link',
			value: anchorLink,
			message: 'Anchor set.',
			...actionTarget,
		};
	}

	const ariaLabel = extractAriaLabel(message);
	if (ariaLabel) {
		return {
			action: actionType,
			property: 'aria_label',
			value: ariaLabel,
			message: 'Aria label set.',
			...actionTarget,
		};
	}

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

	const alignItemsValue = extractAlignItemsValue(message);
	if (alignItemsValue) {
		return {
			action: actionType,
			property: 'align_items',
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

	const alignmentValue = extractAlignmentValue(message);
	if (alignmentValue) {
		return {
			action: actionType,
			property: 'alignment',
			value: breakpoint ? { value: alignmentValue, breakpoint } : alignmentValue,
			message: 'Aligned button.',
			...actionTarget,
		};
	}

	return null;
};

export const buildButtonAGroupAttributeChanges = (
	property,
	value,
	{ attributes } = {}
) => {
	if (!property) return null;

	switch (property) {
		case 'anchor_link': {
			const textValue = String(value || '');
			return { anchorLink: textValue };
		}
		case 'aria_label': {
			const textValue = String(value || '');
			return {
				ariaLabels: {
					...(attributes?.ariaLabels || {}),
					button: textValue,
				},
			};
		}
		case 'advanced_css': {
			const { value: rawValue, breakpoint } = normalizeValueWithBreakpoint(value);
			const cssValue = String(rawValue || '');
			return breakpoint
				? { [`advanced-css-${breakpoint}`]: cssValue }
				: buildResponsiveValueChanges('advanced-css', cssValue);
		}
		case 'align_items': {
			const { value: rawValue, breakpoint } = normalizeValueWithBreakpoint(value);
			const alignValue = String(rawValue || '');
			const targetBreakpoint = breakpoint || 'general';
			return { [`align-items-${targetBreakpoint}`]: alignValue };
		}
		case 'align_content': {
			const { value: rawValue, breakpoint } = normalizeValueWithBreakpoint(value);
			const alignValue = String(rawValue || '');
			const targetBreakpoint = breakpoint || 'general';
			return { [`align-content-${targetBreakpoint}`]: alignValue };
		}
		case 'alignment': {
			const { value: rawValue, breakpoint } = normalizeValueWithBreakpoint(value);
			const alignmentValue = String(rawValue || '');
			const targetBreakpoint = breakpoint || 'general';
			return { [`alignment-${targetBreakpoint}`]: alignmentValue };
		}
		default:
			return null;
	}
};

export const getButtonAGroupSidebarTarget = property => {
	if (!property) return null;
	const normalized = String(property).replace(/-/g, '_');

	if (normalized === 'anchor_link') {
		return { tabIndex: 2, accordion: 'add anchor link' };
	}

	if (normalized === 'aria_label') {
		return { tabIndex: 2, accordion: 'aria label' };
	}

	if (normalized === 'advanced_css') {
		return { tabIndex: 2, accordion: 'advanced css' };
	}

	if (['align_items', 'align_content'].includes(normalized)) {
		return { tabIndex: 2, accordion: 'flexbox' };
	}

	if (normalized === 'alignment') {
		return { tabIndex: 0, accordion: 'alignment' };
	}

	return null;
};

export default {
	buildButtonAGroupAction,
	buildButtonAGroupAttributeChanges,
	getButtonAGroupSidebarTarget,
	extractAdvancedCss,
	extractAlignItemsValue,
	extractAlignContentValue,
	extractAlignmentValue,
};
