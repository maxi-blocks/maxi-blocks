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

const extractUnitValue = (message, patterns, fallbackUnit = 'px') => {
	const raw = extractValueFromPatterns(message, patterns);
	if (!raw) return null;
	const trimmed = String(raw).trim();
	const match = trimmed.match(/^(-?\d+(?:\.\d+)?)(px|%|em|rem|vh|vw|ch)?$/i);
	if (match) {
		return { value: Number(match[1]), unit: match[2] || fallbackUnit };
	}
	const numeric = Number.parseFloat(trimmed);
	if (!Number.isFinite(numeric)) return null;
	return { value: numeric, unit: fallbackUnit };
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

const extractBreakpointToken = message => {
	const lower = String(message || '').toLowerCase();
	for (const entry of BREAKPOINT_ALIASES) {
		if (entry.regex.test(lower)) return entry.key;
	}
	return null;
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

const slugifyIconName = raw => {
	if (!raw) return '';
	return String(raw)
		.trim()
		.toLowerCase()
		.replace(/[^a-z0-9-_\s]/g, '')
		.replace(/\s+/g, '-')
		.replace(/-+/g, '-');
};

const extractIconName = message => {
	const lower = String(message || '').toLowerCase();
	if (!lower.includes('icon')) return null;

	const raw = extractValueFromPatterns(message, [
		/(?:add|use|set|change|swap|replace)\s+(?:the\s+)?icon\s*(?:to|as|with|=|:)?\s*["']?([a-z0-9-_ ]+)["']?/i,
		/icon\s*(?:to|as|named|called)\s*["']?([a-z0-9-_ ]+)["']?/i,
		/["']([a-z0-9-_ ]+)["']\s*icon/i,
	]);
	if (!raw) return null;

	if (/(background|border|padding|spacing|size|width|height|color|stroke|fill)/i.test(raw)) {
		return null;
	}

	const slug = slugifyIconName(raw);
	return slug || null;
};

const extractIconPosition = message => {
	const lower = String(message || '').toLowerCase();
	if (!lower.includes('icon')) return null;
	if (/\bleft\b/.test(lower)) return 'left';
	if (/\bright\b/.test(lower)) return 'right';
	if (/\btop\b/.test(lower)) return 'top';
	if (/\bbottom\b/.test(lower)) return 'bottom';
	return null;
};

const extractIconOnlyIntent = message => {
	const lower = String(message || '').toLowerCase();
	if (!lower.includes('icon')) return null;
	if (/(icon\s*only|only\s*icon|hide\s*text|remove\s*text|no\s*text)/.test(lower)) {
		return true;
	}
	if (/(text\s*only|hide\s*icon|remove\s*icon|no\s*icon)/.test(lower)) {
		return false;
	}
	return null;
};

const extractIconInheritIntent = message => {
	const lower = String(message || '').toLowerCase();
	if (!lower.includes('icon')) return null;
	if (/(inherit|match)\s*(?:the\s*)?(text|button)?\s*color/.test(lower)) {
		return true;
	}
	if (/(custom|separate|own)\s*icon\s*color|don't\s*inherit/.test(lower)) {
		return false;
	}
	return null;
};

const extractIconHoverStatusIntent = message => {
	const lower = String(message || '').toLowerCase();
	if (!lower.includes('icon') || !lower.includes('hover')) return null;
	if (/(enable|show|turn\s*on|activate)/.test(lower)) return true;
	if (/(disable|hide|turn\s*off|deactivate)/.test(lower)) return false;
	return null;
};

const extractIconBackgroundIntent = message => {
	const lower = String(message || '').toLowerCase();
	if (!lower.includes('icon')) return null;
	if (!/(background|bg)/.test(lower)) return null;
	if (/(border|outline|padding|spacing)/.test(lower)) return null;

	const isHover = /hover/.test(lower);
	const palette = parsePaletteColor(message);
	const cssVar = extractCssVar(message);
	const hex = extractHexColor(message);
	const colorValue = palette ?? cssVar ?? hex;
	const resolvedPalette = typeof colorValue === 'number' ? colorValue : null;

	const baseValue =
		colorValue !== null && colorValue !== undefined
			? typeof colorValue === 'number'
				? {
						palette: colorValue,
						color: `var(--maxi-color-${colorValue})`,
				  }
				: {
						paletteStatus: false,
						paletteStatusHover: false,
						color: colorValue,
						colorHover: colorValue,
				  }
			: {
					palette: 4,
					color: 'var(--maxi-color-4)',
			  };

	if (resolvedPalette !== null && baseValue) {
		baseValue.palette = resolvedPalette;
		baseValue.color = `var(--maxi-color-${resolvedPalette})`;
	}

	if (/gradient/.test(lower)) {
		baseValue.activeMedia = 'gradient';
		baseValue.activeMediaHover = 'gradient';
		baseValue.gradient =
			baseValue.gradient ||
			'linear-gradient(90deg, rgba(0,0,0,0.2), rgba(0,0,0,0.6))';
		baseValue.gradientHover =
			baseValue.gradientHover ||
			'linear-gradient(90deg, rgba(0,0,0,0.4), rgba(0,0,0,0.8))';
	}

	return {
		isHover,
		value: baseValue,
	};
};

const extractIconBorderConfig = message => {
	const lower = String(message || '').toLowerCase();
	if (!lower.includes('icon')) return null;
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

const extractIconBorderRadius = message => {
	const lower = String(message || '').toLowerCase();
	if (!lower.includes('icon')) return null;
	if (!/(corner|radius|rounded)/.test(lower)) return null;
	const radius = parseBorderRadius(message);
	if (!Number.isFinite(radius)) return null;
	return { isHover: /hover/.test(lower), value: radius };
};

const extractIconPaddingValue = message => {
	const lower = String(message || '').toLowerCase();
	if (!lower.includes('icon')) return null;
	if (!/padding/.test(lower)) return null;
	return extractUnitValue(message, [
		/icon\s*padding\s*(?:to|=|:|is)?\s*(\d+(?:\.\d+)?\s*(?:px|%|em|rem|vh|vw|ch)?)/i,
		/padding\s*around\s*(?:the\s*)?icon\s*(?:to|=|:|is)?\s*(\d+(?:\.\d+)?\s*(?:px|%|em|rem|vh|vw|ch)?)/i,
	]);
};

const extractIconSpacingValue = message => {
	const lower = String(message || '').toLowerCase();
	if (!lower.includes('icon')) return null;
	if (!/(spacing|gap|space)/.test(lower)) return null;
	return extractUnitValue(message, [
		/icon\s*spacing\s*(?:to|=|:|is)?\s*(\d+(?:\.\d+)?\s*(?:px|%|em|rem|vh|vw|ch)?)/i,
		/gap\s*between\s*icon(?:s)?\s*(?:and\s*text)?\s*(?:to|=|:|is)?\s*(\d+(?:\.\d+)?\s*(?:px|%|em|rem|vh|vw|ch)?)/i,
		/space\s*between\s*icon(?:s)?\s*(?:and\s*text)?\s*(?:to|=|:|is)?\s*(\d+(?:\.\d+)?\s*(?:px|%|em|rem|vh|vw|ch)?)/i,
	]);
};

const extractIconSizeIntent = message => {
	const lower = String(message || '').toLowerCase();
	if (!lower.includes('icon')) return null;
	const isHover = /hover/.test(lower);
	if (/width/.test(lower)) {
		if (/auto|fit\s*content/.test(lower)) {
			return { type: 'width', value: { value: '', unit: 'px', fitContent: true }, isHover };
		}
		const parsed = extractUnitValue(message, [
			/icon\s*width\s*(?:to|=|:|is)?\s*(\d+(?:\.\d+)?\s*(?:px|%|em|rem|vh|vw|ch)?)/i,
			/width\s*of\s*(?:the\s*)?icon\s*(?:to|=|:|is)?\s*(\d+(?:\.\d+)?\s*(?:px|%|em|rem|vh|vw|ch)?)/i,
		]);
		return parsed ? { type: 'width', value: parsed, isHover } : null;
	}
	if (/height/.test(lower)) {
		const parsed = extractUnitValue(message, [
			/icon\s*height\s*(?:to|=|:|is)?\s*(\d+(?:\.\d+)?\s*(?:px|%|em|rem|vh|vw|ch)?)/i,
			/height\s*of\s*(?:the\s*)?icon\s*(?:to|=|:|is)?\s*(\d+(?:\.\d+)?\s*(?:px|%|em|rem|vh|vw|ch)?)/i,
		]);
		return parsed ? { type: 'height', value: parsed, isHover } : null;
	}
	if (/size/.test(lower)) {
		const parsed = extractUnitValue(message, [
			/icon\s*size\s*(?:to|=|:|is)?\s*(\d+(?:\.\d+)?\s*(?:px|%|em|rem|vh|vw|ch)?)/i,
		]);
		return parsed ? { type: 'size', value: parsed, isHover } : null;
	}
	return null;
};

const extractIconStrokeWidth = message => {
	const lower = String(message || '').toLowerCase();
	if (!lower.includes('icon')) return null;
	if (!/(stroke\s*width|line\s*width|stroke\s*thickness)/.test(lower)) return null;
	const value = extractNumericValue(message, [
		/(\d+(?:\.\d+)?)\s*(?:px)?\s*(?:stroke\s*width|line\s*width|stroke\s*thickness)/i,
	]);
	if (!Number.isFinite(value)) return null;
	return { isHover: /hover/.test(lower), value };
};

const extractIconColorIntent = message => {
	const lower = String(message || '').toLowerCase();
	if (!lower.includes('icon')) return null;
	if (!/(color|colour|fill|stroke)/.test(lower)) return null;
	const palette = parsePaletteColor(message);
	const cssVar = extractCssVar(message);
	const hex = extractHexColor(message);
	const value = palette ?? cssVar ?? hex;
	if (value === null || value === undefined) return null;
	const target = lower.includes('stroke') ? 'stroke' : 'fill';
	return { target, value, isHover: /hover/.test(lower) };
};
const DEFAULT_ICON_BACKGROUND = {
	palette: 4,
	paletteHover: 6,
	paletteOpacity: 1,
	paletteOpacityHover: 0.8,
	paletteStatus: true,
	paletteStatusHover: true,
	paletteScStatus: false,
	paletteScStatusHover: false,
	color: 'var(--maxi-color-4)',
	colorHover: 'var(--maxi-color-6)',
	gradient: 'linear-gradient(90deg, rgba(0,0,0,0.2), rgba(0,0,0,0.6))',
	gradientHover: 'linear-gradient(90deg, rgba(0,0,0,0.4), rgba(0,0,0,0.8))',
	gradientOpacity: 0.7,
	gradientOpacityHover: 0.5,
	activeMedia: 'color',
	activeMediaHover: 'color',
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

const normalizeIconBackgroundValue = rawValue => {
	if (rawValue === null || rawValue === undefined) {
		return { ...DEFAULT_ICON_BACKGROUND };
	}
	if (typeof rawValue === 'number') {
		return {
			...DEFAULT_ICON_BACKGROUND,
			palette: rawValue,
			color: `var(--maxi-color-${rawValue})`,
		};
	}
	if (typeof rawValue === 'string') {
		return {
			...DEFAULT_ICON_BACKGROUND,
			paletteStatus: false,
			paletteStatusHover: false,
			color: rawValue,
			colorHover: rawValue,
		};
	}
	if (typeof rawValue === 'object') {
		return {
			...DEFAULT_ICON_BACKGROUND,
			...rawValue,
		};
	}
	return { ...DEFAULT_ICON_BACKGROUND };
};

const buildIconBackgroundChanges = (value, { isHover = false } = {}) => {
	const { value: rawValue, breakpoint } = normalizeValueWithBreakpoint(value);
	const base = normalizeIconBackgroundValue(rawValue);
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
		  };

	breakpoints.forEach(bp => {
		const suffix = `-${bp}${isHover ? '-hover' : ''}`;
		changes[`icon-background-active-media${suffix}`] = state.activeMedia;
		changes[`icon-background-color${suffix}`] = state.color;
		changes[`icon-background-gradient${suffix}`] = state.gradient;
		changes[`icon-background-gradient-opacity${suffix}`] = state.gradientOpacity;
		changes[`icon-background-palette-status${suffix}`] = state.paletteStatus;
		changes[`icon-background-palette-color${suffix}`] = state.palette;
		changes[`icon-background-palette-opacity${suffix}`] = state.paletteOpacity;
		changes[`icon-background-palette-sc-status${suffix}`] = state.paletteScStatus;

		changes[`icon-background-color-wrapper-width${suffix}`] = base.wrapperWidth;
		changes[`icon-background-color-wrapper-width-unit${suffix}`] = base.wrapperUnit;
		changes[`icon-background-color-wrapper-height${suffix}`] = base.wrapperHeight;
		changes[`icon-background-color-wrapper-height-unit${suffix}`] = base.wrapperUnit;
		changes[`icon-background-color-wrapper-position-top${suffix}`] = base.position.top;
		changes[`icon-background-color-wrapper-position-top-unit${suffix}`] =
			base.position.unit;
		changes[`icon-background-color-wrapper-position-right${suffix}`] =
			base.position.right;
		changes[`icon-background-color-wrapper-position-right-unit${suffix}`] =
			base.position.unit;
		changes[`icon-background-color-wrapper-position-bottom${suffix}`] =
			base.position.bottom;
		changes[`icon-background-color-wrapper-position-bottom-unit${suffix}`] =
			base.position.unit;
		changes[`icon-background-color-wrapper-position-left${suffix}`] =
			base.position.left;
		changes[`icon-background-color-wrapper-position-left-unit${suffix}`] =
			base.position.unit;
		changes[`icon-background-color-wrapper-position-sync${suffix}`] =
			base.position.sync;

		changes[`icon-background-gradient-wrapper-width${suffix}`] = base.wrapperWidth;
		changes[`icon-background-gradient-wrapper-width-unit${suffix}`] =
			base.wrapperUnit;
		changes[`icon-background-gradient-wrapper-height${suffix}`] =
			base.wrapperHeight;
		changes[`icon-background-gradient-wrapper-height-unit${suffix}`] =
			base.wrapperUnit;
		changes[`icon-background-gradient-wrapper-position-top${suffix}`] =
			base.position.top;
		changes[`icon-background-gradient-wrapper-position-top-unit${suffix}`] =
			base.position.unit;
		changes[`icon-background-gradient-wrapper-position-right${suffix}`] =
			base.position.right;
		changes[`icon-background-gradient-wrapper-position-right-unit${suffix}`] =
			base.position.unit;
		changes[`icon-background-gradient-wrapper-position-bottom${suffix}`] =
			base.position.bottom;
		changes[`icon-background-gradient-wrapper-position-bottom-unit${suffix}`] =
			base.position.unit;
		changes[`icon-background-gradient-wrapper-position-left${suffix}`] =
			base.position.left;
		changes[`icon-background-gradient-wrapper-position-left-unit${suffix}`] =
			base.position.unit;
		changes[`icon-background-gradient-wrapper-position-sync${suffix}`] =
			base.position.sync;
	});

	if (isHover) {
		changes['icon-status-hover'] = true;
	}

	return changes;
};

const buildIconBorderChanges = (value, { isHover = false } = {}) => {
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
		changes[`icon-border-style${suffix}`] = style;
		changes[`icon-border-top-width${suffix}`] = width;
		changes[`icon-border-bottom-width${suffix}`] = width;
		changes[`icon-border-left-width${suffix}`] = width;
		changes[`icon-border-right-width${suffix}`] = width;
		changes[`icon-border-sync-width${suffix}`] = 'all';
		changes[`icon-border-unit-width${suffix}`] = 'px';
		changes[`icon-border-palette-status${suffix}`] = isPalette;
		changes[`icon-border-palette-color${suffix}`] = isPalette ? color : '';
		changes[`icon-border-color${suffix}`] = isPalette
			? `var(--maxi-color-${color})`
			: color || '';
		changes[`icon-border-palette-opacity${suffix}`] = isPalette ? opacity : '';
		changes[`icon-border-palette-sc-status${suffix}`] = scStatus;
	});

	if (isHover) {
		changes['icon-status-hover'] = true;
	}

	return changes;
};

const buildIconBorderRadiusChanges = (value, { isHover = false } = {}) => {
	const { value: rawValue, breakpoint } = normalizeValueWithBreakpoint(value);
	const radius = Number.isFinite(Number(rawValue)) ? Number(rawValue) : 8;
	const breakpoints = breakpoint ? [breakpoint] : RESPONSIVE_BREAKPOINTS;
	const changes = {};

	breakpoints.forEach(bp => {
		const suffix = `-${bp}${isHover ? '-hover' : ''}`;
		changes[`icon-border-top-left-radius${suffix}`] = radius;
		changes[`icon-border-top-right-radius${suffix}`] = radius;
		changes[`icon-border-bottom-left-radius${suffix}`] = radius;
		changes[`icon-border-bottom-right-radius${suffix}`] = radius;
		changes[`icon-border-sync-radius${suffix}`] = 'all';
		changes[`icon-border-unit-radius${suffix}`] = 'px';
	});

	if (isHover) {
		changes['icon-status-hover'] = true;
	}

	return changes;
};

const buildSpacingChanges = (type, value, prefix = 'icon-') => {
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

const buildIconSpacingChanges = (value, { isHover = false } = {}) => {
	const { value: rawValue, breakpoint } = normalizeValueWithBreakpoint(value);
	const config =
		rawValue && typeof rawValue === 'object' && !Array.isArray(rawValue)
			? rawValue
			: {};
	const rawNumber =
		config.value !== undefined && config.value !== null ? config.value : rawValue;
	const numeric = Number(rawNumber);
	if (!Number.isFinite(numeric)) return null;
	const unit = config.unit || 'px';
	const breakpoints = breakpoint ? [breakpoint] : RESPONSIVE_BREAKPOINTS;
	const changes = {};

	breakpoints.forEach(bp => {
		const suffix = `-${bp}${isHover ? '-hover' : ''}`;
		changes[`icon-spacing${suffix}`] = numeric;
		changes[`icon-spacing-unit${suffix}`] = unit;
	});

	if (isHover) {
		changes['icon-status-hover'] = true;
	}

	return changes;
};

const buildIconSizeChanges = (type, value, { isHover = false } = {}) => {
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
		const suffix = `-${bp}${isHover ? '-hover' : ''}`;
		changes[`icon-${type}${suffix}`] = val;
		changes[`icon-${type}-unit${suffix}`] = unit;
		if (type === 'width') {
			changes[`icon-width-fit-content${suffix}`] = Boolean(fitContent);
		}
	});

	if (isHover) {
		changes['icon-status-hover'] = true;
	}

	return changes;
};

const buildBooleanBreakpointChanges = (
	key,
	value,
	{ prefix = 'icon-', isHover = false } = {}
) => {
	const { value: rawValue, breakpoint } = normalizeValueWithBreakpoint(value);
	const boolValue = Boolean(rawValue);
	const breakpoints = breakpoint ? [breakpoint] : RESPONSIVE_BREAKPOINTS;
	const changes = {};

	breakpoints.forEach(bp => {
		const suffix = `-${bp}${isHover ? '-hover' : ''}`;
		changes[`${prefix}${key}${suffix}`] = boolValue;
	});

	if (isHover) {
		changes['icon-status-hover'] = true;
	}

	return changes;
};

const normalizeIconColorValue = rawValue => {
	if (rawValue && typeof rawValue === 'object' && !Array.isArray(rawValue)) {
		if (rawValue.palette !== undefined) {
			return {
				isPalette: true,
				palette: rawValue.palette,
				opacity: rawValue.opacity ?? rawValue.paletteOpacity ?? 100,
				scStatus: rawValue.scStatus ?? rawValue.paletteScStatus ?? false,
				color: rawValue.color,
			};
		}
		if (rawValue.color !== undefined) {
			return {
				isPalette: false,
				color: rawValue.color,
				opacity: rawValue.opacity ?? 100,
				scStatus: rawValue.scStatus ?? false,
			};
		}
		if (rawValue.value !== undefined) {
			const isPalette = typeof rawValue.value === 'number';
			return {
				isPalette,
				palette: isPalette ? rawValue.value : undefined,
				color: isPalette ? undefined : rawValue.value,
				opacity: rawValue.opacity ?? rawValue.paletteOpacity ?? 100,
				scStatus: rawValue.scStatus ?? rawValue.paletteScStatus ?? false,
			};
		}
	}

	const isPalette = typeof rawValue === 'number';
	return {
		isPalette,
		palette: isPalette ? rawValue : undefined,
		color: isPalette ? undefined : rawValue,
		opacity: 100,
		scStatus: false,
	};
};

const buildIconColorChanges = (
	value,
	{ target = 'fill', isHover = false } = {}
) => {
	const { value: rawValue, breakpoint } = normalizeValueWithBreakpoint(value);
	if (rawValue === null || rawValue === undefined) return null;

	const normalized = normalizeIconColorValue(rawValue);
	const breakpoints = breakpoint ? [breakpoint] : RESPONSIVE_BREAKPOINTS;
	const changes = {};

	breakpoints.forEach(bp => {
		const suffix = `-${bp}${isHover ? '-hover' : ''}`;
		changes[`icon-${target}-palette-status${suffix}`] = normalized.isPalette;
		changes[`icon-${target}-palette-color${suffix}`] = normalized.isPalette
			? normalized.palette
			: '';
		changes[`icon-${target}-palette-opacity${suffix}`] = normalized.isPalette
			? normalized.opacity
			: '';
		changes[`icon-${target}-palette-sc-status${suffix}`] = normalized.isPalette
			? normalized.scStatus
			: '';
		changes[`icon-${target}-color${suffix}`] = normalized.isPalette
			? ''
			: normalized.color;
	});

	changes['icon-inherit'] = false;

	if (isHover) {
		changes['icon-status-hover'] = true;
	}

	return changes;
};

const buildIconStrokeWidthChanges = (value, { isHover = false } = {}) => {
	const { value: rawValue, breakpoint } = normalizeValueWithBreakpoint(value);
	const config =
		rawValue && typeof rawValue === 'object' && !Array.isArray(rawValue)
			? rawValue
			: {};
	const rawNumber =
		config.value !== undefined && config.value !== null ? config.value : rawValue;
	const numeric = Number(rawNumber);
	if (!Number.isFinite(numeric)) return null;
	const breakpoints = breakpoint ? [breakpoint] : RESPONSIVE_BREAKPOINTS;
	const changes = {};

	breakpoints.forEach(bp => {
		const suffix = `-${bp}${isHover ? '-hover' : ''}`;
		changes[`icon-stroke${suffix}`] = numeric;
	});

	if (isHover) {
		changes['icon-status-hover'] = true;
	}

	return changes;
};
export const buildButtonIGroupAction = (message, { scope = 'selection' } = {}) => {
	const actionType = scope === 'page' ? 'update_page' : 'update_selection';
	const actionTarget = actionType === 'update_page' ? { target_block: 'button' } : {};
	const lower = String(message || '').toLowerCase();
	const breakpoint = extractBreakpointToken(message);
	const hoverToken = /hover/.test(lower);

	const hoverStatus = extractIconHoverStatusIntent(message);
	if (typeof hoverStatus === 'boolean') {
		return {
			action: actionType,
			property: 'icon_status_hover',
			value: hoverStatus,
			message: hoverStatus ? 'Icon hover enabled.' : 'Icon hover disabled.',
			...actionTarget,
		};
	}

	const iconOnly = extractIconOnlyIntent(message);
	if (typeof iconOnly === 'boolean') {
		return {
			action: actionType,
			property: 'icon_only',
			value: iconOnly,
			message: iconOnly ? 'Icon only enabled.' : 'Icon only disabled.',
			...actionTarget,
		};
	}

	const iconInherit = extractIconInheritIntent(message);
	if (typeof iconInherit === 'boolean') {
		return {
			action: actionType,
			property: 'icon_inherit',
			value: iconInherit,
			message: iconInherit
				? 'Icon inherits text color.'
				: 'Icon uses its own color.',
			...actionTarget,
		};
	}

	const iconPosition = extractIconPosition(message);
	if (iconPosition) {
		return {
			action: actionType,
			property: hoverToken ? 'icon_position_hover' : 'icon_position',
			value: iconPosition,
			message: 'Icon position updated.',
			...actionTarget,
		};
	}

	const sizeIntent = extractIconSizeIntent(message);
	if (sizeIntent) {
		const propMap = {
			width: 'icon_width',
			height: 'icon_height',
			size: 'icon_size',
		};
		const baseProp = propMap[sizeIntent.type];
		const property = sizeIntent.isHover ? `${baseProp}_hover` : baseProp;
		const value = breakpoint
			? { ...sizeIntent.value, breakpoint }
			: sizeIntent.value;
		return {
			action: actionType,
			property,
			value,
			message: 'Icon size updated.',
			...actionTarget,
		};
	}

	const strokeWidth = extractIconStrokeWidth(message);
	if (strokeWidth) {
		const property = strokeWidth.isHover
			? 'icon_stroke_width_hover'
			: 'icon_stroke_width';
		const value = breakpoint
			? { value: strokeWidth.value, breakpoint }
			: strokeWidth.value;
		return {
			action: actionType,
			property,
			value,
			message: 'Icon stroke width updated.',
			...actionTarget,
		};
	}

	const spacingValue = extractIconSpacingValue(message);
	if (spacingValue) {
		const property = hoverToken ? 'icon_spacing_hover' : 'icon_spacing';
		const value = breakpoint
			? { ...spacingValue, breakpoint }
			: spacingValue;
		return {
			action: actionType,
			property,
			value,
			message: 'Icon spacing updated.',
			...actionTarget,
		};
	}

	const paddingValue = extractIconPaddingValue(message);
	if (paddingValue) {
		const value = breakpoint
			? { ...paddingValue, breakpoint }
			: paddingValue;
		return {
			action: actionType,
			property: 'icon_padding',
			value,
			message: 'Icon padding updated.',
			...actionTarget,
		};
	}

	const borderRadius = extractIconBorderRadius(message);
	if (borderRadius) {
		const property = borderRadius.isHover
			? 'icon_border_radius_hover'
			: 'icon_border_radius';
		const value = breakpoint
			? { value: borderRadius.value, breakpoint }
			: borderRadius.value;
		return {
			action: actionType,
			property,
			value,
			message: 'Icon corners updated.',
			...actionTarget,
		};
	}

	const borderConfig = extractIconBorderConfig(message);
	if (borderConfig) {
		const property = borderConfig.isHover ? 'icon_border_hover' : 'icon_border';
		const value = breakpoint
			? { value: borderConfig.value, breakpoint }
			: borderConfig.value;
		return {
			action: actionType,
			property,
			value,
			message: 'Icon border updated.',
			...actionTarget,
		};
	}

	const backgroundIntent = extractIconBackgroundIntent(message);
	if (backgroundIntent) {
		const property = backgroundIntent.isHover
			? 'icon_background_hover'
			: 'icon_background';
		const value = breakpoint
			? { value: backgroundIntent.value, breakpoint }
			: backgroundIntent.value;
		return {
			action: actionType,
			property,
			value,
			message: 'Icon background updated.',
			...actionTarget,
		};
	}

	const colorIntent = extractIconColorIntent(message);
	if (colorIntent) {
		const property = colorIntent.target === 'stroke'
			? colorIntent.isHover
				? 'icon_stroke_color_hover'
				: 'icon_stroke_color'
			: colorIntent.isHover
				? 'icon_fill_color_hover'
				: 'icon_fill_color';
		const value = breakpoint
			? { value: colorIntent.value, breakpoint }
			: colorIntent.value;
		return {
			action: actionType,
			property,
			value,
			message: 'Icon color updated.',
			...actionTarget,
		};
	}

	const iconName = extractIconName(message);
	if (iconName) {
		return {
			action: actionType,
			property: 'icon_content',
			value: iconName,
			message: 'Icon updated.',
			...actionTarget,
		};
	}

	return null;
};

export const buildButtonIGroupAttributeChanges = (property, value) => {
	if (!property) return null;
	const normalized = String(property).replace(/-/g, '_');

	switch (normalized) {
		case 'icon_background':
			return buildIconBackgroundChanges(value, { isHover: false });
		case 'icon_background_hover':
			return buildIconBackgroundChanges(value, { isHover: true });
		case 'icon_border':
			return buildIconBorderChanges(value, { isHover: false });
		case 'icon_border_hover':
			return buildIconBorderChanges(value, { isHover: true });
		case 'icon_border_radius':
			return buildIconBorderRadiusChanges(value, { isHover: false });
		case 'icon_border_radius_hover':
			return buildIconBorderRadiusChanges(value, { isHover: true });
		case 'icon_padding':
			return buildSpacingChanges('padding', value, 'icon-');
		case 'icon_spacing':
			return buildIconSpacingChanges(value, { isHover: false });
		case 'icon_spacing_hover':
			return buildIconSpacingChanges(value, { isHover: true });
		case 'icon_width':
			return buildIconSizeChanges('width', value, { isHover: false });
		case 'icon_width_hover':
			return buildIconSizeChanges('width', value, { isHover: true });
		case 'icon_height':
			return buildIconSizeChanges('height', value, { isHover: false });
		case 'icon_height_hover':
			return buildIconSizeChanges('height', value, { isHover: true });
		case 'icon_size':
			return {
				...buildIconSizeChanges('width', value, { isHover: false }),
				...buildIconSizeChanges('height', value, { isHover: false }),
			};
		case 'icon_size_hover':
			return {
				...buildIconSizeChanges('width', value, { isHover: true }),
				...buildIconSizeChanges('height', value, { isHover: true }),
			};
		case 'icon_force_aspect_ratio':
			return buildBooleanBreakpointChanges('force-aspect-ratio', value, {
				prefix: 'icon-',
				isHover: false,
			});
		case 'icon_force_aspect_ratio_hover':
			return buildBooleanBreakpointChanges('force-aspect-ratio', value, {
				prefix: 'icon-',
				isHover: true,
			});
		case 'icon_fill_color':
			return buildIconColorChanges(value, { target: 'fill', isHover: false });
		case 'icon_fill_color_hover':
			return buildIconColorChanges(value, { target: 'fill', isHover: true });
		case 'icon_stroke_color':
			return buildIconColorChanges(value, { target: 'stroke', isHover: false });
		case 'icon_stroke_color_hover':
			return buildIconColorChanges(value, { target: 'stroke', isHover: true });
		case 'icon_stroke_width':
			return buildIconStrokeWidthChanges(value, { isHover: false });
		case 'icon_stroke_width_hover':
			return buildIconStrokeWidthChanges(value, { isHover: true });
		case 'icon_content':
			return { 'icon-content': String(value || '') };
		case 'icon_content_hover':
			return {
				'icon-content-hover': String(value || ''),
				'icon-status-hover': true,
			};
		case 'icon_position':
			return { 'icon-position': String(value || '') };
		case 'icon_position_hover':
			return {
				'icon-position-hover': String(value || ''),
				'icon-status-hover': true,
			};
		case 'icon_only':
			return { 'icon-only': Boolean(value) };
		case 'icon_only_hover':
			return { 'icon-only-hover': Boolean(value), 'icon-status-hover': true };
		case 'icon_inherit':
			return { 'icon-inherit': Boolean(value) };
		case 'icon_inherit_hover':
			return { 'icon-inherit-hover': Boolean(value), 'icon-status-hover': true };
		case 'icon_status_hover':
			return { 'icon-status-hover': Boolean(value) };
		case 'icon_status_hover_target':
			return { 'icon-status-hover-target': Boolean(value) };
		default:
			return null;
	}
};
export const getButtonIGroupSidebarTarget = property => {
	if (!property) return null;
	const normalized = String(property).replace(/-/g, '_');

	if (
		[
			'icon_content',
			'icon_content_hover',
			'icon_position',
			'icon_position_hover',
			'icon_only',
			'icon_only_hover',
			'icon_inherit',
			'icon_inherit_hover',
			'icon_spacing',
			'icon_spacing_hover',
			'icon_width',
			'icon_width_hover',
			'icon_height',
			'icon_height_hover',
			'icon_size',
			'icon_size_hover',
			'icon_force_aspect_ratio',
			'icon_force_aspect_ratio_hover',
			'icon_fill_color',
			'icon_fill_color_hover',
			'icon_stroke_color',
			'icon_stroke_color_hover',
			'icon_stroke_width',
			'icon_stroke_width_hover',
			'icon_status_hover',
			'icon_status_hover_target',
		].includes(normalized)
	) {
		return { tabIndex: 0, accordion: 'icon' };
	}

	if (['icon_background', 'icon_background_hover'].includes(normalized)) {
		return { tabIndex: 0, accordion: 'icon background' };
	}

	if (
		[
			'icon_border',
			'icon_border_hover',
			'icon_border_radius',
			'icon_border_radius_hover',
		].includes(normalized)
	) {
		return { tabIndex: 0, accordion: 'icon border' };
	}

	if (normalized === 'icon_padding') {
		return { tabIndex: 0, accordion: 'icon padding' };
	}

	return null;
};

export default {
	buildButtonIGroupAction,
	buildButtonIGroupAttributeChanges,
	getButtonIGroupSidebarTarget,
};
