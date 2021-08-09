/**
 * Internal dependencies
 */
import getFormatType from './getFormatType';

/**
 * External dependencies
 */
import { isEmpty } from 'lodash';

const getHasCustomFormat = (formatValue, isHover = false) => {
	if (isEmpty(formatValue) || isEmpty(formatValue.formats)) return false;

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
