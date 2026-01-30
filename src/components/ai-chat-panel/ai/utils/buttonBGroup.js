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

const extractBackgroundLayerIntent = message => {
	const lower = String(message || '').toLowerCase();
	if (!/(background\s*layer|overlay\s*layer|background\s*overlay)/.test(lower)) {
		return null;
	}
	const palette = parsePaletteColor(message) || 2;
	const layers = [
		{
			type: 'color',
			order: 0,
			'background-palette-status-general': true,
			'background-palette-color-general': palette,
			'background-color-general': `var(--maxi-color-${palette})`,
		},
	];
	return {
		layers,
		isHover: /hover/.test(lower),
	};
};

const extractButtonBackgroundStatusIntent = message => {
	const lower = String(message || '').toLowerCase();
	if (!lower.includes('button') || !lower.includes('background')) return null;
	if (!lower.includes('hover')) return null;
	if (/(enable|show|turn\s*on|activate)/.test(lower)) return true;
	if (/(disable|hide|turn\s*off|deactivate)/.test(lower)) return false;
	return null;
};

const extractButtonBackgroundIntent = message => {
	const lower = String(message || '').toLowerCase();
	if (!/button/.test(lower)) return null;
	if (!/(background|bg)/.test(lower)) return null;
	if (/background\s*layer|overlay\s*layer|background\s*overlay/.test(lower)) {
		return null;
	}
	const palette = parsePaletteColor(message) || 3;
	const isHover = /hover/.test(lower);
	return {
		isHover,
		value: {
			palette,
			color: `var(--maxi-color-${palette})`,
		},
	};
};

const extractButtonBorderConfig = message => {
	const lower = String(message || '').toLowerCase();
	if (!/button/.test(lower)) return null;
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

const extractButtonBorderRadius = message => {
	const lower = String(message || '').toLowerCase();
	if (!/button/.test(lower)) return null;
	if (!/(corner|radius|rounded)/.test(lower)) return null;
	const radius = parseBorderRadius(message);
	if (!Number.isFinite(radius)) return null;
	return {
		isHover: /hover/.test(lower),
		value: radius,
	};
};

const extractButtonShadowConfig = message => {
	const lower = String(message || '').toLowerCase();
	if (!/button/.test(lower)) return null;
	if (!/shadow/.test(lower)) return null;
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

const extractButtonSpacingValue = (message, keyword) => {
	const lower = String(message || '').toLowerCase();
	if (!lower.includes('button')) return null;
	if (!lower.includes(keyword)) return null;
	const value = extractNumericValue(message, [
		/(\d+(?:\.\d+)?)\s*(?:px|rem|em|%)/i,
		/\b(\d+(?:\.\d+)?)\b/,
	]);
	if (!Number.isFinite(value)) return null;
	return value;
};

const extractButtonSizeValue = (message, keyword) => {
	const lower = String(message || '').toLowerCase();
	if (!lower.includes('button')) return null;
	if (!lower.includes(keyword)) return null;
	const value = extractNumericValue(message, [
		/(\d+(?:\.\d+)?)\s*(?:px|rem|em|%)/i,
		/\b(\d+(?:\.\d+)?)\b/,
	]);
	if (!Number.isFinite(value)) return null;
	return value;
};

const extractBottomGapValue = message => {
	const lower = String(message || '').toLowerCase();
	if (!/bottom\s*gap/.test(lower)) return null;
	const value = extractNumericValue(message, [
		/(\d+(?:\.\d+)?)\s*(?:px|rem|em|%)/i,
		/\b(\d+(?:\.\d+)?)\b/,
	]);
	return Number.isFinite(value) ? value : null;
};

const DEFAULT_BUTTON_BACKGROUND = {
	palette: 3,
	paletteHover: 5,
	paletteOpacity: 0.8,
	paletteOpacityHover: 0.6,
	paletteStatus: true,
	paletteStatusHover: true,
	paletteScStatus: false,
	paletteScStatusHover: false,
	color: 'var(--maxi-color-3)',
	colorHover: 'var(--maxi-color-5)',
	gradient:
		'linear-gradient(90deg, rgba(0,0,0,0.2), rgba(0,0,0,0.6))',
	gradientHover:
		'linear-gradient(90deg, rgba(0,0,0,0.4), rgba(0,0,0,0.8))',
	gradientOpacity: 0.7,
	gradientOpacityHover: 0.5,
	activeMedia: 'color',
	activeMediaHover: 'color',
	clipPath: 'inset(0% 0% 0% 0%)',
	clipPathStatus: true,
	clipPathHover: 'inset(0% 0% 0% 0%)',
	clipPathStatusHover: true,
	gradientClipPath: 'inset(0% 0% 0% 0%)',
	gradientClipPathStatus: true,
	gradientClipPathHover: 'inset(0% 0% 0% 0%)',
	gradientClipPathStatusHover: true,
	wrapperWidth: 100,
	wrapperHeight: 100,
	wrapperUnit: '%',
	position: {
		top: 0,
		right: 0,
		bottom: 0,
		left: 0,
		unit: '%',
		sync: 'all',
	},
};

const normalizeButtonBackgroundValue = rawValue => {
	if (rawValue === null || rawValue === undefined) {
		return { ...DEFAULT_BUTTON_BACKGROUND };
	}
	if (typeof rawValue === 'number') {
		return {
			...DEFAULT_BUTTON_BACKGROUND,
			palette: rawValue,
			color: `var(--maxi-color-${rawValue})`,
		};
	}
	if (typeof rawValue === 'string') {
		return {
			...DEFAULT_BUTTON_BACKGROUND,
			paletteStatus: false,
			paletteStatusHover: false,
			color: rawValue,
			colorHover: rawValue,
		};
	}
	if (typeof rawValue === 'object') {
		const merged = {
			...DEFAULT_BUTTON_BACKGROUND,
			...rawValue,
		};
		return merged;
	}
	return { ...DEFAULT_BUTTON_BACKGROUND };
};

const buildBorderChanges = (value, { isHover = false, prefix = '' } = {}) => {
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
		changes[`${prefix}border-style${suffix}`] = style;
		changes[`${prefix}border-top-width${suffix}`] = width;
		changes[`${prefix}border-bottom-width${suffix}`] = width;
		changes[`${prefix}border-left-width${suffix}`] = width;
		changes[`${prefix}border-right-width${suffix}`] = width;
		changes[`${prefix}border-sync-width${suffix}`] = 'all';
		changes[`${prefix}border-unit-width${suffix}`] = 'px';
		changes[`${prefix}border-palette-status${suffix}`] = isPalette;
		changes[`${prefix}border-palette-color${suffix}`] = isPalette ? color : '';
		changes[`${prefix}border-color${suffix}`] = isPalette
			? `var(--maxi-color-${color})`
			: color || '';
		changes[`${prefix}border-palette-opacity${suffix}`] = isPalette
			? opacity
			: '';
		changes[`${prefix}border-palette-sc-status${suffix}`] = scStatus;
	});

	if (isHover) {
		changes[`${prefix}border-status-hover`] = !isRemoval;
	}

	return changes;
};

const buildBorderRadiusChanges = (
	value,
	{ isHover = false, prefix = '' } = {}
) => {
	const { value: rawValue, breakpoint } = normalizeValueWithBreakpoint(value);
	const radius = Number.isFinite(Number(rawValue)) ? Number(rawValue) : 8;
	const breakpoints = breakpoint ? [breakpoint] : RESPONSIVE_BREAKPOINTS;
	const changes = {};

	breakpoints.forEach(bp => {
		const suffix = `-${bp}${isHover ? '-hover' : ''}`;
		changes[`${prefix}border-top-left-radius${suffix}`] = radius;
		changes[`${prefix}border-top-right-radius${suffix}`] = radius;
		changes[`${prefix}border-bottom-left-radius${suffix}`] = radius;
		changes[`${prefix}border-bottom-right-radius${suffix}`] = radius;
		changes[`${prefix}border-sync-radius${suffix}`] = 'all';
		changes[`${prefix}border-unit-radius${suffix}`] = 'px';
	});

	return changes;
};

const buildBoxShadowChanges = (
	value,
	{ isHover = false, prefix = '' } = {}
) => {
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
		changes[`${prefix}box-shadow-status-hover`] = !isRemoval;
	}

	if (isRemoval) {
		return changes;
	}

	breakpoints.forEach(bp => {
		const suffix = `-${bp}${isHover ? '-hover' : ''}`;
		changes[`${prefix}box-shadow-horizontal${suffix}`] = x;
		changes[`${prefix}box-shadow-vertical${suffix}`] = y;
		changes[`${prefix}box-shadow-blur${suffix}`] = blur;
		changes[`${prefix}box-shadow-spread${suffix}`] = spread;
		changes[`${prefix}box-shadow-inset${suffix}`] = inset;
		changes[`${prefix}box-shadow-horizontal-unit${suffix}`] = 'px';
		changes[`${prefix}box-shadow-vertical-unit${suffix}`] = 'px';
		changes[`${prefix}box-shadow-blur-unit${suffix}`] = 'px';
		changes[`${prefix}box-shadow-spread-unit${suffix}`] = 'px';
		changes[`${prefix}box-shadow-palette-status${suffix}`] = isPalette;
		changes[`${prefix}box-shadow-palette-color${suffix}`] = isPalette ? color : '';
		changes[`${prefix}box-shadow-palette-opacity${suffix}`] = isPalette
			? opacity
			: '';
		changes[`${prefix}box-shadow-palette-sc-status${suffix}`] = false;
		changes[`${prefix}box-shadow-color${suffix}`] = isPalette ? '' : color || '';
	});

	return changes;
};

const buildButtonBackgroundChanges = (value, { isHover = false } = {}) => {
	const { value: rawValue, breakpoint } = normalizeValueWithBreakpoint(value);
	const base = normalizeButtonBackgroundValue(rawValue);
	const breakpoints = breakpoint ? [breakpoint] : RESPONSIVE_BREAKPOINTS;
	const changes = {};

	const state = isHover
		? {
			palette: base.paletteHover ?? base.palette,
			paletteOpacity: base.paletteOpacityHover ?? base.paletteOpacity,
			paletteStatus: base.paletteStatusHover ?? base.paletteStatus,
			paletteScStatus: base.paletteScStatusHover ?? base.paletteScStatus,
			color: base.colorHover ?? base.color,
			gradient: base.gradientHover ?? base.gradient,
			gradientOpacity: base.gradientOpacityHover ?? base.gradientOpacity,
			activeMedia: base.activeMediaHover ?? base.activeMedia,
			clipPath: base.clipPathHover ?? base.clipPath,
			clipPathStatus: base.clipPathStatusHover ?? base.clipPathStatus,
			gradientClipPath: base.gradientClipPathHover ?? base.gradientClipPath,
			gradientClipPathStatus:
				base.gradientClipPathStatusHover ??
				base.gradientClipPathStatus,
		}
		: {
			palette: base.palette,
			paletteOpacity: base.paletteOpacity,
			paletteStatus: base.paletteStatus,
			paletteScStatus: base.paletteScStatus,
			color: base.color,
			gradient: base.gradient,
			gradientOpacity: base.gradientOpacity,
			activeMedia: base.activeMedia,
			clipPath: base.clipPath,
			clipPathStatus: base.clipPathStatus,
			gradientClipPath: base.gradientClipPath,
			gradientClipPathStatus: base.gradientClipPathStatus,
		};

	breakpoints.forEach(bp => {
		const suffix = `-${bp}${isHover ? '-hover' : ''}`;
		changes[`button-background-active-media${suffix}`] = state.activeMedia;
		changes[`button-background-color${suffix}`] = state.color;
		changes[`button-background-gradient${suffix}`] = state.gradient;
		changes[`button-background-gradient-opacity${suffix}`] = state.gradientOpacity;
		changes[`button-background-palette-status${suffix}`] = state.paletteStatus;
		changes[`button-background-palette-color${suffix}`] = state.palette;
		changes[`button-background-palette-opacity${suffix}`] =
			state.paletteOpacity;
		changes[`button-background-palette-sc-status${suffix}`] =
			state.paletteScStatus;

		changes[`button-background-color-clip-path${suffix}`] = state.clipPath;
		changes[`button-background-color-clip-path-status${suffix}`] =
			state.clipPathStatus;
		changes[`button-background-gradient-clip-path${suffix}`] =
			state.gradientClipPath;
		changes[`button-background-gradient-clip-path-status${suffix}`] =
			state.gradientClipPathStatus;

		changes[`button-background-color-wrapper-width${suffix}`] =
			base.wrapperWidth;
		changes[`button-background-color-wrapper-width-unit${suffix}`] =
			base.wrapperUnit;
		changes[`button-background-color-wrapper-height${suffix}`] =
			base.wrapperHeight;
		changes[`button-background-color-wrapper-height-unit${suffix}`] =
			base.wrapperUnit;
		changes[`button-background-color-wrapper-position-top${suffix}`] =
			base.position.top;
		changes[`button-background-color-wrapper-position-top-unit${suffix}`] =
			base.position.unit;
		changes[`button-background-color-wrapper-position-right${suffix}`] =
			base.position.right;
		changes[`button-background-color-wrapper-position-right-unit${suffix}`] =
			base.position.unit;
		changes[`button-background-color-wrapper-position-bottom${suffix}`] =
			base.position.bottom;
		changes[`button-background-color-wrapper-position-bottom-unit${suffix}`] =
			base.position.unit;
		changes[`button-background-color-wrapper-position-left${suffix}`] =
			base.position.left;
		changes[`button-background-color-wrapper-position-left-unit${suffix}`] =
			base.position.unit;
		changes[`button-background-color-wrapper-position-sync${suffix}`] =
			base.position.sync;

		changes[`button-background-gradient-wrapper-width${suffix}`] =
			base.wrapperWidth;
		changes[`button-background-gradient-wrapper-width-unit${suffix}`] =
			base.wrapperUnit;
		changes[`button-background-gradient-wrapper-height${suffix}`] =
			base.wrapperHeight;
		changes[`button-background-gradient-wrapper-height-unit${suffix}`] =
			base.wrapperUnit;
		changes[`button-background-gradient-wrapper-position-top${suffix}`] =
			base.position.top;
		changes[`button-background-gradient-wrapper-position-top-unit${suffix}`] =
			base.position.unit;
		changes[`button-background-gradient-wrapper-position-right${suffix}`] =
			base.position.right;
		changes[
			`button-background-gradient-wrapper-position-right-unit${suffix}`
		] = base.position.unit;
		changes[`button-background-gradient-wrapper-position-bottom${suffix}`] =
			base.position.bottom;
		changes[
			`button-background-gradient-wrapper-position-bottom-unit${suffix}`
		] = base.position.unit;
		changes[`button-background-gradient-wrapper-position-left${suffix}`] =
			base.position.left;
		changes[`button-background-gradient-wrapper-position-left-unit${suffix}`] =
			base.position.unit;
		changes[`button-background-gradient-wrapper-position-sync${suffix}`] =
			base.position.sync;
	});

	if (isHover) {
		changes['button-background-status-hover'] = true;
	}

	return changes;
};

const buildSpacingChanges = (type, value, prefix = 'button-') => {
	const { value: rawValue, breakpoint } = normalizeValueWithBreakpoint(value);
	const config =
		rawValue && typeof rawValue === 'object' && !Array.isArray(rawValue)
			? rawValue
			: {};
	const rawNumber =
		config.value !== undefined && config.value !== null ? config.value : rawValue;
	const val =
		rawNumber === undefined || rawNumber === null ? '' : String(rawNumber);
	const unit = config.unit || 'px';
	const sync = config.sync || 'all';
	const breakpoints = breakpoint ? [breakpoint] : RESPONSIVE_BREAKPOINTS;
	const changes = {};

	breakpoints.forEach(bp => {
		changes[`${prefix}${type}-top-${bp}`] = val;
		changes[`${prefix}${type}-right-${bp}`] = val;
		changes[`${prefix}${type}-bottom-${bp}`] = val;
		changes[`${prefix}${type}-left-${bp}`] = val;
		changes[`${prefix}${type}-top-unit-${bp}`] = unit;
		changes[`${prefix}${type}-right-unit-${bp}`] = unit;
		changes[`${prefix}${type}-bottom-unit-${bp}`] = unit;
		changes[`${prefix}${type}-left-unit-${bp}`] = unit;
		changes[`${prefix}${type}-sync-${bp}`] = sync;
	});

	return changes;
};

const buildSizeChanges = (type, value, prefix = 'button-') => {
	const { value: rawValue, breakpoint } = normalizeValueWithBreakpoint(value);
	const config =
		rawValue && typeof rawValue === 'object' && !Array.isArray(rawValue)
			? rawValue
			: {};
	let raw = config.value !== undefined ? config.value : rawValue;
	const unit = config.unit || 'px';
	let fitContent = config.fitContent;

	if (type === 'width') {
		if (raw === 'auto' || raw === 'fit-content') {
			fitContent = true;
			raw = config.value || '';
		}
		if (fitContent === undefined) {
			fitContent = false;
		}
	}

	const val = raw === undefined || raw === null ? '' : String(raw);
	const breakpoints = breakpoint ? [breakpoint] : RESPONSIVE_BREAKPOINTS;
	const changes = {};

	breakpoints.forEach(bp => {
		changes[`${prefix}${type}-${bp}`] = val;
		changes[`${prefix}${type}-unit-${bp}`] = unit;
		if (type === 'width') {
			changes[`${prefix}width-fit-content-${bp}`] = Boolean(fitContent);
		}
	});

	return changes;
};

const buildBooleanBreakpointChanges = (key, value, prefix = 'button-') => {
	const { value: rawValue, breakpoint } = normalizeValueWithBreakpoint(value);
	const boolValue = Boolean(rawValue);
	const breakpoints = breakpoint ? [breakpoint] : RESPONSIVE_BREAKPOINTS;
	const changes = {};

	breakpoints.forEach(bp => {
		changes[`${prefix}${key}-${bp}`] = boolValue;
	});

	return changes;
};

const buildBottomGapChanges = (value, { isHover = false } = {}) => {
	const { value: rawValue, breakpoint } = normalizeValueWithBreakpoint(value);
	const config =
		rawValue && typeof rawValue === 'object' && !Array.isArray(rawValue)
			? rawValue
			: {};
	const rawNumber =
		config.value !== undefined && config.value !== null ? config.value : rawValue;
	const val =
		rawNumber === undefined || rawNumber === null ? '' : String(rawNumber);
	const unit = config.unit || 'px';
	const breakpoints = breakpoint ? [breakpoint] : RESPONSIVE_BREAKPOINTS;
	const changes = {};

	breakpoints.forEach(bp => {
		const suffix = `-${bp}${isHover ? '-hover' : ''}`;
		changes[`bottom-gap${suffix}`] = val;
		changes[`bottom-gap-unit${suffix}`] = unit;
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

export const buildButtonBGroupAction = (message, { scope = 'selection' } = {}) => {
	const actionType = scope === 'page' ? 'update_page' : 'update_selection';
	const actionTarget = actionType === 'update_page' ? { target_block: 'button' } : {};

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

	const buttonBackgroundStatus = extractButtonBackgroundStatusIntent(message);
	if (typeof buttonBackgroundStatus === 'boolean') {
		return {
			action: actionType,
			property: 'button_background_status_hover',
			value: buttonBackgroundStatus,
			message: buttonBackgroundStatus
				? 'Button hover background enabled.'
				: 'Button hover background disabled.',
			...actionTarget,
		};
	}

	const buttonBackgroundIntent = extractButtonBackgroundIntent(message);
	if (buttonBackgroundIntent) {
		return {
			action: actionType,
			property: buttonBackgroundIntent.isHover
				? 'button_background_hover'
				: 'button_background',
			value: buttonBackgroundIntent.value,
			message: 'Button background updated.',
			...actionTarget,
		};
	}

	const buttonBorderRadius = extractButtonBorderRadius(message);
	if (buttonBorderRadius) {
		return {
			action: actionType,
			property: buttonBorderRadius.isHover
				? 'button_border_radius_hover'
				: 'button_border_radius',
			value: buttonBorderRadius.value,
			message: buttonBorderRadius.isHover
				? 'Button hover corners updated.'
				: 'Button corners updated.',
			...actionTarget,
		};
	}

	const buttonBorderConfig = extractButtonBorderConfig(message);
	if (buttonBorderConfig) {
		return {
			action: actionType,
			property: buttonBorderConfig.isHover ? 'button_border_hover' : 'button_border',
			value: buttonBorderConfig.value,
			message: buttonBorderConfig.isHover
				? 'Button hover border updated.'
				: 'Button border updated.',
			...actionTarget,
		};
	}

	const buttonShadowConfig = extractButtonShadowConfig(message);
	if (buttonShadowConfig) {
		return {
			action: actionType,
			property: buttonShadowConfig.isHover
				? 'button_box_shadow_hover'
				: 'button_box_shadow',
			value: buttonShadowConfig.value,
			message: buttonShadowConfig.isHover
				? 'Button hover shadow updated.'
				: 'Button shadow updated.',
			...actionTarget,
		};
	}

	const paddingValue = extractButtonSpacingValue(message, 'padding');
	if (Number.isFinite(paddingValue)) {
		const breakpoint = extractBreakpointToken(message);
		return {
			action: actionType,
			property: 'button_padding',
			value: breakpoint
				? { value: paddingValue, unit: 'px', breakpoint }
				: { value: paddingValue, unit: 'px' },
			message: 'Button padding updated.',
			...actionTarget,
		};
	}

	const marginValue = extractButtonSpacingValue(message, 'margin');
	if (Number.isFinite(marginValue)) {
		const breakpoint = extractBreakpointToken(message);
		return {
			action: actionType,
			property: 'button_margin',
			value: breakpoint
				? { value: marginValue, unit: 'px', breakpoint }
				: { value: marginValue, unit: 'px' },
			message: 'Button margin updated.',
			...actionTarget,
		};
	}

	const minWidthValue = extractButtonSizeValue(message, 'min width');
	if (Number.isFinite(minWidthValue)) {
		const breakpoint = extractBreakpointToken(message);
		return {
			action: actionType,
			property: 'button_min_width',
			value: breakpoint
				? { value: minWidthValue, unit: 'px', breakpoint }
				: { value: minWidthValue, unit: 'px' },
			message: 'Button min width updated.',
			...actionTarget,
		};
	}

	const maxWidthValue = extractButtonSizeValue(message, 'max width');
	if (Number.isFinite(maxWidthValue)) {
		const breakpoint = extractBreakpointToken(message);
		return {
			action: actionType,
			property: 'button_max_width',
			value: breakpoint
				? { value: maxWidthValue, unit: 'px', breakpoint }
				: { value: maxWidthValue, unit: 'px' },
			message: 'Button max width updated.',
			...actionTarget,
		};
	}

	const widthValue = extractButtonSizeValue(message, 'width');
	if (Number.isFinite(widthValue)) {
		const breakpoint = extractBreakpointToken(message);
		return {
			action: actionType,
			property: 'button_width',
			value: breakpoint
				? { value: widthValue, unit: 'px', breakpoint }
				: { value: widthValue, unit: 'px' },
			message: 'Button width updated.',
			...actionTarget,
		};
	}

	const minHeightValue = extractButtonSizeValue(message, 'min height');
	if (Number.isFinite(minHeightValue)) {
		const breakpoint = extractBreakpointToken(message);
		return {
			action: actionType,
			property: 'button_min_height',
			value: breakpoint
				? { value: minHeightValue, unit: 'px', breakpoint }
				: { value: minHeightValue, unit: 'px' },
			message: 'Button min height updated.',
			...actionTarget,
		};
	}

	const maxHeightValue = extractButtonSizeValue(message, 'max height');
	if (Number.isFinite(maxHeightValue)) {
		const breakpoint = extractBreakpointToken(message);
		return {
			action: actionType,
			property: 'button_max_height',
			value: breakpoint
				? { value: maxHeightValue, unit: 'px', breakpoint }
				: { value: maxHeightValue, unit: 'px' },
			message: 'Button max height updated.',
			...actionTarget,
		};
	}

	const heightValue = extractButtonSizeValue(message, 'height');
	if (Number.isFinite(heightValue)) {
		const breakpoint = extractBreakpointToken(message);
		return {
			action: actionType,
			property: 'button_height',
			value: breakpoint
				? { value: heightValue, unit: 'px', breakpoint }
				: { value: heightValue, unit: 'px' },
			message: 'Button height updated.',
			...actionTarget,
		};
	}

	if (/button/.test(String(message || '').toLowerCase())) {
		const lower = String(message || '').toLowerCase();
		if (/(full\s*width|100%|stretch|expand)/.test(lower)) {
			return {
				action: actionType,
				property: 'button_full_width',
				value: true,
				message: 'Button set to full width.',
				...actionTarget,
			};
		}
		if (/(force\s*aspect|aspect\s*ratio)/.test(lower)) {
			return {
				action: actionType,
				property: 'button_force_aspect_ratio',
				value: true,
				message: 'Button aspect ratio locked.',
				...actionTarget,
			};
		}
	}

	const bottomGapValue = extractBottomGapValue(message);
	if (Number.isFinite(bottomGapValue)) {
		const breakpoint = extractBreakpointToken(message);
		return {
			action: actionType,
			property: 'bottom_gap',
			value: breakpoint
				? { value: bottomGapValue, unit: 'px', breakpoint }
				: { value: bottomGapValue, unit: 'px' },
			message: 'Bottom gap updated.',
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

	return null;
};

export const buildButtonBGroupAttributeChanges = (property, value) => {
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
		case 'block_background_status_hover':
			return { 'block-background-status-hover': Boolean(value) };
		case 'border':
			return buildBorderChanges(value, { isHover: false, prefix: '' });
		case 'border_hover':
			return buildBorderChanges(value, { isHover: true, prefix: '' });
		case 'border_radius':
			return buildBorderRadiusChanges(value, { isHover: false, prefix: '' });
		case 'border_radius_hover':
			return buildBorderRadiusChanges(value, { isHover: true, prefix: '' });
		case 'box_shadow':
			return buildBoxShadowChanges(value, { isHover: false, prefix: '' });
		case 'box_shadow_hover':
			return buildBoxShadowChanges(value, { isHover: true, prefix: '' });
		case 'button_background':
			return buildButtonBackgroundChanges(value, { isHover: false });
		case 'button_background_hover':
			return buildButtonBackgroundChanges(value, { isHover: true });
		case 'button_background_status_hover':
			return { 'button-background-status-hover': Boolean(value) };
		case 'button_border':
			return buildBorderChanges(value, { isHover: false, prefix: 'button-' });
		case 'button_border_hover':
			return buildBorderChanges(value, { isHover: true, prefix: 'button-' });
		case 'button_border_radius':
			return buildBorderRadiusChanges(value, { isHover: false, prefix: 'button-' });
		case 'button_border_radius_hover':
			return buildBorderRadiusChanges(value, { isHover: true, prefix: 'button-' });
		case 'button_box_shadow':
			return buildBoxShadowChanges(value, { isHover: false, prefix: 'button-' });
		case 'button_box_shadow_hover':
			return buildBoxShadowChanges(value, { isHover: true, prefix: 'button-' });
		case 'button_margin':
			return buildSpacingChanges('margin', value, 'button-');
		case 'button_padding':
			return buildSpacingChanges('padding', value, 'button-');
		case 'button_width':
			return buildSizeChanges('width', value, 'button-');
		case 'button_height':
			return buildSizeChanges('height', value, 'button-');
		case 'button_min_height':
			return buildSizeChanges('min-height', value, 'button-');
		case 'button_max_height':
			return buildSizeChanges('max-height', value, 'button-');
		case 'button_min_width':
			return buildSizeChanges('min-width', value, 'button-');
		case 'button_max_width':
			return buildSizeChanges('max-width', value, 'button-');
		case 'button_full_width':
			return buildBooleanBreakpointChanges('full-width', value, 'button-');
		case 'button_force_aspect_ratio':
			return buildBooleanBreakpointChanges('force-aspect-ratio', value, 'button-');
		case 'button_size_advanced_options':
			return { 'button-size-advanced-options': Boolean(value) };
		case 'bottom_gap':
			return buildBottomGapChanges(value, { isHover: false });
		case 'bottom_gap_hover':
			return buildBottomGapChanges(value, { isHover: true });
		case 'block_style':
		case 'blockStyle':
			return { blockStyle: String(value || '').toLowerCase() };
		case 'breakpoints':
			return buildBreakpointChanges(value);
		case 'button_text':
			return { buttonContent: String(value || '') };
		default:
			return null;
	}
};

export const getButtonBGroupSidebarTarget = property => {
	if (!property) return null;
	const normalized = String(property).replace(/-/g, '_');

	if (
		[
			'button_background',
			'button_background_hover',
			'button_background_status_hover',
		].includes(normalized)
	) {
		return { tabIndex: 0, accordion: 'button background' };
	}

	if (
		[
			'button_border',
			'button_border_hover',
			'button_border_radius',
			'button_border_radius_hover',
		].includes(normalized)
	) {
		return { tabIndex: 0, accordion: 'border' };
	}

	if (['button_box_shadow', 'button_box_shadow_hover'].includes(normalized)) {
		return { tabIndex: 0, accordion: 'box shadow' };
	}

	if (
		[
			'button_width',
			'button_height',
			'button_min_height',
			'button_max_height',
			'button_min_width',
			'button_max_width',
			'button_full_width',
			'button_force_aspect_ratio',
			'button_size_advanced_options',
		].includes(normalized)
	) {
		return { tabIndex: 0, accordion: 'height / width' };
	}

	if (['button_margin', 'button_padding'].includes(normalized)) {
		return { tabIndex: 0, accordion: 'margin / padding' };
	}

	if (['bottom_gap', 'bottom_gap_hover'].includes(normalized)) {
		return { tabIndex: 0, accordion: 'typography' };
	}

	if (
		[
			'background_layers',
			'background_layers_hover',
			'block_background_status_hover',
		].includes(normalized)
	) {
		return { tabIndex: 1, accordion: 'background / layer' };
	}

	if (
		[
			'border',
			'border_hover',
			'border_radius',
			'border_radius_hover',
		].includes(normalized)
	) {
		return { tabIndex: 1, accordion: 'border' };
	}

	if (['box_shadow', 'box_shadow_hover'].includes(normalized)) {
		return { tabIndex: 1, accordion: 'box shadow' };
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
	buildButtonBGroupAction,
	buildButtonBGroupAttributeChanges,
	getButtonBGroupSidebarTarget,
};
