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
 * @return {string} Calculated font size in px
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
	if (!viewportWidth) return null;

	const min = parseFloat(minSize);
	const preferred = parseFloat(preferredSize);
	const max = parseFloat(maxSize);

	const minPx = minUnit === 'rem' ? min * remToPx : min;
	const maxPx = maxUnit === 'rem' ? max * remToPx : max;

	let prefPx = preferred;
	if (preferredUnit === 'vw') {
		prefPx = (preferred * viewportWidth) / 100;
	} else if (preferredUnit === 'rem') {
		prefPx = preferred * remToPx;
	}

	return `${Math.max(minPx, Math.min(prefPx, maxPx))}px`;
};

export default calculateEditorFontSize;
