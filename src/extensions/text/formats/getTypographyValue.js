/**
 * Internal dependencies
 */
import { getLastBreakpointAttribute } from '@extensions/styles';
import getCustomFormatValue from './getCustomFormatValue';

/**
 * External dependencies
 */
import { isBoolean, isNumber } from 'lodash';

const getTypographyValue = ({
	disableFormats = false,
	prop,
	breakpoint,
	typography,
	isHover,
	formatValue,
	textLevel,
	blockStyle,
	styleCard,
	styleCardPrefix,
	avoidSC = false,
	prefix = '',
}) => {
	if (disableFormats)
		return getLastBreakpointAttribute({
			target: prop,
			breakpoint,
			attributes: typography,
			isHover,
		});

	const nonHoverValue =
		getCustomFormatValue({
			typography,
			formatValue,
			prop,
			breakpoint,
			textLevel,
			blockStyle,
			styleCard,
			styleCardPrefix,
			avoidXXL: true,
			avoidSC,
		}) ??
		// In cases like HoverEffectControl, where we want the SC 'p' value
		// but requires a clean 'prop' value (no prefix)
		getCustomFormatValue({
			typography,
			formatValue,
			prop: prop.replace(prefix, ''),
			breakpoint,
			textLevel,
			blockStyle,
			styleCard,
			styleCardPrefix,
			avoidXXL: true,
			avoidSC,
		});

	if (!isHover) return nonHoverValue;

	const hoverValue = getCustomFormatValue({
		typography,
		formatValue,
		prop,
		breakpoint,
		isHover,
		textLevel,
		blockStyle,
		styleCard,
		styleCardPrefix,
		avoidXXL: true,
		avoidSC,
	});

	if (hoverValue || isBoolean(hoverValue) || isNumber(hoverValue))
		return hoverValue;

	return nonHoverValue;
};

export default getTypographyValue;
