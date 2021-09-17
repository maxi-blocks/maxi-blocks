/**
 * Returns an array with RGBA color parts
 *
 * @param {string} value 			RGBA color
 * @param {boolean} advancedSplit 	In case colors should be split in RGB
 * @returns
 */

const getColorRGBAParts = (value, advancedSplit = false) => {
	const hasVar = value.includes('var(--');

	if (hasVar) {
		const decomposedValue = value.split(',');
		const color = +decomposedValue[0]
			.replace('rgba(var(--maxi-light-color-', '')
			.replace('rgba(var(--maxi-dark-color-', '')
			.replace(')', '');
		const opacity = +decomposedValue[1].replace(')', '');

		return { color, opacity };
	}

	if (advancedSplit) {
		const decomposedValue = value.split(',');
		const r = +decomposedValue[0].replace('rgba(', '');
		const g = +decomposedValue[1];
		const b = +decomposedValue[2].replace(')', '');
		const opacity = +decomposedValue[3].replace(')', '');

		return { r, g, b, opacity };
	}

	const decomposedValue = [
		value.substring(0, value.lastIndexOf(',')),
		value.substring(value.lastIndexOf(',') + 1),
	];

	const color = decomposedValue[0].replace('rgba(', '').replace(')', '');
	const opacity = +decomposedValue[1].replace(')', '');

	return { color, opacity };
};

export default getColorRGBAParts;
