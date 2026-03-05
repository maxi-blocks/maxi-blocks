import {
	buildLayoutAGroupAction,
	normalizeValueWithBreakpoint as normalizeLayoutValueWithBreakpoint,
} from './layoutAGroup';
import { extractAnchorLink, extractAriaLabel } from './metaAGroup';
import {
	RESPONSIVE_BREAKPOINTS,
	extractNumericValue,
	extractBreakpointToken,
	extractBreakpointValue,
	parsePaletteColor,
	parseBorderStyle,
	parseBorderWidth,
	parseBorderRadius,
	parseShadowPreset,
} from './shared/attributeParsers';
import {
	parseBackgroundLayerCommand,
	applyBackgroundLayerCommand,
	isBackgroundLayerCommand,
} from './shared/backgroundLayers';
import {
	buildTextStyleGroupAction,
	buildTextStyleGroupAttributeChanges,
	getTextStyleGroupSidebarTarget,
} from './shared/textStyleGroup';

// buttonAGroup
const buttonAGroup = (() => {
const buildButtonAGroupAction = (message, options = {}) => {
	const actionType = options?.scope === 'page' ? 'update_page' : 'update_selection';
	const actionTarget = actionType === 'update_page' ? { target_block: 'button' } : {};

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

	const layoutAction = buildLayoutAGroupAction(message, {
		...options,
		targetBlock: 'button',
		propertyMap: {
			alignItems: 'align_items',
			alignContent: 'align_content',
			alignment: 'alignment',
		},
	});
	if (layoutAction) {
		return layoutAction;
	}

	return null;
};

const buildButtonAGroupAttributeChanges = (
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
		case 'align_items': {
			const { value: rawValue, breakpoint } = normalizeLayoutValueWithBreakpoint(value);
			const alignValue = String(rawValue || '');
			const targetBreakpoint = breakpoint || 'general';
			return { [`align-items-${targetBreakpoint}`]: alignValue };
		}
		case 'align_content': {
			const { value: rawValue, breakpoint } = normalizeLayoutValueWithBreakpoint(value);
			const alignValue = String(rawValue || '');
			const targetBreakpoint = breakpoint || 'general';
			return { [`align-content-${targetBreakpoint}`]: alignValue };
		}
		case 'alignment': {
			const { value: rawValue, breakpoint } = normalizeLayoutValueWithBreakpoint(value);
			const alignmentValue = String(rawValue || '');
			const targetBreakpoint = breakpoint || 'general';
			return { [`alignment-${targetBreakpoint}`]: alignmentValue };
		}
		default:
			return null;
	}
};

const getButtonAGroupSidebarTarget = property => {
	if (!property) return null;
	const normalized = String(property).replace(/-/g, '_');

	if (normalized === 'anchor_link') {
		return { tabIndex: 2, accordion: 'add anchor link' };
	}

	if (normalized === 'aria_label') {
		return { tabIndex: 2, accordion: 'aria label' };
	}

	if (['align_items', 'align_content'].includes(normalized)) {
		return { tabIndex: 2, accordion: 'flexbox' };
	}

	if (normalized === 'alignment') {
		return { tabIndex: 0, accordion: 'alignment' };
	}

	return null;
};

return {
	buildButtonAGroupAction,
	buildButtonAGroupAttributeChanges,
	getButtonAGroupSidebarTarget,
};
})();

export const {
	buildButtonAGroupAction,
	buildButtonAGroupAttributeChanges,
	getButtonAGroupSidebarTarget,
} = buttonAGroup;

// buttonBGroup
const buttonBGroup = (() => {
const extractValueFromPatterns = (message, patterns) => {
	if (!message) return null;
	for (const pattern of patterns) {
		const match = message.match(pattern);
		if (match && match[1]) return match[1].trim();
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
			unit: rawValue.unit || null,
		};
	}

	return { value: rawValue, breakpoint: null, unit: null };
};


const HEX_COLOR_REGEX = /#(?:[0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})(?![0-9a-fA-F])/;

const extractHexColor = message => {
	if (!message) return null;
	const match = message.match(HEX_COLOR_REGEX);
	return match ? match[0] : null;
};

const clampOpacity = value => Math.min(1, Math.max(0, value));

const extractOpacityValue = message => {
	if (!message) return null;
	const percentMatch = message.match(/(\d+(?:\.\d+)?)\s*%/);
	if (percentMatch) {
		const percent = Number.parseFloat(percentMatch[1]);
		if (Number.isFinite(percent)) return clampOpacity(percent / 100);
	}
	const rawMatch = message.match(/\bopacity\b[^0-9]*(-?\d+(?:\.\d+)?)/i);
	if (rawMatch) {
		const raw = Number.parseFloat(rawMatch[1]);
		if (!Number.isFinite(raw)) return null;
		return clampOpacity(raw > 1 ? raw / 100 : raw);
	}
	return null;
};

const extractGradientAngle = message => {
	const lower = String(message || '').toLowerCase();
	const degMatch = lower.match(/(\d{1,3})\s*deg/);
	if (degMatch) {
		const angle = Number.parseInt(degMatch[1], 10);
		if (Number.isFinite(angle) && angle >= 0 && angle <= 360) return angle;
	}
	if (lower.includes('diagonal')) return 135;
	if (lower.includes('to left')) return 270;
	if (lower.includes('to top')) return 0;
	if (lower.includes('vertical') || lower.includes('to bottom')) return 180;
	if (lower.includes('horizontal') || lower.includes('to right')) return 90;
	return null;
};

const applyGradientAngle = (gradient, angle) => {
	if (!gradient || angle === null || angle === undefined) return gradient;
	const raw = String(gradient);
	if (/linear-gradient/i.test(raw)) {
		if (/linear-gradient\([^,]+,/i.test(raw)) {
			return raw.replace(/linear-gradient\([^,]+,/i, `linear-gradient(${angle}deg,`);
		}
		return `linear-gradient(${angle}deg, rgba(0,0,0,0.2), rgba(0,0,0,0.6))`;
	}
	return gradient;
};


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

const extractButtonBackgroundStatusIntent = message => {
	const lower = String(message || '').toLowerCase();
	if (!lower.includes('button') || !lower.includes('background')) return null;
	if (!lower.includes('hover')) return null;
	if (/(enable|show|turn\s*on|activate)/.test(lower)) return true;
	if (/(disable|hide|turn\s*off|deactivate)/.test(lower)) return false;
	return null;
};

const extractBackgroundHoverStatus = message => {
	const lower = String(message || '').toLowerCase();
	if (!lower.includes('hover') || !lower.includes('background')) return null;
	if (!/(layer|overlay)/.test(lower)) return null;
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
	const isHover = /hover/.test(lower);
	const wantsGradient = /gradient/.test(lower);
	const palette = parsePaletteColor(message);
	const hexColor = extractHexColor(message);
	const isTransparent = /\btransparent\b/.test(lower);
	const opacity = extractOpacityValue(message);

	if (wantsGradient) {
		const angle = extractGradientAngle(message);
		const gradient = applyGradientAngle(DEFAULT_BUTTON_BACKGROUND.gradient, angle);
		const value = {
			activeMedia: 'gradient',
			gradient,
		};
		if (Number.isFinite(opacity)) {
			value.gradientOpacity = opacity;
		}
		return { isHover, value };
	}

	if (hexColor || isTransparent || Number.isFinite(palette)) {
		const value = {
			activeMedia: 'color',
		};
		if (hexColor) {
			value.color = hexColor;
			value.paletteStatus = false;
			value.paletteScStatus = false;
		} else if (isTransparent) {
			value.color = 'transparent';
			value.paletteStatus = false;
			value.paletteScStatus = false;
		} else if (Number.isFinite(palette)) {
			value.palette = palette;
			value.color = `var(--maxi-color-${palette})`;
		}
		if (Number.isFinite(opacity)) {
			value.paletteOpacity = opacity;
		}
		return { isHover, value };
	}

	return null;
};

const extractButtonBackgroundOpacityIntent = message => {
	const lower = String(message || '').toLowerCase();
	if (!/button/.test(lower)) return null;
	if (!/(background|bg)/.test(lower)) return null;
	if (!/(opacity|transparent|transparen(?:cy|t)|alpha)/.test(lower)) return null;

	const opacity = extractOpacityValue(message);
	if (!Number.isFinite(opacity)) return null;

	const palette = parsePaletteColor(message);
	const hexColor = extractHexColor(message);
	const isTransparent = /\btransparent\b/.test(lower);
	const isGradient = /gradient/.test(lower);
	const isHover = /hover/.test(lower);

	// If a specific color is provided (non-gradient), let the main background intent handle it.
	if (!isGradient && (Number.isFinite(palette) || hexColor || isTransparent)) {
		return null;
	}

	return {
		isHover,
		isGradient,
		value: opacity,
		breakpoint: extractBreakpointToken(message),
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

const buildButtonBackgroundOpacityChanges = (
	value,
	{ isHover = false, isGradient = false } = {}
) => {
	const { value: rawValue, breakpoint } = normalizeValueWithBreakpoint(value);
	if (!Number.isFinite(rawValue)) return null;
	const opacity = clampOpacity(Number(rawValue));
	const breakpoints = breakpoint ? [breakpoint] : RESPONSIVE_BREAKPOINTS;
	const changes = {};

	breakpoints.forEach(bp => {
		const suffix = `-${bp}${isHover ? '-hover' : ''}`;
		if (isGradient) {
			changes[`button-background-gradient-opacity${suffix}`] = opacity;
			changes[`button-background-active-media${suffix}`] = 'gradient';
		} else {
			changes[`button-background-palette-opacity${suffix}`] = opacity;
		}
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

const buildButtonBGroupAction = (message, { scope = 'selection' } = {}) => {
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

	const backgroundOpacityIntent = extractButtonBackgroundOpacityIntent(message);
	if (backgroundOpacityIntent && backgroundOpacityIntent.isGradient) {
		const value = backgroundOpacityIntent.breakpoint
			? { value: backgroundOpacityIntent.value, breakpoint: backgroundOpacityIntent.breakpoint }
			: backgroundOpacityIntent.value;
		return {
			action: actionType,
			property: backgroundOpacityIntent.isHover
				? 'button_background_gradient_opacity_hover'
				: 'button_background_gradient_opacity',
			value,
			message: 'Button background gradient opacity updated.',
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

	if (backgroundOpacityIntent) {
		const value = backgroundOpacityIntent.breakpoint
			? { value: backgroundOpacityIntent.value, breakpoint: backgroundOpacityIntent.breakpoint }
			: backgroundOpacityIntent.value;
		return {
			action: actionType,
			property: backgroundOpacityIntent.isHover
				? 'button_background_opacity_hover'
				: 'button_background_opacity',
			value,
			message: 'Button background opacity updated.',
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

	const backgroundLayerCommand = parseBackgroundLayerCommand(message);
	if (backgroundLayerCommand) {
		return {
			action: actionType,
			property: backgroundLayerCommand.isHover
				? 'background_layers_hover'
				: 'background_layers',
			value: backgroundLayerCommand,
			message: 'Background layer updated.',
			...actionTarget,
		};
	}

	return null;
};

const buildButtonBGroupAttributeChanges = (
	property,
	value,
	{ attributes } = {}
) => {
	if (!property) return null;
	const normalized = String(property).replace(/-/g, '_');

	switch (normalized) {
		case 'background_layers': {
			if (isBackgroundLayerCommand(value)) {
				const currentLayers = attributes?.['background-layers'] || [];
				const updatedLayers = applyBackgroundLayerCommand(
					currentLayers,
					value
				);
				const changes = updatedLayers
					? { 'background-layers': updatedLayers }
					: null;
				if (!changes) return null;
				if (value.enableHover === true) {
					changes['block-background-status-hover'] = true;
				}
				if (value.disableHover === true) {
					changes['block-background-status-hover'] = false;
				}
				return changes;
			}
			const layers = Array.isArray(value)
				? value
				: value && Array.isArray(value.layers)
					? value.layers
					: null;
			return layers ? { 'background-layers': layers } : null;
		}
		case 'background_layers_hover': {
			if (isBackgroundLayerCommand(value)) {
				const currentLayers = attributes?.['background-layers-hover'] || [];
				const updatedLayers = applyBackgroundLayerCommand(
					currentLayers,
					value
				);
				const changes = updatedLayers
					? { 'background-layers-hover': updatedLayers }
					: null;
				if (!changes) return null;
				if (value.enableHover === true) {
					changes['block-background-status-hover'] = true;
				}
				if (value.disableHover === true) {
					changes['block-background-status-hover'] = false;
				}
				return changes;
			}
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
		case 'button_background_opacity':
			return buildButtonBackgroundOpacityChanges(value, { isHover: false, isGradient: false });
		case 'button_background_opacity_hover':
			return buildButtonBackgroundOpacityChanges(value, { isHover: true, isGradient: false });
		case 'button_background_gradient_opacity':
			return buildButtonBackgroundOpacityChanges(value, { isHover: false, isGradient: true });
		case 'button_background_gradient_opacity_hover':
			return buildButtonBackgroundOpacityChanges(value, { isHover: true, isGradient: true });
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

const getButtonBGroupSidebarTarget = property => {
	if (!property) return null;
	const normalized = String(property).replace(/-/g, '_');

	if (
		[
			'button_background',
			'button_background_hover',
			'button_background_opacity',
			'button_background_opacity_hover',
			'button_background_gradient_opacity',
			'button_background_gradient_opacity_hover',
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

return {
	buildButtonBGroupAction,
	buildButtonBGroupAttributeChanges,
	getButtonBGroupSidebarTarget,
};
})();

export const {
	buildButtonBGroupAction,
	buildButtonBGroupAttributeChanges,
	getButtonBGroupSidebarTarget,
} = buttonBGroup;

// buttonCGroup
const buttonCGroup = (() => {
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
		/add\s*custom\s*css\s*(?:to|for)\s*(?:the\s*)?button\s*(?:=|:)?\s*([\s\S]+)$/i,
		/add\s*css\s*(?:to|for)\s*(?:the\s*)?button\s*(?:=|:)?\s*([\s\S]+)$/i,
		/(?:custom|button)\s*css\s*(?:to|for|=|:|is)?\s*([\s\S]+)$/i,
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

const buildButtonCGroupAction = (message, { scope = 'selection' } = {}) => {
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

	const sharedStyleAction = buildTextStyleGroupAction(message, {
		scope,
		targetBlock: 'button',
	});
	if (sharedStyleAction) {
		return sharedStyleAction;
	}

	return null;
};

const buildButtonCGroupAttributeChanges = (
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
			return buildTextStyleGroupAttributeChanges(property, value);
	}
};

const getButtonCGroupSidebarTarget = property => {
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

	return getTextStyleGroupSidebarTarget(property);
};

return {
	buildButtonCGroupAction,
	buildButtonCGroupAttributeChanges,
	getButtonCGroupSidebarTarget,
};
})();

export const {
	buildButtonCGroupAction,
	buildButtonCGroupAttributeChanges,
	getButtonCGroupSidebarTarget,
} = buttonCGroup;

// buttonIGroup
const buttonIGroup = (() => {
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

const normalizeBooleanValue = rawValue => {
	if (typeof rawValue === 'string') {
		const normalized = rawValue.trim().toLowerCase();
		if (['false', '0', 'no', 'off', 'disable', 'disabled'].includes(normalized)) {
			return false;
		}
		if (['true', '1', 'yes', 'on', 'enable', 'enabled'].includes(normalized)) {
			return true;
		}
	}
	return Boolean(rawValue);
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

	const normalizedRaw = String(raw).trim().toLowerCase().replace(/^the\s+/, '');
	if (['left', 'right', 'top', 'bottom', 'start', 'end'].includes(normalizedRaw)) {
		return null;
	}

	if (
		/(background|border|padding|spacing|size|width|height|color|stroke|fill|style|type|variant|shape|line|outline|filled)/i.test(
			raw
		)
	) {
		return null;
	}

	const slug = slugifyIconName(raw);
	return slug || null;
};

const extractIconSvgTypeIntent = message => {
	const lower = String(message || '').toLowerCase();
	if (!lower.includes('icon')) return null;
	const hasTypeKeyword = /(svg\s*type|icon\s*type|icon\s*style)/.test(lower);

	if (!hasTypeKeyword && !/\b(outline|line|shape|filled)\b/.test(lower)) return null;

	const hasColorHint =
		/\bpalette\b|#|var\(--|rgb\(|rgba\(|hsl\(|hsla\(|\bcolor\b/.test(lower);
	if (hasColorHint && !hasTypeKeyword) return null;

	const isHover = /\bhover\b/.test(lower);

	if (/\b(line|outline)\b/.test(lower) || (hasTypeKeyword && /\bstroke\b/.test(lower))) {
		return { isHover, value: 'Line' };
	}

	if (/\b(shape|filled)\b/.test(lower) || (hasTypeKeyword && /\bfill\b/.test(lower))) {
		return { isHover, value: 'Shape' };
	}

	return null;
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
	return null;
};

const extractRemoveIconIntent = message => {
	const lower = String(message || '').toLowerCase();
	if (/(remove|hide|clear|disable|turn\s*off|no)\s*(?:the\s*)?icon/.test(lower)) {
		return true;
	}
	if (/\btext\s*only\b/.test(lower)) {
		return true;
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

const extractArrowIconIntent = message => {
	const lower = String(message || '').toLowerCase();
	if (!/arrow/.test(lower)) return null;
	if (/callout/.test(lower)) return null;
	if (/\bright\b/.test(lower)) return 'arrow-right';
	if (/\bleft\b/.test(lower)) return 'arrow-left';
	if (/\b(up|top)\b/.test(lower)) return 'arrow-up';
	if (/\b(down|bottom)\b/.test(lower)) return 'arrow-down';
	return 'arrow-right';
};

const extractIconHoverStatusIntent = message => {
	const lower = String(message || '').toLowerCase();
	if (!lower.includes('icon') || !lower.includes('hover')) return null;
	if (/(enable|show|turn\s*on|activate)/.test(lower)) return true;
	if (/(disable|hide|turn\s*off|deactivate|remove|clear|\bno\b)/.test(lower))
		return false;
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

	const explicitRadius = parseBorderRadius(message);
	const fallbackRadius = extractNumericValue(message, [
		/(\d+(?:\.\d+)?)\s*px\b[^\d]*(?:corner|corners|radius|rounded)/i,
		/(?:corner|corners|radius|rounded)\b[^\d]*(\d+(?:\.\d+)?)/i,
	]);
	const resolvedRadius = Number.isFinite(explicitRadius)
		? explicitRadius
		: fallbackRadius;
	if (Number.isFinite(resolvedRadius)) {
		baseValue.borderRadius = resolvedRadius;
		baseValue.borderRadiusUnit = 'px';
	} else if (/(circle|circular)\b/.test(lower)) {
		baseValue.borderRadius = 50;
		baseValue.borderRadiusUnit = '%';
	} else if (/(pill|capsule)\b/.test(lower)) {
		baseValue.borderRadius = 999;
		baseValue.borderRadiusUnit = 'px';
	} else if (/(square|sharp|no\s*round|no\s*rounded|straight\s*corners)\b/.test(lower)) {
		baseValue.borderRadius = 0;
		baseValue.borderRadiusUnit = 'px';
	} else if (/\brounded\b/.test(lower) || /\bround\b/.test(lower)) {
		baseValue.borderRadius = 8;
		baseValue.borderRadiusUnit = 'px';
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
	if (/(background|bg)/.test(lower)) return null;
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
		/(?:stroke\s*width|line\s*width|stroke\s*thickness)\s*(?:to|=|:|is)?\s*(\d+(?:\.\d+)?)(?:\s*px)?/i,
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
	const { value: rawValue, breakpoint, unit } = normalizeValueWithBreakpoint(value);
	const base = normalizeIconBackgroundValue(rawValue);
	const breakpoints = breakpoint ? [breakpoint] : RESPONSIVE_BREAKPOINTS;
	const changes = {};
	const radiusValue =
		Number.isFinite(Number(base.borderRadius)) ? Number(base.borderRadius) : null;
	const radiusUnit =
		base.borderRadiusUnit || unit || (radiusValue !== null ? 'px' : null);

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

		if (radiusValue !== null) {
			changes[`icon-border-top-left-radius${suffix}`] = radiusValue;
			changes[`icon-border-top-right-radius${suffix}`] = radiusValue;
			changes[`icon-border-bottom-left-radius${suffix}`] = radiusValue;
			changes[`icon-border-bottom-right-radius${suffix}`] = radiusValue;
			changes[`icon-border-sync-radius${suffix}`] = 'all';
			changes[`icon-border-unit-radius${suffix}`] = radiusUnit || 'px';
		}
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
	const boolValue = normalizeBooleanValue(rawValue);
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
	const { value: rawValue } = normalizeValueWithBreakpoint(value);
	if (rawValue === null || rawValue === undefined) return null;

	const normalized = normalizeIconColorValue(rawValue);
	const changes = {};
	const suffix = isHover ? '-hover' : '';
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
const buildButtonIGroupAction = (message, { scope = 'selection' } = {}) => {
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

	const removeIcon = extractRemoveIconIntent(message);
	if (removeIcon) {
		return {
			action: actionType,
			property: 'button_icon',
			value: 'none',
			message: 'Removed icon.',
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

	const svgTypeIntent = extractIconSvgTypeIntent(message);
	if (svgTypeIntent) {
		return {
			action: actionType,
			property: svgTypeIntent.isHover ? 'icon_svg_type_hover' : 'icon_svg_type',
			value: svgTypeIntent.value,
			message: 'Icon type updated.',
			...actionTarget,
		};
	}

	const arrowIcon = extractArrowIconIntent(message);
	if (arrowIcon) {
		return {
			action: actionType,
			property: 'icon_content',
			value: arrowIcon,
			message: 'Icon updated.',
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

	return null;
};

const buildButtonIGroupAttributeChanges = (property, value) => {
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
		case 'icon_svg_type':
			return { svgType: String(value || '') };
		case 'icon_svg_type_hover':
			return { 'svgType-hover': String(value || ''), 'icon-status-hover': true };
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
			return { 'icon-only': normalizeBooleanValue(value) };
		case 'icon_only_hover':
			return {
				'icon-only-hover': normalizeBooleanValue(value),
				'icon-status-hover': true,
			};
		case 'icon_inherit':
			return { 'icon-inherit': normalizeBooleanValue(value) };
		case 'icon_inherit_hover':
			return {
				'icon-inherit-hover': normalizeBooleanValue(value),
				'icon-status-hover': true,
			};
		case 'icon_status_hover':
			return { 'icon-status-hover': normalizeBooleanValue(value) };
		case 'icon_status_hover_target':
			return { 'icon-status-hover-target': normalizeBooleanValue(value) };
		default:
			return null;
	}
};
const getButtonIGroupSidebarTarget = property => {
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
			'icon_svg_type',
			'icon_svg_type_hover',
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

return {
	buildButtonIGroupAction,
	buildButtonIGroupAttributeChanges,
	getButtonIGroupSidebarTarget,
};
})();

export const {
	buildButtonIGroupAction,
	buildButtonIGroupAttributeChanges,
	getButtonIGroupSidebarTarget,
} = buttonIGroup;
