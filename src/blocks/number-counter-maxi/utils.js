export const NUMBER_COUNTER_ANIMATION_SCALE = 360 / 100;

export const getNumberCounterAnimationValue = value =>
	Number(value) * NUMBER_COUNTER_ANIMATION_SCALE;

export const getNumberCounterValueFromAnimation = value =>
	Number(value) / NUMBER_COUNTER_ANIMATION_SCALE;

/**
 * Returns the number of decimal places in a numeric value.
 * Handles exponential notation (e.g. 1e-7 → 7) that
 * String(Number()) can produce for very small numbers.
 */
export const getDecimalPlaces = value => {
	const num = Number(value);
	if (!Number.isFinite(num)) return 0;

	const str = String(num);
	const eIdx = str.indexOf('e');

	if (eIdx === -1) {
		const dot = str.indexOf('.');
		return dot === -1 ? 0 : str.length - dot - 1;
	}

	const mantissa = str.slice(0, eIdx);
	const exponent = Number(str.slice(eIdx + 1));
	const dot = mantissa.indexOf('.');
	const mantissaDecimals = dot === -1 ? 0 : mantissa.length - dot - 1;

	return Math.max(0, mantissaDecimals - exponent);
};

/**
 * Formats a number counter value for display, rounding to the given
 * decimal precision so intermediate animation frames stay clean.
 *
 * @param {number} value         The numeric value to display.
 * @param {number} decimalPlaces Max decimal digits to keep (default 0).
 */
const getNumberCounterDisplayValue = (value, decimalPlaces = 0) => {
	const numberValue = Number(value);

	if (!Number.isFinite(numberValue)) return `${value}`;

	const rounded = parseFloat(numberValue.toFixed(decimalPlaces));

	return `${Object.is(rounded, -0) ? 0 : rounded}`;
};

export default getNumberCounterDisplayValue;
