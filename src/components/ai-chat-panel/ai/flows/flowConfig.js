/**
 * Shared flow configurations for AI Chat Panel.
 *
 * Each entry in SHARED_FLOWS defines a reusable multi-step interaction flow.
 * Block files import these and spread/override as needed via their own FLOW_CONFIG.
 *
 * Flow config shape:
 * {
 *   steps:               string[]  — ordered list of context keys to collect before applying
 *   breakpointStrategy:  'active' | 'all' | 'general'
 *                         'active'  → write only to the currently active breakpoint
 *                         'all'     → write to all 7 breakpoints (general + responsive overrides)
 *                         'general' → write only to the general breakpoint
 *   includeOff?:         boolean   — add a "None / remove" option as the first style step
 *   presets?:            object    — map of preset name → [x, y, blur, spread] (shadow only)
 *   radiusPresets?:      object[]  — [{label, value}] list (radius only)
 *   defaultWidth?:       number    — default border width in px
 *   stepOrder?:          object    — override ask order; e.g. {style: 0, color: 1} or {intensity: 0, color: 1}
 * }
 */

export const ALL_BREAKPOINTS = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];

export const SHADOW_PRESETS = {
	soft: { x: 0, y: 10, blur: 30, spread: 0 },
	crisp: { x: 0, y: 2, blur: 4, spread: 0 },
	bold: { x: 0, y: 20, blur: 25, spread: -5 },
	glow: { x: 0, y: 0, blur: 15, spread: 2 },
};

export const SHADOW_PRESETS_BUTTON = {
	soft: { x: 0, y: 4, blur: 12, spread: 0 },
	crisp: { x: 0, y: 2, blur: 4, spread: 0 },
	bold: { x: 4, y: 4, blur: 0, spread: 0 },
	glow: { x: 0, y: 0, blur: 15, spread: 2 },
};

export const DEFAULT_RADIUS_PRESETS = [
	{ label: 'Sharp', value: 0 },
	{ label: 'Subtle (8px)', value: 8 },
	{ label: 'Soft (24px)', value: 24 },
	{ label: 'Full (50px)', value: 50 },
];

export const BUTTON_RADIUS_PRESETS = [
	{ label: 'Sharp', value: 0 },
	{ label: 'Soft (5px)', value: 5 },
	{ label: 'Rounded (15px)', value: 15 },
	{ label: 'Pill (50px)', value: 50 },
	{ label: 'Circle', value: 999 },
];

export const IMAGE_RADIUS_PRESETS = [
	{ label: 'Sharp', value: 0 },
	{ label: 'Subtle (8px)', value: 8 },
	{ label: 'Soft (24px)', value: 24 },
	{ label: 'Full (50px)', value: 50 },
	{ label: 'Circle', value: '50%' },
];

export const DEFAULT_BORDER_STYLE_OPTIONS = [
	{ label: 'Solid Thin', value: 'solid-1px' },
	{ label: 'Solid Medium', value: 'solid-2px' },
	{ label: 'Solid Thick', value: 'solid-4px' },
	{ label: 'Dashed', value: 'dashed-2px' },
	{ label: 'Dotted', value: 'dotted-2px' },
];

export const BORDER_STYLE_OPTIONS_WITH_OFF = [
	{ label: 'None (remove border)', value: 'off' },
	...DEFAULT_BORDER_STYLE_OPTIONS,
];

/**
 * Shared flow definitions — all blocks start from these and override as needed.
 */
export const SHARED_FLOWS = {
	/**
	 * Border flow: color first, then style.
	 * breakpointStrategy 'active' writes only to the currently active breakpoint,
	 * which is the correct responsive behavior — on M you get an M-only override.
	 */
	border: {
		steps: ['border_color', 'border_style'],
		defaultWidth: 2,
		breakpointStrategy: 'active',
		includeOff: false,
		styleOptions: DEFAULT_BORDER_STYLE_OPTIONS,
	},

	/**
	 * Border flow variant for text: style first (includes "off"), then color.
	 * breakpointStrategy 'active' writes only to the selected breakpoint.
	 */
	border_text: {
		steps: ['border_style', 'border_color'],
		defaultWidth: 2,
		breakpointStrategy: 'active',
		includeOff: true,
		styleOptions: BORDER_STYLE_OPTIONS_WITH_OFF,
	},

	/**
	 * Radius flow: single question.
	 * Writes to 'general' only — inherits down.
	 */
	radius: {
		steps: ['radius_value'],
		breakpointStrategy: 'general',
		radiusPresets: DEFAULT_RADIUS_PRESETS,
	},

	/**
	 * Shadow flow: color first, then intensity.
	 * Writes to 'general' only.
	 */
	shadow: {
		steps: ['shadow_color', 'shadow_intensity'],
		breakpointStrategy: 'general',
		includeOff: false,
		shadowPresets: SHADOW_PRESETS,
	},

	/**
	 * Shadow flow variant for text: intensity first (includes "off"), then color.
	 * Writes across all breakpoints (text-specific behavior).
	 */
	shadow_text: {
		steps: ['shadow_intensity', 'shadow_color'],
		breakpointStrategy: 'all',
		includeOff: true,
		shadowPresets: SHADOW_PRESETS,
	},

	/** Hover background colour — single palette step. */
	hover_bg: {
		steps: ['button_hover_bg'],
		breakpointStrategy: 'general',
	},

	/** Hover text colour — single palette step. */
	hover_text: {
		steps: ['button_hover_text'],
		breakpointStrategy: 'general',
	},

	/** Active / click background colour — single palette step. */
	active_bg: {
		steps: ['button_active_bg'],
		breakpointStrategy: 'general',
	},

	/** Icon colour flow (button-specific). */
	icon_color: {
		steps: ['icon_color'],
		breakpointStrategy: 'general',
	},
};
