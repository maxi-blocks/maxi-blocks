import { inRange } from 'lodash';

const getMultiFormatObj = formatValue => {
	const { start, end } = formatValue;
	const formatArray = new Array([...formatValue.formats])[0];

	const response = formatArray.map((formatEl, i) => {
		if (formatEl)
			return formatEl.map(format => {
				if (
					format.type === 'maxi-blocks/text-custom' &&
					i >= start &&
					i < end
				)
					return format.attributes.className;

				return null;
			});

		return [null];
	});

	const obj = {};
	let array = [];
	response.forEach((format, i) => {
		if (!inRange(i, start, end)) return true;

		const prev = response[i - 1] ? response[i - 1][0] : null;
		const next = response[i + 1] ? response[i + 1][0] : null;
		const current = format ? format[0] : null;

		if (current === null && i === start) {
			array.push(i);
			return true;
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

			return true;
		}
		if (prev === current && current === next) return true;
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
			return true;
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
			return true;
		}

		return false;
	});

	return obj;
};

export default getMultiFormatObj;
