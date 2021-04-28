import { inRange } from 'lodash';

const getIsFullFormat = (formatValue, currentClassName) => {
	const { formats, start, end } = formatValue;

	return !formats.some((formatEl, i) => {
		if (formatEl)
			return formatEl.some(format => {
				return (
					format.type === 'maxi-blocks/text-custom' &&
					format.attributes.className === currentClassName &&
					!inRange(i, start, end)
				);
			});

		return formatEl;
	});
};

export default getIsFullFormat;
