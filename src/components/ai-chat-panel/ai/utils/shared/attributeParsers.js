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

const extractBreakpointToken = message => {
	const lower = String(message || '').toLowerCase();
	for (const entry of BREAKPOINT_ALIASES) {
		if (entry.regex.test(lower)) return entry.key;
	}
	return null;
};

const extractBreakpointValue = message =>
	extractNumericValue(message, [
		/\bbreak\s*point\b[^\d]*(\d+(?:\.\d+)?)/i,
		/\bbreakpoint\b[^\d]*(\d+(?:\.\d+)?)/i,
		/(\d+(?:\.\d+)?)\s*px\s*\bbreakpoint\b/i,
	]);

const parsePaletteColor = message => {
	const match = message.match(/\b(?:palette|color)\s*(\d{1,2})\b/i);
	if (!match) return null;
	const num = Number.parseInt(match[1], 10);
	return Number.isFinite(num) ? num : null;
};

const parseBorderStyle = message => {
	const lower = String(message || '').toLowerCase();
	if (lower.includes('dashed')) return 'dashed';
	if (lower.includes('dotted')) return 'dotted';
	if (lower.includes('double')) return 'double';
	if (lower.includes('solid')) return 'solid';
	return null;
};

const parseBorderWidth = message =>
	extractNumericValue(message, [
		/(\d+(?:\.\d+)?)\s*px[^\d]*(?:border|outline)/i,
		/\b(?:border|outline)\b[^\d]*(\d+(?:\.\d+)?)\s*px/i,
	]);

const parseBorderRadius = message =>
	extractNumericValue(message, [
		/\b(?:corner|corners|radius|rounded)\b[^\d]*(\d+(?:\.\d+)?)/i,
		/(\d+(?:\.\d+)?)\s*px\b.*\b(?:corner|radius|rounded)\b/i,
	]);

const parseShadowPreset = message => {
	const lower = String(message || '').toLowerCase();
	if (lower.includes('soft')) {
		return { x: 0, y: 10, blur: 30, spread: 0, opacity: 12 };
	}
	if (lower.includes('crisp')) {
		return { x: 0, y: 2, blur: 4, spread: 0, opacity: 14 };
	}
	if (lower.includes('bold')) {
		return { x: 0, y: 20, blur: 25, spread: -5, opacity: 18 };
	}
	if (lower.includes('glow')) {
		return { x: 0, y: 0, blur: 15, spread: 2, opacity: 20 };
	}
	return null;
};

export {
	RESPONSIVE_BREAKPOINTS,
	BREAKPOINT_ALIASES,
	extractNumericValue,
	extractBreakpointToken,
	extractBreakpointValue,
	parsePaletteColor,
	parseBorderStyle,
	parseBorderWidth,
	parseBorderRadius,
	parseShadowPreset,
};
