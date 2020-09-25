/**
 * Internal dependencies
 */
import { getLastBreakpointValue } from '../../styles/utils';
import __experimentalGetFormatClassName from './getCurrentFormatClassName';

const getCustomFormatValue = ({
	typography,
	formatValue,
	prop,
	breakpoint,
}) => {
	const currentClassName = __experimentalGetFormatClassName(
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

	return getLastBreakpointValue(typography, prop, breakpoint);
};

export default getCustomFormatValue;
