export const NUMBER_COUNTER_ANIMATION_SCALE = 360 / 100;

export const getNumberCounterAnimationValue = value =>
	Number(value) * NUMBER_COUNTER_ANIMATION_SCALE;

export const getNumberCounterValueFromAnimation = value =>
	Number(value) / NUMBER_COUNTER_ANIMATION_SCALE;

/**
 * Returns the number of decimal places in a numeric value.
 * Uses string conversion to avoid floating-point artifacts.
 */
export const getDecimalPlaces = value => {
	const str = String(Number(value));
	const dot = str.indexOf('.');
	return dot === -1 ? 0 : str.length - dot - 1;
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
