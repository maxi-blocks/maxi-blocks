/**
 * External dependencies
 */
import { isString, isEmpty } from 'lodash';
import tinycolor from 'tinycolor2';

/**
 * Returns an array with RGBA color parts
 *
 * @param {string}  value         RGBA color
 * @param {boolean} advancedSplit In case colors should be split in RGB
 * @returns
 */

const getColorRGBAParts = (value, advancedSplit = false) => {
	if (!isString(value) || isEmpty(value)) return false;

	if (value.includes('var(--')) {
		const decomposedValue = value.split(',');
		const color = +decomposedValue[0]
			.replace('rgba(', '')
			.replace('var(--maxi-light-color-', '')
			.replace('var(--maxi-dark-color-', '')
			.replace(')', '');
		const opacity =
			+decomposedValue[decomposedValue.length - 1]?.replace(')', '') || 1;

		return { color, opacity };
	}

	const sampleColor = tinycolor(value);

	if (!sampleColor.isValid) return false;

	const decomposedColor = sampleColor.toRgb();

	if (advancedSplit) return decomposedColor;

	// Ensures HEX or HUE is transformed to RGBA
	const RGBAColor = sampleColor.toRgbString().replace(/\s/g, '');

	const hasAlpha = RGBAColor.includes('rgba');

	if (hasAlpha) {
		const decomposedValue = [
			RGBAColor.substring(0, RGBAColor.lastIndexOf(',')),
			RGBAColor.substring(RGBAColor.lastIndexOf(',') + 1),
		];

		const color = decomposedValue[0]
			.replace('rgba(', '')
			.replace('rgb(', '')
			.replace(')', '');
		const opacity = +decomposedValue[1].replace(')', '');

		return { color, opacity };
	}

	const color = RGBAColor.replace('rgb(', '').replace(')', '');

	return { color, opacity: 1 };
};

export default getColorRGBAParts;
