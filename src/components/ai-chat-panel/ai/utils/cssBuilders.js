/**
 * WordPress dependencies
 */
import { select } from '@wordpress/data';

/**
 * Internal dependencies
 */
import {
	parseUnitValue,
	RESPONSIVE_BREAKPOINTS,
	buildResponsiveScaledValues,
	buildResponsiveBooleanChanges,
	buildResponsiveSizeChanges,
	normalizeValueWithBreakpoint,
	getActiveBreakpoint,
	getBaseBreakpoint,
} from './responsiveHelpers';

/**
 * CSS Attribute Builders
 *
 * Pure functions that return MaxiBlocks attribute objects for a given CSS
 * property value. They have no React state dependencies and can be called
 * anywhere — inside or outside a hook.
 */

// ─── Text / Colour ────────────────────────────────────────────────────────────

export const updateTextColor = (color, prefix = '') => {
	const normalizedPrefix = prefix === 'button-' ? '' : prefix;
	const isPalette = typeof color === 'number';
	if (isPalette) {
		return {
			[`${normalizedPrefix}palette-status-general`]: true,
			[`${normalizedPrefix}palette-color-general`]: color,
			[`${normalizedPrefix}color-general`]: '',
		};
	}
	return {
		[`${normalizedPrefix}color-general`]: color,
		[`${normalizedPrefix}palette-status-general`]: false,
	};
};

// ─── Spacing ──────────────────────────────────────────────────────────────────

export const updatePadding = (value, side = null, prefix = '') => {
	const parsed = parseUnitValue(value);
	const sideLower = side ? side.toLowerCase() : null;
	const values = buildResponsiveScaledValues({
		value: parsed.value,
		unit: parsed.unit,
	});
	const changes = {};
	const sides = sideLower && ['top', 'bottom', 'left', 'right'].includes(sideLower)
		? [sideLower]
		: ['top', 'bottom', 'left', 'right'];
	const syncValue = sides.length === 1 ? 'none' : 'all';

	RESPONSIVE_BREAKPOINTS.forEach(bp => {
		const suffix = `-${bp}`;
		sides.forEach(sideKey => {
			changes[`${prefix}padding-${sideKey}${suffix}`] = values[bp];
			changes[`${prefix}padding-${sideKey}-unit${suffix}`] = parsed.unit;
		});
		changes[`${prefix}padding-sync${suffix}`] = syncValue;
	});

	return changes;
};

export const updateMargin = (value, side = null, prefix = '') => {
	const parsed = parseUnitValue(value);
	const sideLower = side ? side.toLowerCase() : null;
	const values = buildResponsiveScaledValues({
		value: parsed.value,
		unit: parsed.unit,
	});
	const changes = {};
	const sides = sideLower && ['top', 'bottom', 'left', 'right'].includes(sideLower)
		? [sideLower]
		: ['top', 'bottom', 'left', 'right'];
	const syncValue = sides.length === 1 ? 'none' : 'all';

	RESPONSIVE_BREAKPOINTS.forEach(bp => {
		const suffix = `-${bp}`;
		sides.forEach(sideKey => {
			changes[`${prefix}margin-${sideKey}${suffix}`] = values[bp];
			changes[`${prefix}margin-${sideKey}-unit${suffix}`] = parsed.unit;
		});
		changes[`${prefix}margin-sync${suffix}`] = syncValue;
	});

	return changes;
};

/**
 * Creates padding/margin attributes across ALL 6 MaxiBlocks breakpoints.
 * @param {string} preset  - 'compact' | 'comfortable' | 'spacious'
 * @param {string} prefix  - Block attribute prefix (e.g. 'container-')
 * @param {string} property - 'padding' or 'margin'
 */
export const createResponsiveSpacing = (preset, prefix = '', property = 'padding') => {
	const presets = {
		compact: { desktop: 60, tablet: 40, mobile: 20 },
		comfortable: { desktop: 100, tablet: 60, mobile: 40 },
		spacious: { desktop: 140, tablet: 80, mobile: 60 },
	};

	const values = presets[preset] || presets.comfortable;
	const { desktop, tablet, mobile } = values;

	return {
		[`${prefix}${property}-top-general`]: desktop,
		[`${prefix}${property}-bottom-general`]: desktop,
		[`${prefix}${property}-left-general`]: 0,
		[`${prefix}${property}-right-general`]: 0,
		[`${prefix}${property}-unit-general`]: 'px',
		[`${prefix}${property}-sync-general`]: 'none',

		[`${prefix}${property}-top-xxl`]: desktop,
		[`${prefix}${property}-bottom-xxl`]: desktop,
		[`${prefix}${property}-left-xxl`]: 0,
		[`${prefix}${property}-right-xxl`]: 0,
		[`${prefix}${property}-unit-xxl`]: 'px',
		[`${prefix}${property}-sync-xxl`]: 'none',

		[`${prefix}${property}-top-xl`]: desktop,
		[`${prefix}${property}-bottom-xl`]: desktop,
		[`${prefix}${property}-left-xl`]: 0,
		[`${prefix}${property}-right-xl`]: 0,
		[`${prefix}${property}-unit-xl`]: 'px',
		[`${prefix}${property}-sync-xl`]: 'none',

		[`${prefix}${property}-top-l`]: desktop,
		[`${prefix}${property}-bottom-l`]: desktop,
		[`${prefix}${property}-left-l`]: 0,
		[`${prefix}${property}-right-l`]: 0,
		[`${prefix}${property}-unit-l`]: 'px',
		[`${prefix}${property}-sync-l`]: 'none',

		[`${prefix}${property}-top-m`]: tablet,
		[`${prefix}${property}-bottom-m`]: tablet,
		[`${prefix}${property}-left-m`]: 0,
		[`${prefix}${property}-right-m`]: 0,
		[`${prefix}${property}-unit-m`]: 'px',
		[`${prefix}${property}-sync-m`]: 'none',

		[`${prefix}${property}-top-s`]: tablet,
		[`${prefix}${property}-bottom-s`]: tablet,
		[`${prefix}${property}-left-s`]: 0,
		[`${prefix}${property}-right-s`]: 0,
		[`${prefix}${property}-unit-s`]: 'px',
		[`${prefix}${property}-sync-s`]: 'none',

		[`${prefix}${property}-top-xs`]: mobile,
		[`${prefix}${property}-bottom-xs`]: mobile,
		[`${prefix}${property}-left-xs`]: 0,
		[`${prefix}${property}-right-xs`]: 0,
		[`${prefix}${property}-unit-xs`]: 'px',
		[`${prefix}${property}-sync-xs`]: 'none',
	};
};

// ─── Border ───────────────────────────────────────────────────────────────────

export const updateBorderRadius = (value, corner = null, prefix = '') => {
	const { value: rawValue, breakpoint } = normalizeValueWithBreakpoint(value);
	let finalValue = (rawValue === undefined || rawValue === null || rawValue === '') ? 8 : Number(rawValue);
	if (isNaN(finalValue)) finalValue = 8;

	const maxiStore = select('maxiBlocks');
	const activeBreakpoint = maxiStore?.receiveMaxiDeviceType?.() || 'general';
	const baseBreakpoint = maxiStore?.receiveBaseBreakpoint?.() || null;
	const breakpoints = breakpoint ? [breakpoint] : [activeBreakpoint];
	if (breakpoint === 'general' && activeBreakpoint !== 'general') {
		breakpoints.push(activeBreakpoint);
	}
	if (breakpoint === 'general' && baseBreakpoint) {
		breakpoints.push(baseBreakpoint);
	} else if (!breakpoint && activeBreakpoint === 'general' && baseBreakpoint) {
		breakpoints.push(baseBreakpoint);
	}
	const uniqueBreakpoints = Array.from(new Set(breakpoints));

	const corners = {
		'top-left': 'border-top-left-radius',
		'top-right': 'border-top-right-radius',
		'bottom-left': 'border-bottom-left-radius',
		'bottom-right': 'border-bottom-right-radius',
	};

	const lowerCorner = corner?.toLowerCase?.() || null;
	const changes = {};
	uniqueBreakpoints.forEach(bp => {
		const suffix = `-${bp}`;
		if (lowerCorner && corners[lowerCorner]) {
			changes[`${prefix}${corners[lowerCorner]}${suffix}`] = finalValue;
			changes[`${prefix}border-sync-radius${suffix}`] = 'none';
			changes[`${prefix}border-unit-radius${suffix}`] = 'px';
		} else {
			changes[`${prefix}border-top-left-radius${suffix}`] = finalValue;
			changes[`${prefix}border-top-right-radius${suffix}`] = finalValue;
			changes[`${prefix}border-bottom-left-radius${suffix}`] = finalValue;
			changes[`${prefix}border-bottom-right-radius${suffix}`] = finalValue;
			changes[`${prefix}border-sync-radius${suffix}`] = 'all';
			changes[`${prefix}border-unit-radius${suffix}`] = 'px';
		}
	});

	console.log('[Maxi AI Debug] updateBorderRadius:', prefix, changes);
	return changes;
};

export const updateBorder = (width, style, color, prefix = '') => {
	const widthStr = String(parseInt(width) || 0);

	if (parseInt(width) === 0 || style === 'none') {
		return {
			[`${prefix}border-style-general`]: 'none',
			[`${prefix}border-top-width-general`]: '0',
			[`${prefix}border-bottom-width-general`]: '0',
			[`${prefix}border-left-width-general`]: '0',
			[`${prefix}border-right-width-general`]: '0',
			[`${prefix}border-sync-width-general`]: 'all',
			[`${prefix}border-palette-status-general`]: false,
			[`${prefix}border-palette-color-general`]: '',
			[`${prefix}border-color-general`]: '',
		};
	}

	const base = {
		[`${prefix}border-style-general`]: style || 'solid',
		[`${prefix}border-top-width-general`]: widthStr,
		[`${prefix}border-bottom-width-general`]: widthStr,
		[`${prefix}border-left-width-general`]: widthStr,
		[`${prefix}border-right-width-general`]: widthStr,
		[`${prefix}border-sync-width-general`]: 'all',
		[`${prefix}border-unit-width-general`]: 'px',
	};

	if (color && typeof color === 'string') {
		if (color.includes('var(--p)')) {
			return { ...base, [`${prefix}border-palette-status-general`]: true, [`${prefix}border-palette-color-general`]: 1 };
		}
		if (color.includes('var(--h1)')) {
			return { ...base, [`${prefix}border-palette-status-general`]: true, [`${prefix}border-palette-color-general`]: 2 };
		}
		if (color.includes('var(--highlight)')) {
			return { ...base, [`${prefix}border-palette-status-general`]: true, [`${prefix}border-palette-color-general`]: 3 };
		}
		const breakpoints = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];
		const widthNum = parseFloat(width) || 2;
		const allAttrs = { ...base };

		breakpoints.forEach(bp => {
			const suffix = bp === 'general' ? '-general' : `-${bp}`;
			allAttrs[`${prefix}border-palette-status${suffix}`] = false;
			allAttrs[`${prefix}border-color${suffix}`] = color;
			allAttrs[`${prefix}border-palette-color${suffix}`] = '';
			allAttrs[`${prefix}border-style${suffix}`] = style || 'solid';
			allAttrs[`${prefix}border-top-width${suffix}`] = widthNum;
			allAttrs[`${prefix}border-bottom-width${suffix}`] = widthNum;
			allAttrs[`${prefix}border-left-width${suffix}`] = widthNum;
			allAttrs[`${prefix}border-right-width${suffix}`] = widthNum;
			allAttrs[`${prefix}border-sync-width${suffix}`] = 'all';
			allAttrs[`${prefix}border-unit-width${suffix}`] = 'px';
		});

		return allAttrs;
	}

	if (typeof color === 'number') {
		const breakpoints = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];
		const widthNum = parseFloat(width) || 2;
		const allAttrs = { ...base };

		breakpoints.forEach(bp => {
			const suffix = bp === 'general' ? '-general' : `-${bp}`;
			allAttrs[`${prefix}border-palette-status${suffix}`] = true;
			allAttrs[`${prefix}border-palette-color${suffix}`] = color;
			allAttrs[`${prefix}border-color${suffix}`] = `var(--maxi-color-${color})`;
			allAttrs[`${prefix}border-style${suffix}`] = style || 'solid';
			allAttrs[`${prefix}border-top-width${suffix}`] = widthNum;
			allAttrs[`${prefix}border-bottom-width${suffix}`] = widthNum;
			allAttrs[`${prefix}border-left-width${suffix}`] = widthNum;
			allAttrs[`${prefix}border-right-width${suffix}`] = widthNum;
			allAttrs[`${prefix}border-sync-width${suffix}`] = 'all';
			allAttrs[`${prefix}border-unit-width${suffix}`] = 'px';
		});

		console.log('[Maxi AI Debug] updateBorder attrs:', prefix, allAttrs);
		return allAttrs;
	}

	return {
		...base,
		[`${prefix}border-color-general`]: color || '#000000',
		[`${prefix}border-palette-status-general`]: false,
	};
};

// ─── Box Shadow ───────────────────────────────────────────────────────────────

export const updateBoxShadow = (x = 0, y = 4, blur = 10, spread = 0, color = null, prefix = '', opacity = null) => {
	const base = {
		[`${prefix}box-shadow-status-general`]: true,
		[`${prefix}box-shadow-horizontal-general`]: x,
		[`${prefix}box-shadow-vertical-general`]: y,
		[`${prefix}box-shadow-blur-general`]: blur,
		[`${prefix}box-shadow-spread-general`]: spread,
		[`${prefix}box-shadow-inset-general`]: false,
		[`${prefix}box-shadow-horizontal-unit-general`]: 'px',
		[`${prefix}box-shadow-vertical-unit-general`]: 'px',
		[`${prefix}box-shadow-blur-unit-general`]: 'px',
		[`${prefix}box-shadow-spread-unit-general`]: 'px',
	};

	if (typeof color === 'number') {
		const breakpoints = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];
		const allAttrs = { ...base };

		breakpoints.forEach(bp => {
			const suffix = bp === 'general' ? '-general' : `-${bp}`;
			allAttrs[`${prefix}box-shadow-palette-status${suffix}`] = true;
			allAttrs[`${prefix}box-shadow-palette-color${suffix}`] = color;
			allAttrs[`${prefix}box-shadow-color${suffix}`] = '';
			allAttrs[`${prefix}box-shadow-horizontal${suffix}`] = x;
			allAttrs[`${prefix}box-shadow-vertical${suffix}`] = y;
			allAttrs[`${prefix}box-shadow-blur${suffix}`] = blur;
			allAttrs[`${prefix}box-shadow-spread${suffix}`] = spread;
			allAttrs[`${prefix}box-shadow-inset${suffix}`] = false;
			allAttrs[`${prefix}box-shadow-horizontal-unit${suffix}`] = 'px';
			allAttrs[`${prefix}box-shadow-vertical-unit${suffix}`] = 'px';
			allAttrs[`${prefix}box-shadow-blur-unit${suffix}`] = 'px';
			allAttrs[`${prefix}box-shadow-spread-unit${suffix}`] = 'px';
			if (opacity !== null) {
				allAttrs[`${prefix}box-shadow-palette-opacity${suffix}`] = opacity;
			}
		});

		console.log('[Maxi AI Debug] updateBoxShadow attrs:', prefix, allAttrs);
		return allAttrs;
	}

	if (color) {
		return {
			...base,
			[`${prefix}box-shadow-palette-status-general`]: false,
			[`${prefix}box-shadow-color-general`]: color,
			[`${prefix}box-shadow-type-general`]: 'outset',
		};
	}

	return {
		...base,
		[`${prefix}box-shadow-palette-status-general`]: true,
		[`${prefix}box-shadow-palette-color-general`]: 8,
		[`${prefix}box-shadow-palette-opacity-general`]: 12,
	};
};

export const removeBoxShadow = (prefix = '') => ({
	[`${prefix}box-shadow-status-general`]: false,
});

// ─── Opacity ──────────────────────────────────────────────────────────────────

export const updateOpacity = value => ({
	'opacity-general': Math.max(0, Math.min(1, Number(value))),
});

// ─── Typography ───────────────────────────────────────────────────────────────

export const updateFontSize = value => ({
	'font-size-general': Number(value),
	'typography-unit-general': 'px',
});

export const updateFontFamily = value => ({
	'font-family-general': value,
});

export const updateFontWeight = value => {
	const weightMap = {
		'thin': '100',
		'extra-light': '200',
		'extralight': '200',
		'light': '300',
		'normal': '400',
		'regular': '400',
		'medium': '500',
		'semi-bold': '600',
		'semibold': '600',
		'bold': '700',
		'extra-bold': '800',
		'extrabold': '800',
		'black': '900',
		'heavy': '900',
	};
	const normalizedValue = String(value).toLowerCase();
	const weight = weightMap[normalizedValue] || String(value);
	return { 'font-weight-general': weight };
};

export const updateLineHeight = (value, unit = '-') => {
	const parsed = parseUnitValue(value, unit);
	const values = buildResponsiveScaledValues({
		value: parsed.value,
		unit: parsed.unit,
		forceScale: true,
		min: 1,
	});
	const changes = {};
	RESPONSIVE_BREAKPOINTS.forEach(bp => {
		changes[`line-height-${bp}`] = values[bp];
		changes[`line-height-unit-${bp}`] = parsed.unit;
	});
	return changes;
};

export const updateLetterSpacing = (value, unit = 'px') => {
	const parsed = parseUnitValue(value, unit);
	const values = buildResponsiveScaledValues({
		value: parsed.value,
		unit: parsed.unit,
	});
	const changes = {};
	RESPONSIVE_BREAKPOINTS.forEach(bp => {
		changes[`letter-spacing-${bp}`] = values[bp];
		changes[`letter-spacing-unit-${bp}`] = parsed.unit;
	});
	return changes;
};

export const updateTextTransform = value => ({
	'text-transform-general': value,
});

export const updateTextAlign = (alignment = 'left') => ({
	'text-alignment-general': alignment,
	'alignment-general': alignment,
	'text-alignment-xxl': '', 'text-alignment-xl': '', 'text-alignment-l': '', 'text-alignment-m': '', 'text-alignment-s': '', 'text-alignment-xs': '',
	'alignment-xxl': '', 'alignment-xl': '', 'alignment-l': '', 'alignment-m': '', 'alignment-s': '', 'alignment-xs': '',
});

// ─── Layout / Flexbox ─────────────────────────────────────────────────────────

export const updateFlexDirection = value => ({
	'flex-direction-general': value,
});

export const updateJustifyContent = value => ({
	'justify-content-general': value,
});

export const updateAlignItems = value => ({
	'align-items-general': value,
});

export const updateAlignContent = value => ({
	'align-content-general': value,
});

export const updateGap = (value, unit = 'px') => {
	const parsed = parseUnitValue(value, unit);
	const values = buildResponsiveScaledValues({
		value: parsed.value,
		unit: parsed.unit,
	});
	const changes = {};
	RESPONSIVE_BREAKPOINTS.forEach(bp => {
		const suffix = `-${bp}`;
		changes[`row-gap${suffix}`] = values[bp];
		changes[`row-gap-unit${suffix}`] = parsed.unit;
		changes[`column-gap${suffix}`] = values[bp];
		changes[`column-gap-unit${suffix}`] = parsed.unit;
	});
	return changes;
};

export const updateFlexGrow = value => ({
	'flex-grow-general': Number(value),
});

export const updateFlexShrink = value => ({
	'flex-shrink-general': Number(value),
});

export const updateDeadCenter = () => ({
	'justify-content-general': 'center',
	'align-items-general': 'center',
});

export const updateItemAlign = (alignment = 'center') => {
	let justify = alignment;
	let align = alignment;

	if (alignment === 'left') {
		justify = 'flex-start';
		align = 'flex-start';
	} else if (alignment === 'right') {
		justify = 'flex-end';
		align = 'flex-end';
	} else if (alignment === 'center') {
		justify = 'center';
		align = 'center';
	}

	return {
		'justify-content-general': justify,
		'align-items-general': align,
		'justify-content-xxl': '', 'justify-content-xl': '', 'justify-content-l': '', 'justify-content-m': '', 'justify-content-s': '', 'justify-content-xs': '',
		'align-items-xxl': '', 'align-items-xl': '', 'align-items-l': '', 'align-items-m': '', 'align-items-s': '', 'align-items-xs': '',
	};
};

// ─── Positioning ──────────────────────────────────────────────────────────────

export const updateStacking = (zIndex, position = 'relative') => ({
	'z-index-general': Number(zIndex),
	'position-general': position,
});

export const updateDisplay = value => {
	let rawValue = value;
	let breakpoint = null;
	if (
		value &&
		typeof value === 'object' &&
		!Array.isArray(value) &&
		Object.prototype.hasOwnProperty.call(value, 'value')
	) {
		rawValue = value.value;
		breakpoint = value.breakpoint || null;
	}

	if (breakpoint) {
		return { [`display-${breakpoint}`]: rawValue };
	}

	return { 'display-general': rawValue };
};

export const updatePosition = value => ({
	'position-general': value,
});

export const updateZIndex = value => ({
	'z-index-general': Number(value),
});

// ─── Visual Effects ───────────────────────────────────────────────────────────

export const updateTransform = (type, x = 0, y = 0, z = 0) => ({
	[`transform-${type}-general`]: { x: Number(x), y: Number(y), z: Number(z) },
});

export const updateClipPath = shape => ({
	'clip-path-general': shape,
	'clip-path-status-general': shape !== 'none',
});

export const addScrollEffect = effect => ({
	[`scroll-${effect}-status-general`]: true,
});

export const updateOverflow = value => ({
	'overflow-general': value,
});

export const updateBlendMode = value => ({
	'mix-blend-mode-general': value,
});

// ─── SVG Icon ─────────────────────────────────────────────────────────────────

export const updateSvgFillColor = (value = 4, isHover = false) => {
	const suffix = isHover ? '-hover' : '';
	const result = {};

	if (typeof value === 'number') {
		result[`svg-fill-palette-color${suffix}`] = value;
		result[`svg-fill-palette-status${suffix}`] = true;
		result[`svg-fill-color${suffix}`] = '';
	} else {
		result[`svg-fill-palette-status${suffix}`] = false;
		result[`svg-fill-color${suffix}`] = value;
	}

	if (isHover) {
		result['svg-status-hover'] = true;
	}
	return result;
};

export const updateSvgLineColor = (value = 7, isHover = false) => {
	const suffix = isHover ? '-hover' : '';
	const result = {};

	if (typeof value === 'number') {
		result[`svg-line-palette-color${suffix}`] = value;
		result[`svg-line-palette-status${suffix}`] = true;
		result[`svg-line-color${suffix}`] = '';
	} else {
		result[`svg-line-palette-status${suffix}`] = false;
		result[`svg-line-color${suffix}`] = value;
	}

	if (isHover) {
		result['svg-status-hover'] = true;
	}
	return result;
};

export const updateSvgStrokeWidth = (width = 2) => ({
	'svg-stroke-general': width,
});

// ─── Image ────────────────────────────────────────────────────────────────────

export const updateImageFit = fit => {
	if (fit === 'cover') {
		return {
			fitParentSize: true,
			imageRatio: 'custom',
		};
	}
	return {
		fitParentSize: false,
		imageRatio: 'original',
	};
};

export const updateAspectRatio = ratio => {
	let val = 1;

	if (String(ratio).includes(':')) {
		const parts = ratio.split(':');
		if (parts.length === 2) {
			val = Number(parts[0]) / Number(parts[1]);
		}
	} else {
		val = Number(ratio) || 1;
	}

	return {
		imageRatio: 'custom',
		imageRatioCustom: String(val),
	};
};

// ─── Shape Dividers ───────────────────────────────────────────────────────────

export const clampNumber = (value, min, max) => {
	const numeric = Number(value);
	if (Number.isNaN(numeric)) return min;
	return Math.min(Math.max(numeric, min), max);
};

export const normalizeShapeDividerStyle = (position, rawStyle) => {
	const base = String(rawStyle || '').trim().toLowerCase();
	if (!base) return '';

	const map = {
		wave: 'wave',
		waves: 'waves',
		curve: 'curve',
		slant: 'slant',
		triangle: 'triangle',
	};
	const mapped = map[base] || base;
	if (mapped.endsWith(`-${position}`)) return mapped;
	return `${mapped}-${position}`;
};

export const buildShapeDividerChanges = (position, rawValue) => {
	if (rawValue === undefined || rawValue === null) return null;

	const normalized = String(rawValue).trim().toLowerCase();
	if (['none', 'off', 'remove'].includes(normalized)) {
		return { [`shape-divider-${position}-status`]: false };
	}

	const valueObj = rawValue && typeof rawValue === 'object' ? rawValue : null;
	const styleInput = valueObj?.style || valueObj?.shape || valueObj?.value || rawValue;
	const style = normalizeShapeDividerStyle(position, styleInput);
	if (!style) return null;

	const changes = {
		[`shape-divider-${position}-status`]: true,
		[`shape-divider-${position}-shape-style`]: style,
	};

	if (valueObj?.color !== undefined) {
		const isPalette = typeof valueObj.color === 'number';
		changes[`shape-divider-${position}-palette-status-general`] = isPalette;
		changes[`shape-divider-${position}-palette-color-general`] = isPalette ? valueObj.color : '';
		changes[`shape-divider-${position}-color-general`] = isPalette ? '' : valueObj.color;
	}

	if (valueObj?.opacity !== undefined) {
		changes[`shape-divider-${position}-opacity-general`] = clampNumber(valueObj.opacity, 0, 1);
	}

	return changes;
};

export const buildShapeDividerColorChanges = (position, colorValue) => {
	if (colorValue === undefined || colorValue === null || colorValue === '') return null;
	const isPalette = typeof colorValue === 'number';
	return {
		[`shape-divider-${position}-palette-status-general`]: isPalette,
		[`shape-divider-${position}-palette-color-general`]: isPalette ? colorValue : '',
		[`shape-divider-${position}-color-general`]: isPalette ? '' : colorValue,
	};
};
