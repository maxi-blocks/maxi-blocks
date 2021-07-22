/**
 * Internal dependencies
 */
import getLastBreakpointAttribute from '../../styles/getLastBreakpointAttribute';
import getCurrentFormatClassName from './getCurrentFormatClassName';
import getCustomFormat from './getCustomFormat';
import { getTypographyFromSC } from '../../style-cards';

/**
 * External dependencies
 */
import { isBoolean, isNumber, isNil } from 'lodash';

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
	styleCard,
	styleCardPrefix,
	avoidXXL = false,
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

				if (
					responsiveValue ||
					isBoolean(responsiveValue) ||
					isNumber(responsiveValue)
				)
					return responsiveValue;
			}
		}
	}

	// General format value
	const value = getLastBreakpointAttribute(
		prop,
		breakpoint,
		typography,
		isHover,
		false,
		avoidXXL
	);

	if (value || isBoolean(value) || isNumber(value)) return value;

	// Style Cards value
	const SCStyle = blockStyle.replace('maxi-', '');
	const SCLevel = styleCardPrefix || textLevel;
	if (!isNil(styleCard)) {
		const currentSC = getTypographyFromSC(styleCard[SCStyle], SCLevel);

		const currentSCValue = getLastBreakpointAttribute(
			prop,
			breakpoint,
			currentSC,
			isHover,
			false,
			avoidXXL
		);

		if (currentSCValue) return currentSCValue;

		const defaultSC = getTypographyFromSC(styleCard[SCStyle], SCLevel);

		const defaultSCValue = getLastBreakpointAttribute(
			prop,
			breakpoint,
			defaultSC,
			isHover,
			false,
			avoidXXL
		);

		if (defaultSCValue) return defaultSCValue;
	}

	return '';
};

export default getCustomFormatValue;
