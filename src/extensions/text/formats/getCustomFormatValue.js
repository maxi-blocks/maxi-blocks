/**
 * Internal dependencies
 */
import getLastBreakpointAttribute from '../../styles/getLastBreakpointAttribute';
import getCurrentFormatClassName from './getCurrentFormatClassName';
import defaultTypography from '../defaults';
import getCustomFormat from './getCustomFormat';

/**
 * Retrieve the property from typography object requested
 *
 * @param {Object} 	[$0]					Optional named arguments.
 * @param {Object} 	[$0.formatValue]		RichText format value
 * @param {Object} 	[$0.typography]			MaxiBlocks typography
 * @param {Object} 	[$0.prop]				Typography property requested
 * @param {boolean} [$0.breakpoint]			Device type breakpoint
 * @param {boolean} isHover 				Is the requested typography under hover state
 *
 * @returns {*} Requested property
 */
const getCustomFormatValue = ({
	formatValue,
	typography,
	prop,
	breakpoint,
	isHover = false,
	textLevel = 'p',
}) => {
	if (formatValue) {
		const currentClassName = getCurrentFormatClassName(
			formatValue,
			isHover
		);

		if (currentClassName) {
			const customFormat = getCustomFormat(
				typography,
				currentClassName,
				isHover
			);
			if (customFormat) {
				const responsiveValue = getLastBreakpointAttribute(
					prop,
					breakpoint,
					customFormat
				);

				if (responsiveValue) return responsiveValue;
			}
		}
	}

	const value = getLastBreakpointAttribute(
		prop,
		breakpoint,
		typography,
		isHover
	);

	if (value) return value;

	const defaultValue = getLastBreakpointAttribute(
		prop,
		breakpoint,
		defaultTypography[textLevel],
		isHover
	);

	if (defaultValue) return defaultValue;

	return '';
};

export default getCustomFormatValue;
