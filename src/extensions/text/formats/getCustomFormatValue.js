/**
 * Internal dependencies
 */
import getLastBreakpointValue from '../../styles/getLastBreakpointValue';
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
	isHover = false,
}) => {
	if (formatValue) {
		const currentClassName = getCurrentFormatClassName(
			formatValue,
			isHover
		);

		if (currentClassName) {
			if (
				typography[`custom-formats${isHover ? '-hover' : ''}`][
					currentClassName
				]
			) {
				const responsiveValue = getLastBreakpointValue(
					prop,
					breakpoint,
					typography[`custom-formats${isHover ? '-hover' : ''}`][
						currentClassName
					]
				);

				if (responsiveValue) return responsiveValue;
			}
		}
	}

	return getLastBreakpointValue(prop, breakpoint, typography, isHover);
};

export default getCustomFormatValue;
