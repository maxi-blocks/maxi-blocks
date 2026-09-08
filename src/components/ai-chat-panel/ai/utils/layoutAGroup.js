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

const extractAlignItemsValue = message => {
	const lower = String(message || '').toLowerCase();
	if (!/align[\s_-]*items/.test(lower)) return null;
	if (/\b(top|start)\b/.test(lower)) return 'flex-start';
	if (/\b(bottom|end)\b/.test(lower)) return 'flex-end';
	if (/\b(center|centre|middle)\b/.test(lower)) return 'center';
	if (/\bstretch\b/.test(lower)) return 'stretch';
	if (/\bbaseline\b/.test(lower)) return 'baseline';
	return null;
};

const extractAlignContentValue = message => {
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

const extractJustifyContentValue = message => {
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

const alignItemsRegex = /align[\s_-]*items/;
const alignContentRegex = /align[\s_-]*content/;

const extractAlignmentValue = message => {
	const lower = String(message || '').toLowerCase();
	if (!/(align|alignment)/.test(lower)) return null;
	if (alignContentRegex.test(lower) || alignItemsRegex.test(lower)) return null;
	if (/\b(text|label)\b/.test(lower)) return null;
	if (/\bleft\b/.test(lower)) return 'left';
	if (/\b(center|centre|middle)\b/.test(lower)) return 'center';
	if (/\bright\b/.test(lower)) return 'right';
	return null;
};

const LAYOUT_PROPERTY_CONFIGS = [
	{
		key: 'alignItems',
		detector: extractAlignItemsValue,
		defaultProperty: 'align_items',
		message: 'Aligned items.',
	},
	{
		key: 'alignContent',
		detector: extractAlignContentValue,
		defaultProperty: 'align_content',
		message: 'Aligned content.',
	},
	{
		key: 'justifyContent',
		detector: extractJustifyContentValue,
		defaultProperty: 'justify_content',
		message: 'Updated justify content.',
	},
	{
		key: 'alignment',
		detector: extractAlignmentValue,
		defaultProperty: 'alignment',
		message: 'Aligned block.',
	},
];

const buildLayoutAGroupAction = (
	message,
	{ scope = 'selection', targetBlock = null, propertyMap = {} } = {}
) => {
	const actionType = scope === 'page' ? 'update_page' : 'update_selection';
	const actionTarget =
		actionType === 'update_page' && targetBlock
			? { target_block: targetBlock }
			: {};
	const breakpoint = extractBreakpointToken(message);

	for (const config of LAYOUT_PROPERTY_CONFIGS) {
		const propertyName =
			propertyMap[config.key] || config.defaultProperty || null;
		if (!propertyName) continue;

		const detectedValue = config.detector(message);
		if (detectedValue == null) continue;

		const value =
			breakpoint !== null && typeof detectedValue !== 'boolean'
				? { value: detectedValue, breakpoint }
				: detectedValue;

		return {
			action: actionType,
			property: propertyName,
			value,
			message: config.message,
			...actionTarget,
		};
	}

	return null;
};

export {
	RESPONSIVE_BREAKPOINTS,
	extractBreakpointToken,
	normalizeValueWithBreakpoint,
	buildResponsiveBooleanChanges,
	buildResponsiveValueChanges,
	extractAlignItemsValue,
	extractAlignContentValue,
	extractJustifyContentValue,
	extractAlignmentValue,
	buildLayoutAGroupAction,
};
