/**
 * WordPress dependencies
 */
import { select } from '@wordpress/data';

/**
 * External dependencies
 */
import { isEmpty, isNil, isNumber } from 'lodash';
import getCustomFormat from './getCustomFormat';
import { getBlockStyle } from '../../styles';
import { getTypographyFromSC } from '../../style-cards';

/**
 * Ensures that custom formats on typography is an object
 */
const cleanCustomFormats = (typography, isHover) => {
	return {
		...(!!typography[`custom-formats${isHover ? '-hover' : ''}`] &&
			typography[`custom-formats${isHover ? '-hover' : ''}`]),
	};
};

/**
 * Merges a cleaned style object comparing with the default typography properties
 *
 * @param {Object} 	typography				MaxiBlocks typography
 * @param {Object} 	value 					Requested values to implement
 * 											on typography object
 * @param {string} 	breakpoint				Device type breakpoint
 * @param {Object}  currentStyle			Current style properties
 *
 * @returns {Object} Cleaned styles properties
 */
export const styleObjectManipulator = ({
	typography,
	value,
	breakpoint,
	currentStyle,
	textLevel,
	isHover = false,
	styleCardPrefix = '',
}) => {
	const style = { ...currentStyle };
	const blockStyle = getBlockStyle();

	const { receiveMaxiActiveStyleCard } = select('maxiBlocks/style-cards');
	const styleCard = receiveMaxiActiveStyleCard().value;

	const sameDefaultLevels = ['p', 'ul', 'ol'];

	const prefix =
		styleCardPrefix || sameDefaultLevels.includes(textLevel)
			? 'p'
			: textLevel;

	const defaultTypography = getTypographyFromSC(
		prefix,
		blockStyle,
		styleCard
	);
	// .styleCard.value.defaultStyleCard[blockStyle];

	const getCurrentValue = target =>
		typography[`${target}-${breakpoint}${isHover ? '-hover' : ''}`];
	const getDefaultValue = target =>
		defaultTypography[`${prefix}-${target}-${breakpoint}`];

	Object.entries(value).forEach(([target, val]) => {
		if (getCurrentValue(target) === val)
			delete style[`${target}-${breakpoint}`];
		else if (
			!isHover &&
			(isNil(getCurrentValue(target)) ||
				(isEmpty(getCurrentValue(target)) &&
					!isNumber(getCurrentValue(target)))) &&
			getDefaultValue(target) === val
		)
			delete style[`${target}-${breakpoint}`];
		else if (isNil(val) || (isEmpty(val) && !isNumber(val)))
			delete style[`${target}-${breakpoint}`];
		else style[`${target}-${breakpoint}`] = val;
	});

	return style;
};

/**
 * Updates the existent custom format
 *
 * @param {Object} 	[$0]						Optional named arguments.
 * @param {Object} 	[$0.typography]				MaxiBlocks typography
 * @param {string} 	[$0.currentClassName]		Maxi Custom format className
 * @param {string} 	[$0.breakpoint]				Device type breakpoint
 * @param {Object}	[$0.value]					Requested values to implement
 * 												on typography object
 * @param {Object} 	[$0.isHover]				Is the requested typography under hover state
 *
 * @returns {Object} Updated Maxi typography object
 */
const updateCustomFormatStyle = ({
	typography,
	currentClassName,
	breakpoint,
	value,
	isHover,
	textLevel,
}) => {
	const newTypography = { ...typography };

	newTypography[`custom-formats${isHover ? '-hover' : ''}`] =
		cleanCustomFormats(newTypography, isHover);

	newTypography[`custom-formats${isHover ? '-hover' : ''}`][
		currentClassName
	] = {
		...styleObjectManipulator({
			typography: newTypography,
			value,
			breakpoint,
			currentStyle: getCustomFormat(
				newTypography,
				currentClassName,
				isHover
			),
			textLevel,
		}),
	};

	const customFormat = getCustomFormat(
		newTypography,
		currentClassName,
		isHover
	);

	if (isEmpty(customFormat))
		delete newTypography[`custom-formats${isHover ? '-hover' : ''}`][
			currentClassName
		];

	return { typography: newTypography };
};

export default updateCustomFormatStyle;
