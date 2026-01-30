import { select } from '@wordpress/data';

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

const SCROLL_EFFECT_ALIASES = [
	{ key: 'rotate_x', value: 'rotateX' },
	{ key: 'rotatex', value: 'rotateX' },
	{ key: 'rotate_y', value: 'rotateY' },
	{ key: 'rotatey', value: 'rotateY' },
	{ key: 'scale_x', value: 'scaleX' },
	{ key: 'scalex', value: 'scaleX' },
	{ key: 'scale_y', value: 'scaleY' },
	{ key: 'scaley', value: 'scaleY' },
	{ key: 'horizontal', value: 'horizontal' },
	{ key: 'vertical', value: 'vertical' },
	{ key: 'rotate', value: 'rotate' },
	{ key: 'scale', value: 'scale' },
	{ key: 'fade', value: 'fade' },
	{ key: 'blur', value: 'blur' },
];

const SCROLL_ACTION_ATTRS = new Set([
	'status',
	'speed',
	'delay',
	'easing',
	'viewport_top',
	'zones',
	'preview_status',
	'is_block_zone',
	'status_reverse',
	'unit',
]);

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

const extractUnitValue = (message, patterns) => {
	if (!message) return null;
	for (const pattern of patterns) {
		const match = message.match(pattern);
		if (match && match[1]) {
			const value = Number.parseFloat(match[1]);
			if (!Number.isFinite(value)) continue;
			return { value, unit: match[2] || 'px' };
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
			unit: rawValue.unit,
			breakpoint: rawValue.breakpoint || null,
		};
	}

	return { value: rawValue, unit: null, breakpoint: null };
};

const getActiveBreakpoint = () => {
	try {
		const store = select?.('maxiBlocks');
		const device = store?.receiveMaxiDeviceType?.() || 'general';
		const base = store?.receiveBaseBreakpoint?.();
		if (device === 'general') return 'general';
		if (base && base === device) return 'general';
		return device || 'general';
	} catch (err) {
		return 'general';
	}
};

const parseUnitValue = (rawValue, fallbackUnit = 'px') => {
	if (rawValue === null || rawValue === undefined) {
		return { value: 0, unit: fallbackUnit };
	}

	if (typeof rawValue === 'number') {
		return { value: rawValue, unit: fallbackUnit };
	}

	if (typeof rawValue === 'object') {
		const size = rawValue.value ?? rawValue.size ?? rawValue.amount ?? rawValue.height;
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

const extractScrollEffect = message => {
	const lower = String(message || '').toLowerCase();
	if (!lower.includes('scroll')) return null;

	const candidates = [
		{ key: 'rotateX', regex: /\brotate\s*x\b|\brotatex\b/i },
		{ key: 'rotateY', regex: /\brotate\s*y\b|\brotatey\b/i },
		{ key: 'scaleX', regex: /\bscale\s*x\b|\bscalex\b/i },
		{ key: 'scaleY', regex: /\bscale\s*y\b|\bscaley\b/i },
		{ key: 'horizontal', regex: /\bhorizontal\b|\bx[-\s]*axis\b/i },
		{ key: 'vertical', regex: /\bvertical\b|\by[-\s]*axis\b/i },
		{ key: 'rotate', regex: /\brotate\b/i },
		{ key: 'scale', regex: /\bscale\b|\bzoom\b/i },
		{ key: 'fade', regex: /\bfade\b/i },
		{ key: 'blur', regex: /\bblur\b/i },
	];

	for (const candidate of candidates) {
		if (candidate.regex.test(lower)) return candidate.key;
	}
	return null;
};

const extractEasingValue = message => {
	const lower = String(message || '').toLowerCase();
	const match = lower.match(/easing\s*(?:to|=|:|is)?\s*([a-z-]+)/i);
	if (match && match[1]) return match[1];
	if (/\bease-in-out\b/.test(lower)) return 'ease-in-out';
	if (/\bease-in\b/.test(lower)) return 'ease-in';
	if (/\bease-out\b/.test(lower)) return 'ease-out';
	if (/\bease\b/.test(lower)) return 'ease';
	if (/\blinear\b/.test(lower)) return 'linear';
	return null;
};

const extractViewportValue = message => {
	const lower = String(message || '').toLowerCase();
	if (!/(viewport|entry|trigger|start)/.test(lower)) return null;
	if (/\btop\b/.test(lower)) return 'top';
	if (/\bbottom\b/.test(lower)) return 'bottom';
	if (/\bmid\b|\bmiddle\b|\bcenter\b/.test(lower)) return 'mid';
	return null;
};

const extractScrollIntent = message => {
	const effect = extractScrollEffect(message);
	if (!effect) return null;

	const lower = String(message || '').toLowerCase();
	const breakpoint = extractBreakpointToken(message);

	if (/(preview|simulate)/.test(lower)) {
		if (/(disable|off|turn\s*off)/.test(lower)) {
			return { effect, attr: 'preview_status', value: false };
		}
		if (/(enable|on|turn\s*on|show)/.test(lower)) {
			return { effect, attr: 'preview_status', value: true };
		}
	}

	if (/block\s*height|block\s*zone/.test(lower)) {
		const isOn = !/(disable|off|turn\s*off)/.test(lower);
		return { effect, attr: 'is_block_zone', value: isOn };
	}

	if (/reverse/.test(lower)) {
		const isOn = !/(disable|off|turn\s*off)/.test(lower);
		return { effect, attr: 'status_reverse', value: isOn };
	}

	const viewportValue = extractViewportValue(message);
	if (viewportValue) {
		return { effect, attr: 'viewport_top', value: breakpoint ? { value: viewportValue, breakpoint } : viewportValue };
	}

	const easingValue = extractEasingValue(message);
	if (easingValue) {
		return { effect, attr: 'easing', value: breakpoint ? { value: easingValue, breakpoint } : easingValue };
	}

	if (/\bdelay\b/.test(lower)) {
		const delayValue = extractNumericValue(message, [
			/delay\s*(?:to|=|:|is)?\s*(-?\d+(?:\.\d+)?)/i,
		]);
		if (delayValue !== null) {
			return { effect, attr: 'delay', value: delayValue };
		}
	}

	if (/\bspeed\b/.test(lower)) {
		const speedValue = extractNumericValue(message, [
			/speed\s*(?:to|=|:|is)?\s*(-?\d+(?:\.\d+)?)/i,
		]);
		if (speedValue !== null) {
			return {
				effect,
				attr: 'speed',
				value: breakpoint ? { value: speedValue, breakpoint } : speedValue,
			};
		}
	}

	if (/(enable|on|turn\s*on|activate)/.test(lower)) {
		return {
			effect,
			attr: 'status',
			value: breakpoint ? { value: true, breakpoint } : true,
		};
	}
	if (/(disable|off|turn\s*off|deactivate|remove)/.test(lower)) {
		return {
			effect,
			attr: 'status',
			value: breakpoint ? { value: false, breakpoint } : false,
		};
	}

	return { effect, attr: 'status', value: breakpoint ? { value: true, breakpoint } : true };
};

const extractShapeDividerIntent = message => {
	const lower = String(message || '').toLowerCase();
	if (!/(shape\s*divider|divider\s*shape)/.test(lower)) return null;

	const position = /\bbottom\b/.test(lower) ? 'bottom' : /\btop\b/.test(lower) ? 'top' : null;
	if (!position) return null;

	const breakpoint = extractBreakpointToken(message);

	if (/effects/.test(lower)) {
		const isOn = !/(disable|off|turn\s*off)/.test(lower);
		return { position, attr: 'effects_status', value: isOn };
	}

	if (/shape\s*style|shape\s*type|divider\s*style/.test(lower)) {
		const styleMatch = lower.match(/\b(wave|curve|slant|triangle)\b/);
		if (styleMatch) {
			return { position, attr: 'shape_style', value: styleMatch[1] };
		}
	}

	if (/height/.test(lower)) {
		const heightValue = extractUnitValue(message, [
			/height\s*(?:to|=|:|is)?\s*(-?\d+(?:\.\d+)?)(px|%|vh|vw|em|rem|ch)?/i,
		]);
		if (heightValue) {
			return {
				position,
				attr: 'height',
				value: {
					value: heightValue.value,
					unit: heightValue.unit,
					...(breakpoint ? { breakpoint } : {}),
				},
			};
		}
	}

	if (/opacity/.test(lower)) {
		const opacityValue = extractNumericValue(message, [
			/opacity\s*(?:to|=|:|is)?\s*(-?\d+(?:\.\d+)?)(%)?/i,
		]);
		if (opacityValue !== null) {
			const normalized = opacityValue > 1 ? opacityValue / 100 : opacityValue;
			return {
				position,
				attr: 'opacity',
				value: breakpoint ? { value: normalized, breakpoint } : normalized,
			};
		}
	}

	if (/palette/.test(lower) && /opacity/.test(lower)) {
		const paletteOpacity = extractNumericValue(message, [
			/palette\s*opacity\s*(?:to|=|:|is)?\s*(-?\d+(?:\.\d+)?)/i,
		]);
		if (paletteOpacity !== null) {
			return {
				position,
				attr: 'palette_opacity',
				value: breakpoint ? { value: paletteOpacity, breakpoint } : paletteOpacity,
			};
		}
	}

	if (/palette/.test(lower) && /status/.test(lower)) {
		const isOn = !/(disable|off|turn\s*off)/.test(lower);
		return {
			position,
			attr: 'palette_status',
			value: breakpoint ? { value: isOn, breakpoint } : isOn,
		};
	}

	if (/palette/.test(lower) && /(single\s*color|sc)/.test(lower)) {
		const isOn = !/(disable|off|turn\s*off)/.test(lower);
		return {
			position,
			attr: 'palette_sc_status',
			value: breakpoint ? { value: isOn, breakpoint } : isOn,
		};
	}

	if (/palette/.test(lower) && /color/.test(lower)) {
		const paletteValue = extractNumericValue(message, [
			/palette\s*color\s*(?:to|=|:|is)?\s*(\d+)/i,
			/color\s*palette\s*(?:to|=|:|is)?\s*(\d+)/i,
		]);
		if (paletteValue !== null) {
			return {
				position,
				attr: 'palette_color',
				value: breakpoint ? { value: paletteValue, breakpoint } : paletteValue,
			};
		}
	}

	if (/color/.test(lower)) {
		const hexMatch = message.match(/(#[0-9a-f]{3,8})/i);
		const varMatch = message.match(/(var\(--[^)]+\))/i);
		const colorValue =
			(hexMatch && hexMatch[1]) ||
			(varMatch && varMatch[1]) ||
			null;
		if (colorValue) {
			return {
				position,
				attr: 'color',
				value: breakpoint ? { value: colorValue, breakpoint } : colorValue,
			};
		}
	}

	if (/(enable|on|turn\s*on|activate)/.test(lower)) {
		return {
			position,
			attr: 'status',
			value: true,
		};
	}
	if (/(disable|off|turn\s*off|deactivate|remove)/.test(lower)) {
		return {
			position,
			attr: 'status',
			value: false,
		};
	}

	return null;
};

export const buildContainerSGroupAction = (message, { scope = 'selection' } = {}) => {
	const actionType = scope === 'page' ? 'update_page' : 'update_selection';
	const actionTarget = actionType === 'update_page' ? { target_block: 'container' } : {};

	const scrollIntent = extractScrollIntent(message);
	if (scrollIntent) {
		return {
			action: actionType,
			property: `scroll_${scrollIntent.effect}_${scrollIntent.attr}`,
			value: scrollIntent.value,
			message: 'Scroll effect updated.',
			...actionTarget,
		};
	}

	const shapeIntent = extractShapeDividerIntent(message);
	if (shapeIntent) {
		return {
			action: actionType,
			property: `shape_divider_${shapeIntent.position}_${shapeIntent.attr}`,
			value: shapeIntent.value,
			message: 'Shape divider updated.',
			...actionTarget,
		};
	}

	if (/advanced\s*size\s*options/.test(String(message || '').toLowerCase())) {
		return {
			action: actionType,
			property: 'size_advanced_options',
			value: true,
			message: 'Advanced size options enabled.',
			...actionTarget,
		};
	}

	return null;
};

const resolveScrollEffectFromProperty = property => {
	const raw = String(property || '').toLowerCase();
	const remainder = raw.replace(/^scroll_/, '');
	const ordered = [...SCROLL_EFFECT_ALIASES].sort((a, b) => b.key.length - a.key.length);

	for (const alias of ordered) {
		if (remainder === alias.key || remainder.startsWith(`${alias.key}_`)) {
			return { effect: alias.value, attr: remainder.slice(alias.key.length + 1) };
		}
	}
	return null;
};

const buildScrollChanges = (property, value) => {
	const resolved = resolveScrollEffectFromProperty(property);
	if (!resolved || !resolved.attr || !SCROLL_ACTION_ATTRS.has(resolved.attr)) return null;

	const { value: rawValue, unit, breakpoint } = normalizeValueWithBreakpoint(value);
	const bp = breakpoint || getActiveBreakpoint() || 'general';
	const statusKey = `scroll-${resolved.effect}-status-${bp}`;
	const shouldEnableStatus =
		resolved.attr !== 'status' && resolved.attr !== 'preview_status';

	switch (resolved.attr) {
		case 'status':
			return { [statusKey]: Boolean(rawValue) };
		case 'speed': {
			const changes = { [`scroll-${resolved.effect}-speed-${bp}`]: Number(rawValue) };
			if (shouldEnableStatus) changes[statusKey] = true;
			return changes;
		}
		case 'delay': {
			const changes = { [`scroll-${resolved.effect}-delay-general`]: Number(rawValue) };
			if (shouldEnableStatus) changes[statusKey] = true;
			return changes;
		}
		case 'easing': {
			const changes = { [`scroll-${resolved.effect}-easing-${bp}`]: String(rawValue) };
			if (shouldEnableStatus) changes[statusKey] = true;
			return changes;
		}
		case 'viewport_top': {
			const changes = { [`scroll-${resolved.effect}-viewport-top-${bp}`]: rawValue };
			if (shouldEnableStatus) changes[statusKey] = true;
			return changes;
		}
		case 'zones': {
			const zonesValue =
				rawValue && typeof rawValue === 'object' ? rawValue : value;
			const changes = { [`scroll-${resolved.effect}-zones-${bp}`]: zonesValue };
			if (shouldEnableStatus) changes[statusKey] = true;
			return changes;
		}
		case 'preview_status': {
			const changes = {
				[`scroll-${resolved.effect}-preview-status-general`]: Boolean(rawValue),
			};
			if (shouldEnableStatus) changes[statusKey] = true;
			return changes;
		}
		case 'is_block_zone': {
			const changes = {
				[`scroll-${resolved.effect}-is-block-zone-general`]: Boolean(rawValue),
			};
			if (shouldEnableStatus) changes[statusKey] = true;
			return changes;
		}
		case 'status_reverse': {
			const changes = {
				[`scroll-${resolved.effect}-status-reverse-general`]: Boolean(rawValue),
			};
			if (shouldEnableStatus) changes[statusKey] = true;
			return changes;
		}
		case 'unit': {
			const changes = { [`scroll-${resolved.effect}-unit-general`]: unit || rawValue };
			if (shouldEnableStatus) changes[statusKey] = true;
			return changes;
		}
		default:
			return null;
	}
};

const buildShapeDividerChanges = (position, attr, value) => {
	const { value: rawValue, unit, breakpoint } = normalizeValueWithBreakpoint(value);
	const bp = breakpoint || 'general';

	switch (attr) {
		case 'status':
			return { [`shape-divider-${position}-status`]: Boolean(rawValue) };
		case 'shape_style':
			return { [`shape-divider-${position}-shape-style`]: rawValue };
		case 'effects_status':
			return { [`shape-divider-${position}-effects-status`]: Boolean(rawValue) };
		case 'height': {
			const parsed = parseUnitValue({ value: rawValue, unit });
			return {
				[`shape-divider-${position}-height-${bp}`]: parsed.value,
				[`shape-divider-${position}-height-unit-${bp}`]: parsed.unit,
			};
		}
		case 'opacity':
			return { [`shape-divider-${position}-opacity-${bp}`]: Number(rawValue) };
		case 'color':
			return { [`shape-divider-${position}-color-${bp}`]: rawValue };
		case 'palette_color':
			return { [`shape-divider-${position}-palette-color-${bp}`]: rawValue };
		case 'palette_opacity':
			return { [`shape-divider-${position}-palette-opacity-${bp}`]: Number(rawValue) };
		case 'palette_status':
			return { [`shape-divider-${position}-palette-status-${bp}`]: Boolean(rawValue) };
		case 'palette_sc_status':
			return { [`shape-divider-${position}-palette-sc-status-${bp}`]: Boolean(rawValue) };
		default:
			return null;
	}
};

export const buildContainerSGroupAttributeChanges = (property, value) => {
	if (!property) return null;
	const normalized = String(property).replace(/-/g, '_');

	if (normalized.startsWith('scroll_')) {
		return buildScrollChanges(normalized, value);
	}

	if (normalized.startsWith('shape_divider_')) {
		const match = normalized.match(/^shape_divider_(top|bottom)_(.+)$/);
		if (!match) return null;
		const position = match[1];
		const attr = match[2];
		return buildShapeDividerChanges(position, attr, value);
	}

	switch (normalized) {
		case 'shortcut_effect':
			return { shortcutEffect: Number(value) };
		case 'shortcut_effect_type':
			return { shortcutEffectType: value };
		case 'show_warning_box':
			return { 'show-warning-box': Boolean(value) };
		case 'size_advanced_options':
			return { 'size-advanced-options': value };
		default:
			return null;
	}
};

export const getContainerSGroupSidebarTarget = property => {
	if (!property) return null;
	const normalized = String(property).replace(/-/g, '_');

	if (normalized.startsWith('scroll_') || normalized === 'shortcut_effect' || normalized === 'shortcut_effect_type') {
		return { tabIndex: 1, accordion: 'scroll effects' };
	}

	if (normalized.startsWith('shape_divider_')) {
		return { tabIndex: 0, accordion: 'shape divider' };
	}

	if (normalized === 'show_warning_box') {
		return { tabIndex: 0, accordion: 'callout arrow' };
	}

	if (normalized === 'size_advanced_options') {
		return { tabIndex: 0, accordion: 'height / width' };
	}

	return null;
};

export default {
	buildContainerSGroupAction,
	buildContainerSGroupAttributeChanges,
	getContainerSGroupSidebarTarget,
};
