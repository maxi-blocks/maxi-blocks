/**
 * Flow Engine for AI Chat Panel.
 *
 * Single entry point that executes any registered multi-step flow.
 * Block files no longer contain duplicated flow logic — they declare a flowConfig
 * and delegate here. The engine handles step sequencing, asking questions, and
 * building the final attribute map.
 *
 * Usage:
 *   import { runFlow } from '.../ai/flows/flowEngine';
 *   const result = runFlow(flowName, context, flowConfig, prefix, activeBp, blockName);
 *
 * Returns the same shape used everywhere else in the system:
 *   { action: 'ask_options' | 'ask_palette' | 'apply', ... }
 */

import { select } from '@wordpress/data';
import {
	SHADOW_PRESETS,
	SHADOW_PRESETS_BUTTON,
	BUTTON_RADIUS_PRESETS,
	IMAGE_RADIUS_PRESETS,
	DEFAULT_RADIUS_PRESETS,
} from './flowConfig';
import {
	askBorderStyle,
	askPalette,
	askRadius,
	askShadowIntensity,
	askGradientDirection,
	applyStep,
} from './flowSteps';
import {
	buildBorderAttrs,
	buildBorderReset,
	buildBorderRadiusForBp,
	buildBorderHoverAttrs,
	buildBorderHoverReset,
	buildBorderRadiusHoverForBp,
	buildShadowAttrs,
	buildShadowReset,
	buildShadowHoverAttrs,
	buildShadowHoverReset,
	buildHoverBgAttrs,
	buildHoverTextAttrs,
	buildActiveBgAttrs,
	buildIconColorAttrs,
	buildGradientString,
	buildGradientAttrs,
	resolveBreakpoints,
} from './attrBuilders';
import { parseBorderStyle } from '../blocks/utils';

/**
 * Get the currently active breakpoint from the MaxiBlocks store.
 *
 * @returns {string}
 */
const getActiveBp = () =>
	select('maxiBlocks')?.receiveMaxiDeviceType?.() || 'general';

// ─── BORDER ───────────────────────────────────────────────────────────────────

/**
 * Execute a border flow step.
 *
 * @param {Object} flowCfg  - the flow config object for 'border' or 'border_text'
 * @param {Object} context  - accumulated conversation context
 * @param {string} prefix
 * @param {string} activeBp
 * @returns {Object}        - conversation step or apply result
 */
const runBorderFlow = (flowCfg, context, prefix, activeBp) => {
	const { steps, styleOptions, breakpointStrategy, includeOff } = flowCfg;
	const styleFirst = steps[0] === 'border_style';

	if (styleFirst) {
		// ── text variant: style first (includes Off) ──────────────────────────
		if (!context.border_style) {
			return askBorderStyle(styleOptions);
		}

		if (context.border_style === 'off' || context.border_style === 'none') {
			const bps = resolveBreakpoints(breakpointStrategy, activeBp);
			return applyStep(
				buildBorderReset(prefix, bps),
				'Removed border.',
			);
		}

		if (!context.border_color) {
			return askPalette('border_color', 'Which colour for the border?');
		}
	} else {
		// ── default variant: color first ──────────────────────────────────────
		if (!context.border_color) {
			return askPalette('border_color', 'Which colour for the border?');
		}

		if (!context.border_style) {
			return askBorderStyle(styleOptions);
		}
	}

	// ── Apply ─────────────────────────────────────────────────────────────────
	const borderConfig = parseBorderStyle(context.border_style);
	if (!borderConfig) {
		return askBorderStyle(styleOptions);
	}

	const { style, width } = borderConfig;
	const color = context.border_color;
	const bps = resolveBreakpoints(breakpointStrategy, activeBp);

	let changes = buildBorderAttrs(style, width, color, prefix, bps);

	// Apply seeded border_radius if the user said "round border" etc.
	if (context.border_radius !== undefined) {
		const r = context.border_radius;
		bps.forEach(bp => {
			Object.assign(changes, buildBorderRadiusForBp(r, 'px', prefix, bp));
		});
	}

	return applyStep(changes, 'Applied border.');
};

// ─── RADIUS ───────────────────────────────────────────────────────────────────

/**
 * Execute a radius flow step.
 *
 * @param {Object} flowCfg
 * @param {Object} context
 * @param {string} prefix
 * @param {string} blockKey  - used to pick the right preset list
 * @returns {Object}
 */
const runRadiusFlow = (flowCfg, context, prefix, blockKey) => {
	const { breakpointStrategy } = flowCfg;

	// Pick the correct preset list for this block type.
	let presets = DEFAULT_RADIUS_PRESETS;
	if (blockKey === 'button') presets = BUTTON_RADIUS_PRESETS;
	if (blockKey === 'image')  presets = IMAGE_RADIUS_PRESETS;
	if (flowCfg.radiusPresets) presets = flowCfg.radiusPresets;

	if (context.radius_value === undefined) {
		return askRadius(presets);
	}

	const rawRadius = context.radius_value;
	const isPercent =
		typeof rawRadius === 'string' && rawRadius.trim().endsWith('%');
	const r = isPercent ? parseFloat(rawRadius) : rawRadius;
	const unit = isPercent ? '%' : 'px';

	// Circle / 999 special case (button)
	const normalizedR = r === 999 ? 50 : r;
	const normalizedUnit = r === 999 ? '%' : unit;

	const activeBp = getActiveBp();
	const bps = resolveBreakpoints(breakpointStrategy, activeBp);

	const changes = {};
	bps.forEach(bp => {
		Object.assign(changes, buildBorderRadiusForBp(normalizedR, normalizedUnit, prefix, bp));
	});

	// Image: force square crop when using % (circle)
	if (blockKey === 'image' && isPercent) {
		changes.imageRatio = 'ar11';
	}

	const preset = presets.find(p => p.value === rawRadius);
	const label = preset ? preset.label : `${normalizedR}${normalizedUnit}`;

	return applyStep(changes, `Applied ${label} corners.`);
};

// ─── SHADOW ───────────────────────────────────────────────────────────────────

/**
 * Execute a shadow flow step.
 *
 * @param {Object} flowCfg
 * @param {Object} context
 * @param {string} prefix
 * @param {string} activeBp
 * @param {string} blockKey
 * @returns {Object}
 */
const runShadowFlow = (flowCfg, context, prefix, activeBp, blockKey) => {
	const { steps, breakpointStrategy, includeOff } = flowCfg;
	const intensityFirst = steps[0] === 'shadow_intensity';

	// Pick the right preset map.
	// Use element-specific presets only when targeting the element itself, not the
	// canvas wrapper. Button canvas shadows should use standard (wider) presets.
	const useElementPresets = blockKey === 'button' && !context.canvasOverride;
	const presets = useElementPresets
		? SHADOW_PRESETS_BUTTON
		: (flowCfg.shadowPresets || SHADOW_PRESETS);

	if (intensityFirst) {
		// ── text variant: intensity first (includes Off) ──────────────────────
		if (!context.shadow_intensity) {
			return askShadowIntensity(includeOff !== false);
		}

		if (context.shadow_intensity === 'off') {
			const bps = resolveBreakpoints(breakpointStrategy, activeBp);
			return applyStep(
				buildShadowReset(prefix, bps),
				'Removed shadow.',
			);
		}

		if (!context.shadow_color) {
			return askPalette('shadow_color', 'Which colour for the shadow?');
		}
	} else {
		// ── default variant: color first ──────────────────────────────────────
		if (!context.shadow_color) {
			return askPalette('shadow_color', 'Which colour for the shadow?');
		}

		if (!context.shadow_intensity) {
			return askShadowIntensity(includeOff === true);
		}
	}

	// ── Apply ─────────────────────────────────────────────────────────────────
	const color = context.shadow_color;
	const intensity = context.shadow_intensity;
	const preset = presets[intensity] || { x: 0, y: 4, blur: 10, spread: 0 };
	const { x, y, blur, spread } = preset;

	const bps = resolveBreakpoints(breakpointStrategy, activeBp);
	const changes = buildShadowAttrs(x, y, blur, spread, color, prefix, bps);

	const label = intensity.charAt(0).toUpperCase() + intensity.slice(1);
	return applyStep(changes, `Applied ${label} shadow.`);
};

// ─── HOVER BORDER / RADIUS / SHADOW ──────────────────────────────────────────

/**
 * Execute a hover border flow step.
 * Identical conversation path to runBorderFlow but writes `-hover` attribute keys.
 *
 * @param {Object} flowCfg
 * @param {Object} context
 * @param {string} prefix
 * @param {string} activeBp
 * @returns {Object}
 */
const runBorderHoverFlow = (flowCfg, context, prefix, activeBp) => {
	const { steps, styleOptions, breakpointStrategy } = flowCfg;
	const styleFirst = steps[0] === 'border_style';

	if (styleFirst) {
		if (!context.border_style) {
			return askBorderStyle(styleOptions);
		}
		if (context.border_style === 'off' || context.border_style === 'none') {
			const bps = resolveBreakpoints(breakpointStrategy, activeBp);
			return applyStep(buildBorderHoverReset(prefix, bps), 'Removed hover border.');
		}
		if (!context.border_color) {
			return askPalette('border_color', 'Which colour for the hover border?');
		}
	} else {
		if (!context.border_color) {
			return askPalette('border_color', 'Which colour for the hover border?');
		}
		if (!context.border_style) {
			return askBorderStyle(styleOptions);
		}
	}

	const borderConfig = parseBorderStyle(context.border_style);
	if (!borderConfig) {
		return askBorderStyle(styleOptions);
	}

	const { style, width } = borderConfig;
	const color = context.border_color;
	const bps = resolveBreakpoints(breakpointStrategy, activeBp);
	let changes = buildBorderHoverAttrs(style, width, color, prefix, bps);

	if (context.border_radius !== undefined) {
		const r = context.border_radius;
		bps.forEach(bp => {
			Object.assign(changes, buildBorderRadiusHoverForBp(r, 'px', prefix, bp));
		});
	}

	return applyStep(changes, 'Applied hover border.');
};

/**
 * Execute a hover radius flow step.
 * Same preset logic as runRadiusFlow but writes `-hover` attribute keys.
 *
 * @param {Object} flowCfg
 * @param {Object} context
 * @param {string} prefix
 * @param {string} blockKey
 * @returns {Object}
 */
const runRadiusHoverFlow = (flowCfg, context, prefix, blockKey) => {
	const { breakpointStrategy } = flowCfg;

	let presets = DEFAULT_RADIUS_PRESETS;
	if (blockKey === 'button') presets = BUTTON_RADIUS_PRESETS;
	if (blockKey === 'image')  presets = IMAGE_RADIUS_PRESETS;
	if (flowCfg.radiusPresets) presets = flowCfg.radiusPresets;

	if (context.radius_value === undefined) {
		return askRadius(presets);
	}

	const rawRadius = context.radius_value;
	const isPercent =
		typeof rawRadius === 'string' && rawRadius.trim().endsWith('%');
	const r = isPercent ? parseFloat(rawRadius) : rawRadius;
	const unit = isPercent ? '%' : 'px';
	const normalizedR = r === 999 ? 50 : r;
	const normalizedUnit = r === 999 ? '%' : unit;

	const activeBp = getActiveBp();
	const bps = resolveBreakpoints(breakpointStrategy, activeBp);

	const changes = {};
	bps.forEach(bp => {
		Object.assign(changes, buildBorderRadiusHoverForBp(normalizedR, normalizedUnit, prefix, bp));
	});

	if (blockKey === 'image' && isPercent) {
		changes.imageRatio = 'ar11';
	}

	const preset = presets.find(p => p.value === rawRadius);
	const label = preset ? preset.label : `${normalizedR}${normalizedUnit}`;

	return applyStep(changes, `Applied hover ${label} corners.`);
};

/**
 * Execute a hover shadow flow step.
 * Same conversation path as runShadowFlow but writes `-hover` attribute keys.
 *
 * @param {Object} flowCfg
 * @param {Object} context
 * @param {string} prefix
 * @param {string} activeBp
 * @param {string} blockKey
 * @returns {Object}
 */
const runShadowHoverFlow = (flowCfg, context, prefix, activeBp, blockKey) => {
	const { steps, breakpointStrategy, includeOff } = flowCfg;
	const intensityFirst = steps[0] === 'shadow_intensity';

	const useElementPresets = blockKey === 'button' && !context.canvasOverride;
	const presets = useElementPresets
		? SHADOW_PRESETS_BUTTON
		: (flowCfg.shadowPresets || SHADOW_PRESETS);

	if (intensityFirst) {
		if (!context.shadow_intensity) {
			return askShadowIntensity(includeOff !== false);
		}
		if (context.shadow_intensity === 'off') {
			const bps = resolveBreakpoints(breakpointStrategy, activeBp);
			return applyStep(buildShadowHoverReset(prefix, bps), 'Removed hover shadow.');
		}
		if (!context.shadow_color) {
			return askPalette('shadow_color', 'Which colour for the hover shadow?');
		}
	} else {
		if (!context.shadow_color) {
			return askPalette('shadow_color', 'Which colour for the hover shadow?');
		}
		if (!context.shadow_intensity) {
			return askShadowIntensity(includeOff === true);
		}
	}

	const color = context.shadow_color;
	const intensity = context.shadow_intensity;
	const preset = presets[intensity] || { x: 0, y: 4, blur: 10, spread: 0 };
	const { x, y, blur, spread } = preset;

	const bps = resolveBreakpoints(breakpointStrategy, activeBp);
	const changes = buildShadowHoverAttrs(x, y, blur, spread, color, prefix, bps);

	const label = intensity.charAt(0).toUpperCase() + intensity.slice(1);
	return applyStep(changes, `Applied hover ${label} shadow.`);
};

// ─── HOVER / ACTIVE STATES ────────────────────────────────────────────────────

const runHoverBgFlow = (context, prefix) => {
	if (context.button_hover_bg === undefined) {
		return askPalette('button_hover_bg', 'Which colour for the hover background?');
	}
	return applyStep(
		buildHoverBgAttrs(context.button_hover_bg, prefix),
		'Updated hover background.',
	);
};

const runHoverTextFlow = (context) => {
	if (context.button_hover_text === undefined) {
		return askPalette('button_hover_text', 'Which colour for the hover text?');
	}
	return applyStep(
		buildHoverTextAttrs(context.button_hover_text),
		'Updated hover text colour.',
	);
};

const runActiveBgFlow = (context, prefix) => {
	if (context.button_active_bg === undefined) {
		return askPalette('button_active_bg', 'Which colour for the active background?');
	}
	return applyStep(
		buildActiveBgAttrs(context.button_active_bg, prefix),
		'Updated active background.',
	);
};

const runIconColorFlow = (context) => {
	if (context.icon_color === undefined) {
		return askPalette('icon_color', 'Which colour for the button icon?');
	}
	const changes = buildIconColorAttrs(context.icon_color);
	return changes
		? applyStep(changes, 'Updated icon colour.')
		: null;
};

// ─── GRADIENT BACKGROUND ──────────────────────────────────────────────────────

/**
 * Run the gradient background flow (normal state or hover state).
 *
 * Steps: start colour → end colour → direction (angle).
 * Builds a `linear-gradient(angle, palette-colour-1, palette-colour-2)` string
 * and writes the full set of gradient background attributes to the block.
 *
 * @param {Object} flowCfg  - flow config entry
 * @param {Object} context  - accumulated conversation context
 * @param {string} prefix   - block attribute prefix (e.g. 'button-')
 * @param {boolean} isHover - true when writing hover-state attributes
 * @returns {Object} conversation step
 */
const runGradientFlow = (flowCfg, context, prefix, isHover = false) => {
	const { breakpointStrategy } = flowCfg;

	if (context.gradient_color1 === undefined) {
		return askPalette('gradient_color1', 'Which colour should the gradient start with?');
	}
	if (context.gradient_color2 === undefined) {
		return askPalette('gradient_color2', 'Which colour should the gradient end with?');
	}
	if (context.gradient_direction === undefined) {
		return askGradientDirection();
	}

	const angle = Number.isFinite(Number(context.gradient_direction))
		? Number(context.gradient_direction)
		: 90;

	const gradientString = buildGradientString(
		context.gradient_color1,
		context.gradient_color2,
		angle,
	);

	const bps = resolveBreakpoints(breakpointStrategy, 'general');
	const changes = buildGradientAttrs(gradientString, prefix, bps, isHover);

	const stateLabel = isHover ? ' hover' : '';
	return applyStep(changes, `Applied${stateLabel} gradient background.`);
};

// ─── PUBLIC ENTRY POINT ───────────────────────────────────────────────────────

/**
 * Execute a named flow for a block.
 *
 * @param {string} flowName   - one of: 'border', 'border_text', 'radius', 'shadow',
 *                              'shadow_text', 'border_hover', 'radius_hover', 'shadow_hover',
 *                              'hover_bg', 'hover_text', 'active_bg', 'icon_color',
 *                              'gradient', 'gradient_hover'
 * @param {Object} context    - accumulated conversation context data
 * @param {Object} flowConfig - the block's flow configuration (see flowConfig.js)
 * @param {string} prefix     - block attribute prefix (e.g. 'button-')
 * @param {string} [activeBp] - active breakpoint (defaults to MaxiBlocks store value)
 * @param {string} [blockKey] - block key string for preset selection ('button', 'image', etc.)
 * @returns {Object|null}     - conversation step or null if flow not found
 */
export const runFlow = (flowName, context, flowConfig, prefix, activeBp, blockKey) => {
	const bp = activeBp || getActiveBp();

	// Hover flow variants share configs with their non-hover counterparts.
	// Map hover flow names to the base config key for lookup, then dispatch to the hover runner.
	const HOVER_FLOW_BASE_MAP = {
		border_hover:       'border',
		flow_border_hover:  'border',
		radius_hover:       'radius',
		flow_radius_hover:  'radius',
		shadow_hover:       'shadow',
		flow_shadow_hover:  'shadow',
		gradient_hover:     'gradient_hover',
		flow_gradient_hover: 'gradient_hover',
	};

	const baseConfigKey = HOVER_FLOW_BASE_MAP[flowName];
	const cfg = flowConfig?.[baseConfigKey] || flowConfig?.[flowName];

	if (!cfg) {
		console.log(`[Maxi AI flowEngine] Unknown flow: "${flowName}" for block "${blockKey}"`);
		return null;
	}

	switch (flowName) {
		case 'border':
		case 'border_text':
		case 'flow_border':
		case 'flow_outline':
			return runBorderFlow(cfg, context, prefix, bp);

		case 'border_hover':
		case 'flow_border_hover':
			return runBorderHoverFlow(cfg, context, prefix, bp);

		case 'radius':
		case 'flow_radius':
			return runRadiusFlow(cfg, context, prefix, blockKey);

		case 'radius_hover':
		case 'flow_radius_hover':
			return runRadiusHoverFlow(cfg, context, prefix, blockKey);

		case 'shadow':
		case 'shadow_text':
		case 'flow_shadow':
			return runShadowFlow(cfg, context, prefix, bp, blockKey);

		case 'shadow_hover':
		case 'flow_shadow_hover':
			return runShadowHoverFlow(cfg, context, prefix, bp, blockKey);

		case 'hover_bg':
		case 'flow_button_hover_bg':
			return runHoverBgFlow(context, prefix);

		case 'hover_text':
		case 'flow_button_hover_text':
			return runHoverTextFlow(context);

		case 'active_bg':
		case 'flow_button_active_bg':
			return runActiveBgFlow(context, prefix);

		case 'icon_color':
		case 'flow_button_icon_color':
			return runIconColorFlow(context);

		case 'gradient':
		case 'flow_gradient':
			return runGradientFlow(cfg, context, prefix, false);

		case 'gradient_hover':
		case 'flow_gradient_hover':
			return runGradientFlow(cfg, context, prefix, true);

		default:
			return null;
	}
};
