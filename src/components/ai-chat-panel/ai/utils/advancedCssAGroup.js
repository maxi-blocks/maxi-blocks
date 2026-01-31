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
		/(?:advanced|custom)[\s_-]*css\s*(?:to|for)\s*(?:the\s*)?(?:button|text|container|block)?\s*(?:=|:|is)?\s*([\s\S]+)$/i,
		/(?:advanced|custom)[\s_-]*css\s*(?:to|=|:|is)?\s*([\s\S]+)$/i,
		/add\s*css\s*(?:to|for)\s*(?:the\s*)?(?:button|text|container|block)?\s*(?:=|:)?\s*([\s\S]+)$/i,
		/add\s*css\s*(?:to|=|:)?\s*([\s\S]+)$/i,
	]);
	if (!raw) return null;
	if (!/[{};]/.test(raw)) return null;
	return raw.trim();
};

export const buildAdvancedCssAGroupAction = (
	message,
	{ scope = 'selection', targetBlock } = {}
) => {
	const actionType = scope === 'page' ? 'update_page' : 'update_selection';
	const actionTarget =
		actionType === 'update_page' && targetBlock
			? { target_block: targetBlock }
			: {};
	const breakpoint = extractBreakpointToken(message);

	const advancedCss = extractAdvancedCss(message);
	if (!advancedCss) return null;

	return {
		action: actionType,
		property: 'advanced_css',
		value: breakpoint ? { value: advancedCss, breakpoint } : advancedCss,
		message: 'Advanced CSS set.',
		...actionTarget,
	};
};

export const buildAdvancedCssAGroupAttributeChanges = (property, value) => {
	if (property !== 'advanced_css') return null;

	const { value: rawValue, breakpoint } = normalizeValueWithBreakpoint(value);
	const cssValue = String(rawValue || '');
	return breakpoint
		? { [`advanced-css-${breakpoint}`]: cssValue }
		: buildResponsiveValueChanges('advanced-css', cssValue);
};

export const getAdvancedCssSidebarTarget = (property, blockNameOrTarget) => {
	if (!property) return null;
	const normalized = String(property).replace(/-/g, '_');
	if (normalized !== 'advanced_css') return null;

	const name = String(blockNameOrTarget || '').toLowerCase();
	const isButton = name.includes('button');
	return { tabIndex: isButton ? 2 : 1, accordion: 'advanced css' };
};

export default {
	buildAdvancedCssAGroupAction,
	buildAdvancedCssAGroupAttributeChanges,
	getAdvancedCssSidebarTarget,
	extractAdvancedCss,
};
