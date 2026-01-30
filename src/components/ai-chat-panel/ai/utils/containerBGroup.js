const RESPONSIVE_BREAKPOINTS = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];

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

const extractBreakpointValue = message =>
	extractNumericValue(message, [
		/\bbreak\s*point\b[^\d]*(\d+(?:\.\d+)?)/i,
		/\bbreakpoint\b[^\d]*(\d+(?:\.\d+)?)/i,
		/(\d+(?:\.\d+)?)\s*px\s*\bbreakpoint\b/i,
	]);

const extractBlockStyle = message => {
	const lower = String(message || '').toLowerCase();
	if (!/block\s*style|style\s*card|style\s*variant|style\s*mode/.test(lower)) {
		return null;
	}
	if (lower.includes('dark')) return 'dark';
	if (lower.includes('light')) return 'light';
	if (lower.includes('default') || lower.includes('inherit')) return 'default';
	return null;
};

const extractBackgroundHoverStatus = message => {
	const lower = String(message || '').toLowerCase();
	if (!lower.includes('hover') || !lower.includes('background')) return null;
	if (/(enable|show|turn\s*on|activate)/.test(lower)) return true;
	if (/(disable|hide|turn\s*off|deactivate)/.test(lower)) return false;
	return null;
};

const buildSampleLayer = palette => ({
	type: 'color',
	order: 0,
	'background-palette-status-general': true,
	'background-palette-color-general': palette,
	'background-color-general': `var(--maxi-color-${palette})`,
});

const extractBackgroundLayerIntent = message => {
	const lower = String(message || '').toLowerCase();
	if (
		!/(background\s*layer|overlay\s*layer|background\s*overlay)/.test(lower)
	) {
		return null;
	}
	const palette = parsePaletteColor(message) || 2;
	const layers = [buildSampleLayer(palette)];
	return {
		layers,
		isHover: /hover/.test(lower),
	};
};

const extractBorderConfig = message => {
	const lower = String(message || '').toLowerCase();
	if (!/(border|outline)/.test(lower)) return null;
	const isHover = /hover/.test(lower);
	if (/(remove|clear|no)\s+border/.test(lower)) {
		return { isHover, value: 'none' };
	}
	const width = parseBorderWidth(message);
	const style = parseBorderStyle(message);
	const color = parsePaletteColor(message);
	if (width === null && !style && color === null) return null;
	return {
		isHover,
		value: {
			width: width ?? 2,
			style: style || 'solid',
			color: color ?? 3,
			opacity: 100,
		},
	};
};

const extractBorderRadiusHover = message => {
	const lower = String(message || '').toLowerCase();
	if (!lower.includes('hover')) return null;
	if (!/(corner|radius|rounded)/.test(lower)) return null;
	const radius = parseBorderRadius(message);
	return Number.isFinite(radius) ? radius : null;
};

const extractBoxShadowConfig = message => {
	const lower = String(message || '').toLowerCase();
	if (!lower.includes('shadow')) return null;
	const isHover = /hover/.test(lower);
	if (/(remove|clear|no)\s+shadow/.test(lower)) {
		return { isHover, value: 'none' };
	}
	const preset = parseShadowPreset(message);
	const palette = parsePaletteColor(message);
	if (!preset && palette === null) return null;
	return {
		isHover,
		value: {
			...(preset || { x: 0, y: 10, blur: 30, spread: 0, opacity: 12 }),
			color: palette ?? 8,
			inset: false,
		},
	};
};

const buildBorderChanges = (value, { isHover = false } = {}) => {
	const { value: rawValue, breakpoint } = normalizeValueWithBreakpoint(value);
	const isRemoval = rawValue === 'none' || rawValue === null || rawValue === 0;
	const config =
		rawValue && typeof rawValue === 'object' && !Array.isArray(rawValue)
			? rawValue
			: {};
	const width = isRemoval ? 0 : Number(config.width ?? 2);
	const style = isRemoval ? 'none' : String(config.style || 'solid');
	const color = config.color ?? 3;
	const opacity = config.opacity ?? 100;
	const scStatus = Boolean(config.scStatus || false);
	const isPalette = typeof color === 'number';
	const breakpoints = breakpoint ? [breakpoint] : RESPONSIVE_BREAKPOINTS;
	const changes = {};

	breakpoints.forEach(bp => {
		const suffix = `-${bp}${isHover ? '-hover' : ''}`;
		changes[`border-style${suffix}`] = style;
		changes[`border-top-width${suffix}`] = width;
		changes[`border-bottom-width${suffix}`] = width;
		changes[`border-left-width${suffix}`] = width;
		changes[`border-right-width${suffix}`] = width;
		changes[`border-sync-width${suffix}`] = 'all';
		changes[`border-unit-width${suffix}`] = 'px';
		changes[`border-palette-status${suffix}`] = isPalette;
		changes[`border-palette-color${suffix}`] = isPalette ? color : '';
		changes[`border-color${suffix}`] = isPalette
			? `var(--maxi-color-${color})`
			: color || '';
		changes[`border-palette-opacity${suffix}`] = isPalette ? opacity : '';
		changes[`border-palette-sc-status${suffix}`] = scStatus;
	});

	if (isHover) {
		changes['border-status-hover'] = !isRemoval;
	}

	return changes;
};

const buildBorderRadiusChanges = (value, { isHover = false } = {}) => {
	const { value: rawValue, breakpoint } = normalizeValueWithBreakpoint(value);
	const radius = Number.isFinite(Number(rawValue)) ? Number(rawValue) : 8;
	const breakpoints = breakpoint ? [breakpoint] : RESPONSIVE_BREAKPOINTS;
	const changes = {};

	breakpoints.forEach(bp => {
		const suffix = `-${bp}${isHover ? '-hover' : ''}`;
		changes[`border-top-left-radius${suffix}`] = radius;
		changes[`border-top-right-radius${suffix}`] = radius;
		changes[`border-bottom-left-radius${suffix}`] = radius;
		changes[`border-bottom-right-radius${suffix}`] = radius;
		changes[`border-sync-radius${suffix}`] = 'all';
		changes[`border-unit-radius${suffix}`] = 'px';
	});

	return changes;
};

const buildBoxShadowChanges = (value, { isHover = false } = {}) => {
	const { value: rawValue, breakpoint } = normalizeValueWithBreakpoint(value);
	const isRemoval = rawValue === 'none' || rawValue === null || rawValue === 0;
	const config =
		rawValue && typeof rawValue === 'object' && !Array.isArray(rawValue)
			? rawValue
			: {};
	const x = Number(config.x ?? 0);
	const y = Number(config.y ?? 10);
	const blur = Number(config.blur ?? 30);
	const spread = Number(config.spread ?? 0);
	const color = config.color ?? 8;
	const opacity = config.opacity ?? 12;
	const inset = Boolean(config.inset || false);
	const isPalette = typeof color === 'number';
	const breakpoints = breakpoint ? [breakpoint] : RESPONSIVE_BREAKPOINTS;
	const changes = {};

	if (isHover) {
		changes['box-shadow-status-hover'] = !isRemoval;
	}

	if (isRemoval) {
		return changes;
	}

	breakpoints.forEach(bp => {
		const suffix = `-${bp}${isHover ? '-hover' : ''}`;
		changes[`box-shadow-horizontal${suffix}`] = x;
		changes[`box-shadow-vertical${suffix}`] = y;
		changes[`box-shadow-blur${suffix}`] = blur;
		changes[`box-shadow-spread${suffix}`] = spread;
		changes[`box-shadow-inset${suffix}`] = inset;
		changes[`box-shadow-horizontal-unit${suffix}`] = 'px';
		changes[`box-shadow-vertical-unit${suffix}`] = 'px';
		changes[`box-shadow-blur-unit${suffix}`] = 'px';
		changes[`box-shadow-spread-unit${suffix}`] = 'px';
		changes[`box-shadow-palette-status${suffix}`] = isPalette;
		changes[`box-shadow-palette-color${suffix}`] = isPalette ? color : '';
		changes[`box-shadow-palette-opacity${suffix}`] = isPalette ? opacity : '';
		changes[`box-shadow-palette-sc-status${suffix}`] = false;
		changes[`box-shadow-color${suffix}`] = isPalette ? '' : color || '';
	});

	return changes;
};

const buildBreakpointChanges = value => {
	const { value: rawValue, breakpoint } = normalizeValueWithBreakpoint(value);
	if (breakpoint) {
		const numeric = Number(rawValue);
		if (!Number.isFinite(numeric)) return null;
		return { [`breakpoints-${breakpoint}`]: numeric };
	}

	if (rawValue && typeof rawValue === 'object' && !Array.isArray(rawValue)) {
		const changes = {};
		Object.entries(rawValue).forEach(([key, val]) => {
			if (!RESPONSIVE_BREAKPOINTS.includes(key)) return;
			const numeric = Number(val);
			if (Number.isFinite(numeric)) {
				changes[`breakpoints-${key}`] = numeric;
			}
		});
		return Object.keys(changes).length ? changes : null;
	}

	const numeric = Number(rawValue);
	if (!Number.isFinite(numeric)) return null;
	return { 'breakpoints-general': numeric };
};

export const buildContainerBGroupAction = (message, { scope = 'selection' } = {}) => {
	const actionType = scope === 'page' ? 'update_page' : 'update_selection';
	const actionTarget =
		actionType === 'update_page' ? { target_block: 'container' } : {};

	const blockStyle = extractBlockStyle(message);
	if (blockStyle) {
		return {
			action: actionType,
			property: 'block_style',
			value: blockStyle,
			message: 'Block style updated.',
			...actionTarget,
		};
	}

	const breakpointToken = extractBreakpointToken(message);
	const breakpointValue = extractBreakpointValue(message);
	if (breakpointToken && Number.isFinite(breakpointValue)) {
		return {
			action: actionType,
			property: 'breakpoints',
			value: { value: breakpointValue, breakpoint: breakpointToken },
			message: 'Breakpoint updated.',
			...actionTarget,
		};
	}

	const backgroundHoverStatus = extractBackgroundHoverStatus(message);
	if (typeof backgroundHoverStatus === 'boolean') {
		return {
			action: actionType,
			property: 'block_background_status_hover',
			value: backgroundHoverStatus,
			message: backgroundHoverStatus
				? 'Hover background enabled.'
				: 'Hover background disabled.',
			...actionTarget,
		};
	}

	const backgroundLayerIntent = extractBackgroundLayerIntent(message);
	if (backgroundLayerIntent) {
		return {
			action: actionType,
			property: backgroundLayerIntent.isHover
				? 'background_layers_hover'
				: 'background_layers',
			value: backgroundLayerIntent.layers,
			message: 'Background layer updated.',
			...actionTarget,
		};
	}

	const borderRadiusHover = extractBorderRadiusHover(message);
	if (Number.isFinite(borderRadiusHover)) {
		return {
			action: actionType,
			property: 'border_radius_hover',
			value: borderRadiusHover,
			message: 'Hover corners updated.',
			...actionTarget,
		};
	}

	const borderConfig = extractBorderConfig(message);
	if (borderConfig) {
		return {
			action: actionType,
			property: borderConfig.isHover ? 'border_hover' : 'border',
			value: borderConfig.value,
			message: borderConfig.isHover ? 'Hover border updated.' : 'Border updated.',
			...actionTarget,
		};
	}

	const shadowConfig = extractBoxShadowConfig(message);
	if (shadowConfig) {
		return {
			action: actionType,
			property: shadowConfig.isHover ? 'box_shadow_hover' : 'box_shadow',
			value: shadowConfig.value,
			message: shadowConfig.isHover ? 'Hover shadow updated.' : 'Shadow updated.',
			...actionTarget,
		};
	}

	return null;
};

export const buildContainerBGroupAttributeChanges = (property, value) => {
	if (!property) return null;
	const normalized = String(property).replace(/-/g, '_');

	switch (normalized) {
		case 'background_layers': {
			const layers = Array.isArray(value)
				? value
				: value && Array.isArray(value.layers)
					? value.layers
					: null;
			return layers ? { 'background-layers': layers } : null;
		}
		case 'background_layers_hover': {
			const layers = Array.isArray(value)
				? value
				: value && Array.isArray(value.layers)
					? value.layers
					: null;
			return layers ? { 'background-layers-hover': layers } : null;
		}
		case 'block_background_status_hover': {
			return { 'block-background-status-hover': Boolean(value) };
		}
		case 'border':
			return buildBorderChanges(value, { isHover: false });
		case 'border_hover':
			return buildBorderChanges(value, { isHover: true });
		case 'border_radius':
			return buildBorderRadiusChanges(value, { isHover: false });
		case 'border_radius_hover':
			return buildBorderRadiusChanges(value, { isHover: true });
		case 'box_shadow':
			return buildBoxShadowChanges(value, { isHover: false });
		case 'box_shadow_hover':
			return buildBoxShadowChanges(value, { isHover: true });
		case 'block_style':
		case 'blockStyle':
			return { blockStyle: String(value || '').toLowerCase() };
		case 'breakpoints':
			return buildBreakpointChanges(value);
		default:
			return null;
	}
};

export const getContainerBGroupSidebarTarget = property => {
	if (!property) return null;
	const normalized = String(property).replace(/-/g, '_');

	if (
		[
			'background_layers',
			'background_layers_hover',
			'block_background_status_hover',
		].includes(normalized)
	) {
		return { tabIndex: 0, accordion: 'background / layer' };
	}

	if (
		[
			'border',
			'border_hover',
			'border_radius',
			'border_radius_hover',
		].includes(normalized)
	) {
		return { tabIndex: 0, accordion: 'border' };
	}

	if (['box_shadow', 'box_shadow_hover'].includes(normalized)) {
		return { tabIndex: 0, accordion: 'box shadow' };
	}

	if (['block_style', 'blockStyle'].includes(normalized)) {
		return { tabIndex: 0, accordion: 'block settings' };
	}

	if (normalized === 'breakpoints') {
		return { tabIndex: 1, accordion: 'breakpoint' };
	}

	return null;
};

export default {
	buildContainerBGroupAction,
	buildContainerBGroupAttributeChanges,
	getContainerBGroupSidebarTarget,
};
