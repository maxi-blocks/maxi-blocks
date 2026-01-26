/**
 * Internal dependencies
 */
import getCurrentFormatClassName from './getCurrentFormatClassName';
import getCustomFormat from './getCustomFormat';
import { getTypographyFromSC } from '@extensions/style-cards';
import getActiveStyleCard from '@extensions/style-cards/getActiveStyleCard';
import { getBlockStyle, getLastBreakpointAttribute } from '@extensions/styles';

/**
 * External dependencies
 */
import { isBoolean, isNumber } from 'lodash';

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
	avoidSC = false,
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
				const responsiveValue = getLastBreakpointAttribute({
					target: prop,
					breakpoint,
					attributes: customFormat,
				});

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
	const value = getLastBreakpointAttribute({
		target: prop,
		breakpoint,
		attributes: typography,
		isHover,
		avoidXXL,
	});

	if (getIsValidValue(value) || avoidSC) return value;

	// Style Cards value
	const SCStyle = ['light', 'dark'].includes(blockStyle)
		? blockStyle
		: getBlockStyle();
	const SCLevel = styleCardPrefix || textLevel;
	const activeEntry = styleCard || getActiveStyleCard();
	const activeStyleCard =
		activeEntry && typeof activeEntry === 'object'
			? activeEntry.value || activeEntry
			: null;

	if (!activeStyleCard || !activeStyleCard[SCStyle]) return null;

	const currentSC = getTypographyFromSC(activeStyleCard[SCStyle], SCLevel);

	const currentSCValue = getLastBreakpointAttribute({
		target: prop,
		breakpoint,
		attributes: currentSC,
		isHover,
		avoidXXL,
	});

	if (getIsValidValue(currentSCValue)) return currentSCValue;

	const defaultSC = getTypographyFromSC(activeStyleCard[SCStyle], SCLevel);

	const defaultSCValue = getLastBreakpointAttribute({
		target: prop,
		breakpoint,
		attributes: defaultSC,
		isHover,
		avoidXXL,
	});

	if (getIsValidValue(defaultSCValue)) return defaultSCValue;

	return null;
};

export default getCustomFormatValue;
