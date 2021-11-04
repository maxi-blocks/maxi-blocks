/**
 * Internal dependencies
 */
import getLastBreakpointAttribute from '../../styles/getLastBreakpointAttribute';
import getCurrentFormatClassName from './getCurrentFormatClassName';
import getCustomFormat from './getCustomFormat';
import { getTypographyFromSC } from '../../style-cards';
import getActiveStyleCard from '../../style-cards/getActiveStyleCard';

/**
 * External dependencies
 */
import { isBoolean, isNumber } from 'lodash';
import { getBlockStyle } from '../../styles';

/**
 * Returns if is a valid value
 */
const getIsValidValue = val => val || isBoolean(val) || isNumber(val);

/**
 * Retrieve the property from typography object requested
 *
 * @param {Object}  [$0]             Optional named arguments.
 * @param {Object}  [$0.formatValue] RichText format value
 * @param {Object}  [$0.typography]  MaxiBlocks typography
 * @param {Object}  [$0.prop]        Typography property requested
 * @param {boolean} [$0.breakpoint]  Device type breakpoint
 * @param {boolean} isHover          Is the requested typography under hover state
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

	if (getIsValidValue(value)) return value;

	// Style Cards value
	const rawSCStyle = blockStyle ? blockStyle.replace('maxi-', '') : undefined;
	const SCStyle = ['light', 'dark'].includes(rawSCStyle)
		? rawSCStyle
		: getBlockStyle();
	const SCLevel = styleCardPrefix || textLevel;
	const activeStyleCard = styleCard || getActiveStyleCard().value;
	const currentSC = getTypographyFromSC(activeStyleCard[SCStyle], SCLevel);

	const currentSCValue = getLastBreakpointAttribute(
		prop,
		breakpoint,
		currentSC,
		isHover,
		false,
		avoidXXL
	);

	if (getIsValidValue(currentSCValue)) return currentSCValue;

	const defaultSC = getTypographyFromSC(activeStyleCard[SCStyle], SCLevel);

	const defaultSCValue = getLastBreakpointAttribute(
		prop,
		breakpoint,
		defaultSC,
		isHover,
		false,
		avoidXXL
	);

	if (getIsValidValue(defaultSCValue)) return defaultSCValue;

	return null;
};

export default getCustomFormatValue;
