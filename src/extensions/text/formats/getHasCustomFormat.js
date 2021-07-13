/**
 * Internal dependencies
 */
import getFormatType from './getFormatType';

const getHasCustomFormat = (formatValue, isHover = false) => {
	const { formats, start, end } = formatValue;

	return formats.some((formatEl, i) => {
		if (formatEl)
			return formatEl.some(format => {
				return (
					format.type === getFormatType(isHover) &&
					i >= start &&
					i <= end
				);
			});

		return formatEl;
	});
};

export default getHasCustomFormat;
