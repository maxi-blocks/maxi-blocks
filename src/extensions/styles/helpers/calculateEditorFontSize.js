/**
 * Calculates the font size for the editor preview based on clamp values and current breakpoint width.
 *
 * @param {Object} params
 * @param {number|string} params.minSize
 * @param {number|string} params.preferredSize
 * @param {number|string} params.maxSize
 * @param {string} params.minUnit
 * @param {string} params.preferredUnit
 * @param {string} params.maxUnit
 * @param {number} params.viewportWidth
 * @param {number} [params.remToPx=16]
 * @return {string|null} Calculated font size in px or null on validation failure
 */
const calculateEditorFontSize = ({
	minSize,
	preferredSize,
	maxSize,
	minUnit = 'rem',
	preferredUnit = 'vw',
	maxUnit = 'rem',
	viewportWidth,
	remToPx = 16,
}) => {
	if (!viewportWidth) {
		console.warn('calculateEditorFontSize: Missing viewportWidth');
		return null;
	}

	const min = parseFloat(minSize);
	const max = parseFloat(maxSize);
	
	if (!Number.isFinite(min) || !Number.isFinite(max)) {
		console.warn('calculateEditorFontSize: Invalid min or max values', { minSize, maxSize });
		return null;
	}

	let preferred = parseFloat(preferredSize);
	if (!Number.isFinite(preferred)) {
		preferred = min;
	}

	const toPx = (val, unit) => {
		if (unit === 'px') return val;
		if (unit === 'rem' || unit === 'em') return val * remToPx;
		return null;
	};

	const minPx = toPx(min, minUnit);
	const maxPx = toPx(max, maxUnit);

	if (minPx === null || maxPx === null) {
		console.warn('calculateEditorFontSize: Unsupported min/max unit', minUnit, maxUnit); 
		return null;
	}

	if (minPx > maxPx) {
		console.warn(
			'calculateEditorFontSize: minSize > maxSize',
			{ minPx, maxPx, minSize, minUnit, maxSize, maxUnit }
		);
		return null;
	}

	let prefPx = null;
	if (preferredUnit === 'vw') {
		prefPx = (preferred * viewportWidth) / 100;
	} else {
		prefPx = toPx(preferred, preferredUnit);
	}

	if (prefPx === null) {
		console.warn('calculateEditorFontSize: Unsupported preferred unit', preferredUnit);
		return null;
	}

	return `${Math.max(minPx, Math.min(prefPx, maxPx))}px`;
};

export default calculateEditorFontSize;
