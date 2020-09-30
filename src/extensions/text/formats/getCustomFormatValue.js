/**
 * Internal dependencies
 */
import { getLastBreakpointValue } from '../../styles/utils';
import getFormatClassName from './getCurrentFormatClassName';

const getCustomFormatValue = ({
	typography,
	formatValue,
	prop,
	breakpoint,
}) => {
	if (formatValue) {
		const currentClassName = getFormatClassName(
			formatValue,
			'maxi-blocks/text-custom'
		);

		if (currentClassName) {
			if (typography.customFormats[currentClassName]) {
				const responsiveValue = getLastBreakpointValue(
					typography.customFormats[currentClassName],
					prop,
					breakpoint
				);

				if (responsiveValue) return responsiveValue;
			}
		}
	}

	return getLastBreakpointValue(typography, prop, breakpoint);
};

export default getCustomFormatValue;
