/**
 * Pure attribute-map builders for AI Chat Panel flows.
 *
 * All functions return a plain object `{ [attrKey]: value }` ready to be
 * dispatched to the block editor via updateBlockAttributes.
 * None of them modify state — they are pure data transformers.
 */

import { ALL_BREAKPOINTS } from './flowConfig';

// ─── Border ───────────────────────────────────────────────────────────────────

/**
 * Build border attribute changes for a single breakpoint.
 *
 * @param {string} style      - CSS border-style value (e.g. 'solid')
 * @param {number} width      - width in px
 * @param {number|string} color - palette index (number) or hex/named color string
 * @param {string} prefix     - block attribute prefix (e.g. 'button-')
 * @param {string} bp         - breakpoint key (e.g. 'general', 'm')
 * @returns {Object}
 */
export const buildBorderAttrsForBp = (style, width, color, prefix, bp) => {
	const isPalette = typeof color === 'number';
	const changes = {
		[`${prefix}border-style-${bp}`]: style,
		[`${prefix}border-top-width-${bp}`]: width,
		[`${prefix}border-bottom-width-${bp}`]: width,
		[`${prefix}border-left-width-${bp}`]: width,
		[`${prefix}border-right-width-${bp}`]: width,
		[`${prefix}border-sync-width-${bp}`]: 'all',
		[`${prefix}border-unit-width-${bp}`]: 'px',
	};

	if (isPalette) {
		changes[`${prefix}border-palette-status-${bp}`] = true;
		changes[`${prefix}border-palette-color-${bp}`] = color;
		changes[`${prefix}border-color-${bp}`] = '';
	} else {
		changes[`${prefix}border-color-${bp}`] = color;
		changes[`${prefix}border-palette-status-${bp}`] = false;
		changes[`${prefix}border-palette-color-${bp}`] = '';
	}

	return changes;
};

/**
 * Build border attribute changes across a set of breakpoints.
 *
 * @param {string} style
 * @param {number} width
 * @param {number|string} color
 * @param {string} prefix
 * @param {string[]} breakpoints - list of breakpoint keys to write
 * @returns {Object}
 */
export const buildBorderAttrs = (style, width, color, prefix, breakpoints) => {
	const changes = {};
	breakpoints.forEach(bp => {
		Object.assign(changes, buildBorderAttrsForBp(style, width, color, prefix, bp));
	});
	return changes;
};

/**
 * Build border reset (remove) changes for a single breakpoint.
 *
 * @param {string} prefix
 * @param {string} bp
 * @returns {Object}
 */
export const buildBorderResetForBp = (prefix, bp) => ({
	[`${prefix}border-style-${bp}`]: 'none',
	[`${prefix}border-top-width-${bp}`]: 0,
	[`${prefix}border-bottom-width-${bp}`]: 0,
	[`${prefix}border-left-width-${bp}`]: 0,
	[`${prefix}border-right-width-${bp}`]: 0,
	[`${prefix}border-sync-width-${bp}`]: 'all',
	[`${prefix}border-unit-width-${bp}`]: 'px',
	[`${prefix}border-palette-status-${bp}`]: false,
	[`${prefix}border-palette-color-${bp}`]: '',
	[`${prefix}border-color-${bp}`]: '',
});

/**
 * Build border reset changes across a set of breakpoints.
 *
 * @param {string} prefix
 * @param {string[]} breakpoints
 * @returns {Object}
 */
export const buildBorderReset = (prefix, breakpoints) => {
	const changes = {};
	breakpoints.forEach(bp => {
		Object.assign(changes, buildBorderResetForBp(prefix, bp));
	});
	return changes;
};

// ─── Border radius ────────────────────────────────────────────────────────────

/**
 * Build border-radius attribute changes for a single breakpoint.
 *
 * @param {number|string} value   - numeric px value, or numeric% (pass as number with unit param)
 * @param {string} unit           - 'px' or '%'
 * @param {string} prefix
 * @param {string} bp
 * @returns {Object}
 */
export const buildBorderRadiusForBp = (value, unit, prefix, bp) => ({
	[`${prefix}border-top-left-radius-${bp}`]: value,
	[`${prefix}border-top-right-radius-${bp}`]: value,
	[`${prefix}border-bottom-right-radius-${bp}`]: value,
	[`${prefix}border-bottom-left-radius-${bp}`]: value,
	[`${prefix}border-sync-radius-${bp}`]: 'all',
	[`${prefix}border-unit-radius-${bp}`]: unit,
});

/**
 * Build border-radius attribute changes across a set of breakpoints.
 *
 * @param {number|string} value
 * @param {string} unit
 * @param {string} prefix
 * @param {string[]} breakpoints
 * @returns {Object}
 */
export const buildBorderRadiusAttrs = (value, unit, prefix, breakpoints) => {
	const changes = {};
	breakpoints.forEach(bp => {
		Object.assign(changes, buildBorderRadiusForBp(value, unit, prefix, bp));
	});
	return changes;
};

// ─── Box shadow ───────────────────────────────────────────────────────────────

/**
 * Build box-shadow attribute changes for a single breakpoint.
 *
 * @param {number} x
 * @param {number} y
 * @param {number} blur
 * @param {number} spread
 * @param {number|string} color  - palette index or hex string
 * @param {string} prefix
 * @param {string} bp
 * @returns {Object}
 */
export const buildShadowAttrsForBp = (x, y, blur, spread, color, prefix, bp) => {
	const isPalette = typeof color === 'number';
	const changes = {
		[`${prefix}box-shadow-status-${bp}`]: true,
		[`${prefix}box-shadow-horizontal-${bp}`]: x,
		[`${prefix}box-shadow-vertical-${bp}`]: y,
		[`${prefix}box-shadow-blur-${bp}`]: blur,
		[`${prefix}box-shadow-spread-${bp}`]: spread,
		[`${prefix}box-shadow-inset-${bp}`]: false,
		[`${prefix}box-shadow-horizontal-unit-${bp}`]: 'px',
		[`${prefix}box-shadow-vertical-unit-${bp}`]: 'px',
		[`${prefix}box-shadow-blur-unit-${bp}`]: 'px',
		[`${prefix}box-shadow-spread-unit-${bp}`]: 'px',
	};

	if (isPalette) {
		changes[`${prefix}box-shadow-palette-status-${bp}`] = true;
		changes[`${prefix}box-shadow-palette-color-${bp}`] = color;
		changes[`${prefix}box-shadow-color-${bp}`] = '';
	} else {
		changes[`${prefix}box-shadow-color-${bp}`] = color;
		changes[`${prefix}box-shadow-palette-status-${bp}`] = false;
		changes[`${prefix}box-shadow-palette-color-${bp}`] = '';
	}

	return changes;
};

/**
 * Build box-shadow attribute changes across a set of breakpoints.
 *
 * @param {number} x
 * @param {number} y
 * @param {number} blur
 * @param {number} spread
 * @param {number|string} color
 * @param {string} prefix
 * @param {string[]} breakpoints
 * @returns {Object}
 */
export const buildShadowAttrs = (x, y, blur, spread, color, prefix, breakpoints) => {
	const changes = {};
	breakpoints.forEach(bp => {
		Object.assign(changes, buildShadowAttrsForBp(x, y, blur, spread, color, prefix, bp));
	});
	return changes;
};

/**
 * Build box-shadow reset changes.
 *
 * @param {string} prefix
 * @param {string[]} breakpoints
 * @returns {Object}
 */
export const buildShadowReset = (prefix, breakpoints) => {
	const changes = {};
	breakpoints.forEach(bp => {
		changes[`${prefix}box-shadow-status-${bp}`] = false;
		changes[`${prefix}box-shadow-horizontal-${bp}`] = 0;
		changes[`${prefix}box-shadow-vertical-${bp}`] = 0;
		changes[`${prefix}box-shadow-blur-${bp}`] = 0;
		changes[`${prefix}box-shadow-spread-${bp}`] = 0;
		changes[`${prefix}box-shadow-inset-${bp}`] = false;
		changes[`${prefix}box-shadow-palette-status-${bp}`] = false;
		changes[`${prefix}box-shadow-palette-color-${bp}`] = '';
		changes[`${prefix}box-shadow-color-${bp}`] = '';
	});
	return changes;
};

// ─── Hover border ─────────────────────────────────────────────────────────────

/**
 * Build hover border attribute changes for a single breakpoint.
 * Writes keys like `${prefix}border-style-${bp}-hover`.
 *
 * @param {string} style
 * @param {number} width
 * @param {number|string} color
 * @param {string} prefix
 * @param {string} bp
 * @returns {Object}
 */
export const buildBorderHoverAttrsForBp = (style, width, color, prefix, bp) => {
	const isPalette = typeof color === 'number';
	const suffix = `-${bp}-hover`;
	const changes = {
		[`${prefix}border-style${suffix}`]: style,
		[`${prefix}border-top-width${suffix}`]: width,
		[`${prefix}border-bottom-width${suffix}`]: width,
		[`${prefix}border-left-width${suffix}`]: width,
		[`${prefix}border-right-width${suffix}`]: width,
		[`${prefix}border-sync-width${suffix}`]: 'all',
		[`${prefix}border-unit-width${suffix}`]: 'px',
	};

	if (isPalette) {
		changes[`${prefix}border-palette-status${suffix}`] = true;
		changes[`${prefix}border-palette-color${suffix}`] = color;
		changes[`${prefix}border-color${suffix}`] = '';
	} else {
		changes[`${prefix}border-color${suffix}`] = color;
		changes[`${prefix}border-palette-status${suffix}`] = false;
		changes[`${prefix}border-palette-color${suffix}`] = '';
	}

	return changes;
};

/**
 * Build hover border attribute changes across a set of breakpoints.
 * Also sets `border-status-hover: true` to enable the hover state.
 *
 * @param {string} style
 * @param {number} width
 * @param {number|string} color
 * @param {string} prefix
 * @param {string[]} breakpoints
 * @returns {Object}
 */
export const buildBorderHoverAttrs = (style, width, color, prefix, breakpoints) => {
	const changes = { 'border-status-hover': true };
	breakpoints.forEach(bp => {
		Object.assign(changes, buildBorderHoverAttrsForBp(style, width, color, prefix, bp));
	});
	return changes;
};

/**
 * Build hover border reset changes across a set of breakpoints.
 * Sets `border-status-hover: false` and zeroes all hover border keys.
 *
 * @param {string} prefix
 * @param {string[]} breakpoints
 * @returns {Object}
 */
export const buildBorderHoverReset = (prefix, breakpoints) => {
	const changes = { 'border-status-hover': false };
	breakpoints.forEach(bp => {
		const suffix = `-${bp}-hover`;
		changes[`${prefix}border-style${suffix}`] = 'none';
		changes[`${prefix}border-top-width${suffix}`] = 0;
		changes[`${prefix}border-bottom-width${suffix}`] = 0;
		changes[`${prefix}border-left-width${suffix}`] = 0;
		changes[`${prefix}border-right-width${suffix}`] = 0;
		changes[`${prefix}border-sync-width${suffix}`] = 'all';
		changes[`${prefix}border-unit-width${suffix}`] = 'px';
		changes[`${prefix}border-palette-status${suffix}`] = false;
		changes[`${prefix}border-palette-color${suffix}`] = '';
		changes[`${prefix}border-color${suffix}`] = '';
	});
	return changes;
};

// ─── Hover border radius ──────────────────────────────────────────────────────

/**
 * Build hover border-radius attribute changes for a single breakpoint.
 * Writes keys like `${prefix}border-top-left-radius-${bp}-hover`.
 *
 * @param {number|string} value
 * @param {string} unit
 * @param {string} prefix
 * @param {string} bp
 * @returns {Object}
 */
export const buildBorderRadiusHoverForBp = (value, unit, prefix, bp) => {
	const suffix = `-${bp}-hover`;
	return {
		[`${prefix}border-top-left-radius${suffix}`]: value,
		[`${prefix}border-top-right-radius${suffix}`]: value,
		[`${prefix}border-bottom-right-radius${suffix}`]: value,
		[`${prefix}border-bottom-left-radius${suffix}`]: value,
		[`${prefix}border-sync-radius${suffix}`]: 'all',
		[`${prefix}border-unit-radius${suffix}`]: unit,
	};
};

// ─── Hover box shadow ─────────────────────────────────────────────────────────

/**
 * Build hover box-shadow attribute changes for a single breakpoint.
 * Writes keys like `${prefix}box-shadow-blur-${bp}-hover`.
 *
 * @param {number} x
 * @param {number} y
 * @param {number} blur
 * @param {number} spread
 * @param {number|string} color
 * @param {string} prefix
 * @param {string} bp
 * @returns {Object}
 */
export const buildShadowHoverAttrsForBp = (x, y, blur, spread, color, prefix, bp) => {
	const isPalette = typeof color === 'number';
	const suffix = `-${bp}-hover`;
	const changes = {
		[`${prefix}box-shadow-horizontal${suffix}`]: x,
		[`${prefix}box-shadow-vertical${suffix}`]: y,
		[`${prefix}box-shadow-blur${suffix}`]: blur,
		[`${prefix}box-shadow-spread${suffix}`]: spread,
		[`${prefix}box-shadow-inset${suffix}`]: false,
		[`${prefix}box-shadow-horizontal-unit${suffix}`]: 'px',
		[`${prefix}box-shadow-vertical-unit${suffix}`]: 'px',
		[`${prefix}box-shadow-blur-unit${suffix}`]: 'px',
		[`${prefix}box-shadow-spread-unit${suffix}`]: 'px',
	};

	if (isPalette) {
		changes[`${prefix}box-shadow-palette-status${suffix}`] = true;
		changes[`${prefix}box-shadow-palette-color${suffix}`] = color;
		changes[`${prefix}box-shadow-color${suffix}`] = '';
	} else {
		changes[`${prefix}box-shadow-color${suffix}`] = color;
		changes[`${prefix}box-shadow-palette-status${suffix}`] = false;
		changes[`${prefix}box-shadow-palette-color${suffix}`] = '';
	}

	return changes;
};

/**
 * Build hover box-shadow attribute changes across breakpoints.
 * Also sets `box-shadow-status-hover: true`.
 *
 * @param {number} x
 * @param {number} y
 * @param {number} blur
 * @param {number} spread
 * @param {number|string} color
 * @param {string} prefix
 * @param {string[]} breakpoints
 * @returns {Object}
 */
export const buildShadowHoverAttrs = (x, y, blur, spread, color, prefix, breakpoints) => {
	const changes = { 'box-shadow-status-hover': true };
	breakpoints.forEach(bp => {
		Object.assign(changes, buildShadowHoverAttrsForBp(x, y, blur, spread, color, prefix, bp));
	});
	return changes;
};

/**
 * Build hover box-shadow reset changes across breakpoints.
 * Sets `box-shadow-status-hover: false` and zeroes all hover dimension keys.
 *
 * @param {string} prefix
 * @param {string[]} breakpoints
 * @returns {Object}
 */
export const buildShadowHoverReset = (prefix, breakpoints) => {
	const changes = { 'box-shadow-status-hover': false };
	breakpoints.forEach(bp => {
		const suffix = `-${bp}-hover`;
		changes[`${prefix}box-shadow-horizontal${suffix}`] = 0;
		changes[`${prefix}box-shadow-vertical${suffix}`] = 0;
		changes[`${prefix}box-shadow-blur${suffix}`] = 0;
		changes[`${prefix}box-shadow-spread${suffix}`] = 0;
		changes[`${prefix}box-shadow-inset${suffix}`] = false;
		changes[`${prefix}box-shadow-palette-opacity${suffix}`] = 1;
		changes[`${prefix}box-shadow-horizontal-unit${suffix}`] = 'px';
		changes[`${prefix}box-shadow-vertical-unit${suffix}`] = 'px';
		changes[`${prefix}box-shadow-blur-unit${suffix}`] = 'px';
		changes[`${prefix}box-shadow-spread-unit${suffix}`] = 'px';
		changes[`${prefix}box-shadow-palette-status${suffix}`] = false;
		changes[`${prefix}box-shadow-palette-color${suffix}`] = '';
		changes[`${prefix}box-shadow-color${suffix}`] = '';
	});
	return changes;
};

// ─── Gradient background ──────────────────────────────────────────────────────

/**
 * Build a CSS linear-gradient string from two palette colour indices and an angle.
 *
 * Palette colours are referenced via CSS custom properties that Maxi injects on
 * the page — `--maxi-light-color-{n}` holds the RGB triplet so we can wrap it
 * in rgba() to support opacity later.
 *
 * @param {number} color1  - start palette index (1-8)
 * @param {number} color2  - end palette index (1-8)
 * @param {number} angle   - gradient angle in degrees
 * @returns {string}
 */
export const buildGradientString = (color1, color2, angle = 90) => {
	const c1 = `rgba(var(--maxi-light-color-${color1}), 1)`;
	const c2 = `rgba(var(--maxi-light-color-${color2}), 1)`;
	return `linear-gradient(${angle}deg, ${c1}, ${c2})`;
};

/** Default wrapper dimensions shared between normal and hover gradient attrs. */
const GRADIENT_WRAPPER_DEFAULTS = {
	width: 100,
	height: 100,
	unit: '%',
	top: 0,
	right: 0,
	bottom: 0,
	left: 0,
	posUnit: '%',
	sync: 'all',
};

/**
 * Build gradient background attribute changes for a single breakpoint.
 *
 * @param {string} gradientString  - CSS linear-gradient(…) value
 * @param {string} prefix          - block attribute prefix (e.g. 'button-')
 * @param {string} bp              - breakpoint key
 * @param {boolean} isHover        - write hover-suffix attributes
 * @returns {Object}
 */
export const buildGradientAttrsForBp = (gradientString, prefix, bp, isHover = false) => {
	const suffix = `-${bp}${isHover ? '-hover' : ''}`;
	const d = GRADIENT_WRAPPER_DEFAULTS;
	return {
		[`${prefix}background-active-media${suffix}`]: 'gradient',
		[`${prefix}background-gradient${suffix}`]: gradientString,
		[`${prefix}background-gradient-opacity${suffix}`]: 1,
		[`${prefix}background-palette-status${suffix}`]: false,
		// Gradient wrapper sizing so the layer covers the whole element
		[`${prefix}background-gradient-wrapper-width${suffix}`]: d.width,
		[`${prefix}background-gradient-wrapper-width-unit${suffix}`]: d.unit,
		[`${prefix}background-gradient-wrapper-height${suffix}`]: d.height,
		[`${prefix}background-gradient-wrapper-height-unit${suffix}`]: d.unit,
		[`${prefix}background-gradient-wrapper-position-top${suffix}`]: d.top,
		[`${prefix}background-gradient-wrapper-position-top-unit${suffix}`]: d.posUnit,
		[`${prefix}background-gradient-wrapper-position-right${suffix}`]: d.right,
		[`${prefix}background-gradient-wrapper-position-right-unit${suffix}`]: d.posUnit,
		[`${prefix}background-gradient-wrapper-position-bottom${suffix}`]: d.bottom,
		[`${prefix}background-gradient-wrapper-position-bottom-unit${suffix}`]: d.posUnit,
		[`${prefix}background-gradient-wrapper-position-left${suffix}`]: d.left,
		[`${prefix}background-gradient-wrapper-position-left-unit${suffix}`]: d.posUnit,
		[`${prefix}background-gradient-wrapper-position-sync${suffix}`]: d.sync,
		// Clip-path so gradient respects the button shape
		[`${prefix}background-gradient-clip-path${suffix}`]: 'inset(0% 0% 0% 0%)',
		[`${prefix}background-gradient-clip-path-status${suffix}`]: true,
	};
};

/**
 * Build gradient background attribute changes across a set of breakpoints.
 *
 * @param {string} gradientString
 * @param {string} prefix
 * @param {string[]} breakpoints
 * @param {boolean} isHover
 * @returns {Object}
 */
export const buildGradientAttrs = (gradientString, prefix, breakpoints, isHover = false) => {
	const changes = {};
	if (isHover) {
		changes[`${prefix}background-status-hover`] = true;
	}
	breakpoints.forEach(bp => {
		Object.assign(changes, buildGradientAttrsForBp(gradientString, prefix, bp, isHover));
	});
	return changes;
};

// ─── Hover background ─────────────────────────────────────────────────────────

/**
 * Build hover background colour attribute changes.
 *
 * @param {number|string} color  - palette index or hex/named color
 * @param {string} prefix
 * @returns {Object}
 */
export const buildHoverBgAttrs = (color, prefix) => {
	const isPalette = typeof color === 'number';
	return {
		[`${prefix}background-status-hover`]: true,
		[`${prefix}background-active-media-general-hover`]: 'color',
		...(isPalette
			? {
				[`${prefix}background-palette-status-general-hover`]: true,
				[`${prefix}background-palette-color-general-hover`]: color,
				[`${prefix}background-color-general-hover`]: '',
			}
			: {
				[`${prefix}background-palette-status-general-hover`]: false,
				[`${prefix}background-color-general-hover`]: color,
			}
		),
	};
};

// ─── Hover text colour ────────────────────────────────────────────────────────

/**
 * Build hover text colour attribute changes.
 *
 * @param {number|string} color
 * @returns {Object}  (no prefix — text colour keys have no block prefix)
 */
export const buildHoverTextAttrs = (color) => {
	const isPalette = typeof color === 'number';
	return {
		'typography-status-hover': true,
		...(isPalette
			? {
				'palette-status-general-hover': true,
				'palette-color-general-hover': color,
				'color-general-hover': '',
			}
			: {
				'color-general-hover': color,
				'palette-status-general-hover': false,
			}
		),
	};
};

// ─── Active background ────────────────────────────────────────────────────────

/**
 * Build active/click state background colour attribute changes.
 *
 * @param {number|string} color
 * @param {string} prefix
 * @returns {Object}
 */
export const buildActiveBgAttrs = (color, prefix) => {
	const isPalette = typeof color === 'number';
	const activePrefix = `${prefix}active-`;
	return {
		[`${prefix}background-status-active`]: true,
		[`${activePrefix}background-active-media-general`]: 'color',
		...(isPalette
			? {
				[`${activePrefix}background-palette-status-general`]: true,
				[`${activePrefix}background-palette-color-general`]: color,
				[`${activePrefix}background-color-general`]: '',
			}
			: {
				[`${activePrefix}background-palette-status-general`]: false,
				[`${activePrefix}background-color-general`]: color,
			}
		),
	};
};

// ─── Icon colour ──────────────────────────────────────────────────────────────

/**
 * Build icon colour attribute changes (button icon fill/stroke).
 *
 * @param {number|string|Object} colorValue - palette index, hex string, or
 *   {color, target: 'fill'|'stroke'} object
 * @returns {Object|null}
 */
export const buildIconColorAttrs = (colorValue) => {
	if (colorValue === undefined || colorValue === 'use_prompt') return null;

	const color = typeof colorValue === 'object' ? colorValue.color : colorValue;
	const target =
		typeof colorValue === 'object' && colorValue?.target === 'stroke'
			? 'stroke'
			: 'fill';
	const prefixKey = target === 'stroke' ? 'icon-stroke' : 'icon-fill';
	const isPalette = typeof color === 'number';

	if (isPalette) {
		return {
			[`${prefixKey}-palette-status`]: true,
			[`${prefixKey}-palette-color`]: color,
			[`${prefixKey}-color`]: '',
		};
	}

	return {
		[`${prefixKey}-color`]: color,
		[`${prefixKey}-palette-status`]: false,
	};
};

// ─── Resolve breakpoints helper ───────────────────────────────────────────────

/**
 * Resolve the target breakpoints list from a flow config's breakpointStrategy.
 *
 * @param {'active'|'all'|'general'} strategy
 * @param {string} activeBp  - the currently active breakpoint key
 * @returns {string[]}
 */
export const resolveBreakpoints = (strategy, activeBp) => {
	switch (strategy) {
		case 'all':     return ALL_BREAKPOINTS;
		case 'general': return ['general'];
		case 'active':
		default:        return [activeBp];
	}
};

// ─── Re-exports from cssBuilders for canonical single-source access ───────────
// Consumers can import border/shadow utilities from this file instead of
// cssBuilders.js. The underlying implementations remain in cssBuilders.js for
// now so that non-flow callers (useAiChatActions, applyUpdatesToBlocks) are
// not broken by the migration.
export {
	updateBorder,
	updateBorderRadius,
	updateBoxShadow,
	removeBoxShadow,
} from '../utils/cssBuilders';
