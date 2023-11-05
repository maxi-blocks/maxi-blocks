/**
 * External dependencies
 */
import { isString, round } from 'lodash';

/**
 * Convert aspect ratio to decimal.
 *
 * @param {string} aspectRatio Aspect ratio.
 * @example '16 / 9' => 1.7778
 * @example '1 / 2' => 0.5
 * @example '1 /' => 1
 * @example '16 / 0' => 1
 * @returns {number} Aspect ratio in decimal.
 */
const convertAspectRatioToDecimal = aspectRatio => {
	let result;

	if (!isString(aspectRatio)) {
		result = aspectRatio;
	} else {
		const match = aspectRatio.match(/^(\d+)(?:\/(\d*))?$/);

		if (match) {
			const numerator = +match[1];
			const denominator = match[2] ? +match[2] : 1;

			// Handle divide by zero case by returning 1
			if (denominator === 0) {
				result = 1;
			} else {
				result = numerator / denominator;
			}
		} else {
			result = +aspectRatio;
		}
	}

	return round(result, 4);
};

export default convertAspectRatioToDecimal;
