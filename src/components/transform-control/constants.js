// Per-unit min/max for unit-enabled transform fields. A single range can't fit
// every unit (±5000px is reasonable, ±5000% is not), so each unit gets a range
// scaled to how it behaves. Magnitudes follow AdvancedNumberControl's own
// per-unit defaults (px ~4000, relative units ~999, % 100), made symmetric where
// negative values are allowed.
export const TRANSLATE3D_UNIT_RANGES = Object.freeze({
	px: { min: -5000, max: 5000 },
	em: { min: -999, max: 999 },
	rem: { min: -999, max: 999 },
	vw: { min: -999, max: 999 },
	vh: { min: -999, max: 999 },
	'%': { min: -100, max: 100 },
});

// Perspective is a positive depth, so every unit keeps min 0.
export const PERSPECTIVE_UNIT_RANGES = Object.freeze({
	px: { min: 0, max: 5000 },
	em: { min: 0, max: 999 },
	rem: { min: 0, max: 999 },
	vw: { min: 0, max: 999 },
	vh: { min: 0, max: 999 },
});

export const TRANSFORM_TRANSITION_TYPES = Object.freeze([
	'scale',
	'rotate',
	'translate',
	'origin',
	'skew',
	'perspective',
	'translate3d',
	'scale3d',
	'rotate3d',
]);
