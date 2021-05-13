/**
 * Internal dependencies
 */
import getLastBreakpointAttribute from '../../styles/getLastBreakpointAttribute';
import getCurrentFormatClassName from './getCurrentFormatClassName';
import defaultTypography from '../defaults';
import getCustomFormat from './getCustomFormat';
import { getTypographyFromSC } from '../../style-cards';

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
	blockStyle = 'light',
}) => {
	// Custom format value
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

	// General format value
	const value = getLastBreakpointAttribute(
		prop,
		breakpoint,
		typography,
		isHover
	);

	if (value) return value;

	// Style Cards value
	const SCStyle = blockStyle.replace('maxi-', '');
	const currentSC = getTypographyFromSC(textLevel, SCStyle);

	const currentSCValue = getLastBreakpointAttribute(
		`${textLevel}-${prop}`,
		breakpoint,
		currentSC,
		isHover
	);

	if (currentSCValue) return currentSCValue;

	const defaultSC = getTypographyFromSC(textLevel, SCStyle);

	const defaultSCValue = getLastBreakpointAttribute(
		`${textLevel}-${prop}`,
		breakpoint,
		defaultSC,
		isHover
	);

	if (defaultSCValue) return defaultSCValue;

	// Default value
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
