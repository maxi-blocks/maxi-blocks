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

const parseUnitValue = (rawValue, fallbackUnit = 'px') => {
	if (rawValue === null || rawValue === undefined) {
		return { value: 0, unit: fallbackUnit };
	}

	if (typeof rawValue === 'number') {
		return { value: rawValue, unit: fallbackUnit };
	}

	if (typeof rawValue === 'object') {
		const size =
			rawValue.value ?? rawValue.size ?? rawValue.amount ?? rawValue.width;
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

const normalizeCss = css => {
	if (!css) return '';
	const trimmed = String(css).trim();
	if (!trimmed) return '';
	return trimmed.endsWith(';') ? trimmed : `${trimmed};`;
};

const splitDeclarations = css =>
	normalizeCss(css)
		.split(';')
		.map(part => String(part).trim())
		.filter(Boolean);

const parseDeclaration = declaration => {
	const raw = String(declaration || '').trim();
	const idx = raw.indexOf(':');
	if (idx === -1) return null;
	const prop = raw.slice(0, idx).trim();
	const value = raw.slice(idx + 1).trim();
	if (!prop) return null;
	return { prop, value };
};

const upsertCss = (baseCss, patchCss) => {
	const map = new Map();

	splitDeclarations(baseCss).forEach(decl => {
		const parsed = parseDeclaration(decl);
		if (!parsed) return;
		map.set(parsed.prop.toLowerCase(), parsed);
	});

	splitDeclarations(patchCss).forEach(decl => {
		const parsed = parseDeclaration(decl);
		if (!parsed) return;
		map.set(parsed.prop.toLowerCase(), parsed);
	});

	return Array.from(map.values())
		.map(({ prop, value }) => `${prop}: ${value};`)
		.join('\n')
		.trim();
};

const mergeCustomCss = (attributes, { css, category, index, breakpoint }) => {
	const bp = breakpoint || 'general';
	const key = `custom-css-${bp}`;
	const existing = attributes?.[key];
	const next = existing ? { ...existing } : {};
	const categoryKey = category || 'button';
	const indexKey = index || 'normal';
	const currentCss = next?.[categoryKey]?.[indexKey] || '';
	const merged = upsertCss(currentCss, css);

	if (!merged) return { [key]: next };

	const nextCategory = next[categoryKey] ? { ...next[categoryKey] } : {};
	nextCategory[indexKey] = merged;
	next[categoryKey] = nextCategory;
	return { [key]: next };
};

const parsePaletteColor = message => {
	const match = message.match(/\b(?:palette|color)\s*(\d{1,2})\b/i);
	if (!match) return null;
	const num = Number.parseInt(match[1], 10);
	return Number.isFinite(num) ? num : null;
};

const extractCssVar = message => {
	const match = String(message || '').match(/var\(--[a-z0-9-_]+\)/i);
	return match ? match[0] : null;
};

const extractHexColor = message => {
	const match = String(message || '').match(
		/#(?:[0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})(?![0-9a-fA-F])/i
	);
	return match ? match[0] : null;
};

const extractButtonTextColorIntent = message => {
	const lower = String(message || '').toLowerCase();
	if (!lower.includes('button')) return null;
	if (
		!/(text|label|font)\s*colou?r|colou?r\s*(?:of|for)?\s*(?:the\s*)?(?:button\s*)?(text|label|font)/.test(
			lower
		)
	) {
		return null;
	}

	const isHover = lower.includes('hover');
	const palette = parsePaletteColor(message);
	const cssVar = extractCssVar(message);
	const hex = extractHexColor(message);
	const value = palette ?? cssVar ?? hex;
	if (value === null || value === undefined) return null;

	return { isHover, value };
};

const extractCustomLabel = message => {
	const lower = String(message || '').toLowerCase();
	if (
		!/custom\s*label|block\s*label|rename\s*(?:this\s*)?button\s*(?:block)?/.test(
			lower
		)
	) {
		return null;
	}
	const quoted = extractQuotedText(message);
	if (quoted) return quoted;
	return extractValueFromPatterns(message, [
		/(?:custom|block)\s*label\s*(?:to|=|:|is)?\s*["']?([^"']+)["']?/i,
		/rename\s*(?:this\s*)?button\s*(?:block)?\s*(?:to|as)\s*["']?([^"']+)["']?/i,
	]);
};

const extractCustomCss = message => {
	const raw = extractValueFromPatterns(message, [
		/(?:custom|button)\s*css\s*(?:to|for|=|:|is)?\s*([\s\S]+)$/i,
		/add\s*custom\s*css\s*(?:to|for)\s*(?:the\s*)?button\s*(?:=|:)?\s*([\s\S]+)$/i,
		/add\s*css\s*(?:to|for)\s*(?:the\s*)?button\s*(?:=|:)?\s*([\s\S]+)$/i,
	]);
	if (!raw) return null;
	const trimmed = raw.trim();
	if (!trimmed || !/[:;]/.test(trimmed) || /[{}]/.test(trimmed)) return null;
	return trimmed;
};

const extractColumnGapValue = message => {
	const lower = String(message || '').toLowerCase();
	if (!/column\s*gap/.test(lower)) return null;
	const raw = extractValueFromPatterns(message, [
		/column\s*gap\s*(?:to|=|:|is)?\s*(\d+(?:\.\d+)?\s*(?:px|%|em|rem|vh|vw|ch)?)/i,
		/gap\s*between\s*columns\s*(?:to|=|:|is)?\s*(\d+(?:\.\d+)?\s*(?:px|%|em|rem|vh|vw|ch)?)/i,
	]);
	if (!raw) return null;
	return parseUnitValue(raw, 'px');
};

const normalizeColorValue = rawValue => {
	if (
		rawValue &&
		typeof rawValue === 'object' &&
		!Array.isArray(rawValue)
	) {
		if (rawValue.palette !== undefined) {
			return { isPalette: true, value: rawValue.palette };
		}
		if (rawValue.color !== undefined) {
			return { isPalette: false, value: rawValue.color };
		}
		if (rawValue.value !== undefined) {
			const isPalette = typeof rawValue.value === 'number';
			return { isPalette, value: rawValue.value };
		}
	}
	const isPalette = typeof rawValue === 'number';
	return { isPalette, value: rawValue };
};

const buildTextColorChanges = (value, { isHover = false } = {}) => {
	const { value: rawValue, breakpoint } = normalizeValueWithBreakpoint(value);
	if (rawValue === null || rawValue === undefined) return null;

	const { isPalette, value: colorValue } = normalizeColorValue(rawValue);
	const breakpoints = breakpoint ? [breakpoint] : RESPONSIVE_BREAKPOINTS;
	const suffix = isHover ? '-hover' : '';
	const changes = {};

	breakpoints.forEach(bp => {
		changes[`palette-status-${bp}${suffix}`] = isPalette;
		changes[`palette-color-${bp}${suffix}`] = isPalette ? colorValue : '';
		changes[`color-${bp}${suffix}`] = isPalette ? '' : colorValue;
	});

	if (isHover) {
		changes['typography-status-hover'] = true;
	}

	return changes;
};

const buildColumnGapChanges = value => {
	const { value: rawValue, breakpoint } = normalizeValueWithBreakpoint(value);
	const parsed = parseUnitValue(rawValue, 'px');
	const breakpoints = breakpoint ? [breakpoint] : RESPONSIVE_BREAKPOINTS;
	const changes = {};
	breakpoints.forEach(bp => {
		changes[`column-gap-${bp}`] = parsed.value;
		changes[`column-gap-unit-${bp}`] = parsed.unit;
	});
	return changes;
};

const buildCustomLabelChanges = value => {
	const label = typeof value === 'string' ? value : String(value ?? '');
	return { customLabel: label };
};

const buildCustomCssChanges = (value, attributes) => {
	const { value: rawValue, breakpoint } = normalizeValueWithBreakpoint(value);
	const config =
		rawValue && typeof rawValue === 'object' && !Array.isArray(rawValue)
			? rawValue
			: { css: rawValue };

	const css = normalizeCss(config.css || config.value || '');
	if (!css || /[{}]/.test(css)) return null;

	const category = config.category || 'button';
	const index = config.index || 'normal';
	const bp = config.breakpoint || breakpoint || 'general';

	return mergeCustomCss(attributes, { css, category, index, breakpoint: bp });
};

const buildCustomFormatsChanges = (value, { isHover = false } = {}) => {
	if (!value || typeof value !== 'object') return null;
	return {
		[isHover ? 'custom-formats-hover' : 'custom-formats']: value,
	};
};

export const buildButtonCGroupAction = (message, { scope = 'selection' } = {}) => {
	const actionType = scope === 'page' ? 'update_page' : 'update_selection';
	const actionTarget =
		actionType === 'update_page' ? { target_block: 'button' } : {};
	const breakpoint = extractBreakpointToken(message);

	const customLabel = extractCustomLabel(message);
	if (customLabel) {
		return {
			action: actionType,
			property: 'custom_label',
			value: customLabel,
			message: 'Custom label updated.',
			...actionTarget,
		};
	}

	const customCss = extractCustomCss(message);
	if (customCss) {
		return {
			action: actionType,
			property: 'custom_css',
			value: {
				css: customCss,
				category: 'button',
				index: 'normal',
				...(breakpoint ? { breakpoint } : {}),
			},
			message: 'Custom CSS updated.',
			...actionTarget,
		};
	}

	const columnGap = extractColumnGapValue(message);
	if (columnGap && Number.isFinite(columnGap.value)) {
		return {
			action: actionType,
			property: 'column_gap',
			value: breakpoint ? { ...columnGap, breakpoint } : columnGap,
			message: 'Column gap updated.',
			...actionTarget,
		};
	}

	const textColorIntent = extractButtonTextColorIntent(message);
	if (textColorIntent) {
		return {
			action: actionType,
			property: textColorIntent.isHover ? 'button_hover_text' : 'text_color',
			value: textColorIntent.value,
			message: textColorIntent.isHover
				? 'Button hover text color updated.'
				: 'Button text color updated.',
			...actionTarget,
		};
	}

	return null;
};

export const buildButtonCGroupAttributeChanges = (
	property,
	value,
	{ attributes } = {}
) => {
	if (!property) return null;
	const normalized = String(property).replace(/-/g, '_');

	switch (normalized) {
		case 'text_color':
			return buildTextColorChanges(value, { isHover: false });
		case 'text_color_hover':
		case 'button_hover_text':
			return buildTextColorChanges(value, { isHover: true });
		case 'column_gap':
			return buildColumnGapChanges(value);
		case 'custom_label':
			return buildCustomLabelChanges(value);
		case 'custom_css':
			return buildCustomCssChanges(value, attributes);
		case 'custom_formats':
			return buildCustomFormatsChanges(value, { isHover: false });
		case 'custom_formats_hover':
			return buildCustomFormatsChanges(value, { isHover: true });
		default:
			return null;
	}
};

export const getButtonCGroupSidebarTarget = property => {
	if (!property) return null;
	const normalized = String(property).replace(/-/g, '_');

	if (['text_color', 'text_color_hover', 'button_hover_text'].includes(normalized)) {
		return { tabIndex: 0, accordion: 'typography' };
	}

	if (['custom_formats', 'custom_formats_hover'].includes(normalized)) {
		return { tabIndex: 0, accordion: 'typography' };
	}

	if (normalized === 'custom_label') {
		return { tabIndex: 0, accordion: 'block settings' };
	}

	if (normalized === 'column_gap') {
		return { tabIndex: 2, accordion: 'flexbox' };
	}

	if (normalized === 'custom_css') {
		return { tabIndex: 2, accordion: 'custom css' };
	}

	return null;
};

export default {
	buildButtonCGroupAction,
	buildButtonCGroupAttributeChanges,
	getButtonCGroupSidebarTarget,
};
