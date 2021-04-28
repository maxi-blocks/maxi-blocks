/**
 * External dependencies
 */
import { inRange, compact, cloneDeep } from 'lodash';

/**
 * Generates an object with the Maxi Custom formats and its different classes
 * and the positions for every one of each
 *
 * @param {Object} formatValue 			RichText format value
 * @param {boolean} isHover 			Is the requested typography under hover state
 *
 * @returns {Object} Classes with its positions
 */
const getMultiFormatObj = (formatValue, isHover = false, withEmptySpaces) => {
	// formatValue has some arrays, like 'formats', that contain 'empty' slots on the array.
	// When cloning by spread operator, we keep that 'empty' slots; cloning with 'cloneDeep'
	// changes that 'empty' for 'null'. Depending the situation, we need one or the other.
	const newFormatValue = withEmptySpaces
		? { ...formatValue }
		: cloneDeep(formatValue);
	const { start, end, formats } = newFormatValue;
	const formatType = !isHover
		? 'maxi-blocks/text-custom'
		: 'maxi-blocks/text-custom-hover';

	const response = formats.map((formatEl, i) => {
		if (formatEl)
			return compact(
				formatEl.map(format => {
					if (format.type === formatType && i >= start && i < end)
						return format.attributes.className;

					return null;
				})
			);

		return formatEl;
	});

	const obj = {};
	let array = [];
	response.forEach((format, i) => {
		if (!inRange(i, start, end)) return;

		const prev = response[i - 1] ? response[i - 1][0] : null;
		const next = response[i + 1] ? response[i + 1][0] : null;
		const current = format ? format[0] : null;

		if (current === null && i === start) {
			array.push(i);
			return;
		}
		if (current === null && i + 1 === end) {
			array.push(i);
			if (array.length === 2) {
				obj[Object.keys(obj).length] = {
					className: current || null,
					start: array[0],
					end: array[1],
				};
				array = [];
			}
		}

		if (array.length === 1 && i + 1 === end) {
			array.push(end);
			obj[Object.keys(obj).length] = {
				className: current || null,
				start: array[0],
				end: array[1],
			};
			array = [];

			return;
		}
		if (prev === current && current === next) return;
		if (prev !== current && !array.includes(i)) {
			array.push(i);
			if (current !== next && array.length !== 2) array.push(i + 1);
			if (array.length === 2) {
				obj[Object.keys(obj).length] = {
					className: current || null,
					start: array[0],
					end: array[1],
				};
				array = [];
			}
			return;
		}
		if (prev === current && current !== next) {
			array.push(i + 1);
			if (array.length === 2) {
				obj[Object.keys(obj).length] = {
					className: current || null,
					start: array[0],
					end: array[1],
				};
				array = [];
			}
		}
	});

	return obj;
};

export default getMultiFormatObj;
