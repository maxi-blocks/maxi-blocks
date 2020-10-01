/**
 * Internal dependencies
 */
import { getLastBreakpointValue } from '../../styles/utils';
import getCurrentFormatClassName from './getCurrentFormatClassName';

/**
 * Retrieve the property from typography object requested
 *
 * @param {Object} 	[$0]					Optional named arguments.
 * @param {Object} 	[$0.formatValue]		RichText format value
 * @param {Object} 	[$0.typography]			MaxiBlocks typography
 * @param {Object} 	[$0.prop]				Typography property requested
 * @param {boolean} [$0.breakpoint]			Device type breakpoint
 *
 * @returns {*} Requested property
 */
const getCustomFormatValue = ({
	formatValue,
	typography,
	prop,
	breakpoint,
}) => {
	if (formatValue) {
		const currentClassName = getCurrentFormatClassName(formatValue);

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
