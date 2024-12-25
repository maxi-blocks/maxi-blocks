/**
 * WordPress dependencies
 */
import { select } from '@wordpress/data';

/**
 * External dependencies
 */
import { isEmpty, isNil, isNumber, isBoolean } from 'lodash';

/**
 * Internal dependencies
 */
import getCustomFormat from './getCustomFormat';
import { getBlockStyle } from '@extensions/styles';
import { getTypographyFromSC } from '@extensions/style-cards';

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
 * @param {Object} typography   MaxiBlocks typography
 * @param {Object} value        Requested values to implement
 *                              on typography object
 * @param {string} breakpoint   Device type breakpoint
 * @param {Object} currentStyle Current style properties
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
	styleCard,
}) => {
	const style = { ...currentStyle };
	const blockStyle = getBlockStyle();

	const { receiveMaxiSelectedStyleCard } = select('maxiBlocks/style-cards');
	const SC = styleCard || receiveMaxiSelectedStyleCard().value;

	const sameDefaultLevels = ['p', 'ul', 'ol'];

	const prefix =
		styleCardPrefix || sameDefaultLevels.includes(textLevel)
			? 'p'
			: textLevel;

	const defaultTypography = getTypographyFromSC(SC[blockStyle], prefix);

	const getCurrentValue = target =>
		typography[`${target}-${breakpoint}${isHover ? '-hover' : ''}`];
	const getDefaultValue = target =>
		defaultTypography[`${target}-${breakpoint}`];

	Object.entries(value).forEach(([target, val]) => {
		if (isNil(val)) delete style[`${target}-${breakpoint}`];
		if (getCurrentValue(target) === val)
			delete style[`${target}-${breakpoint}`];
		else if (
			!isHover &&
			(isNil(getCurrentValue(target)) ||
				(isEmpty(getCurrentValue(target)) &&
					!isNumber(getCurrentValue(target)) &&
					!isBoolean(getCurrentValue(target)))) &&
			getDefaultValue(target) === val
		)
			delete style[`${target}-${breakpoint}`];
		else if (
			isNil(val) ||
			(isEmpty(val) && !isNumber(val) && !isBoolean(val))
		)
			delete style[`${target}-${breakpoint}`];
		else style[`${target}-${breakpoint}`] = val;
	});

	// Ensures palette color is cleaned to avoid unnecessary Custom Formats
	if (
		isNil(style[`palette-status-${breakpoint}`]) &&
		!isEmpty(style[`color-${breakpoint}`])
	)
		delete style[`color-${breakpoint}`];

	return style;
};

/**
 * Updates the existent custom format
 *
 * @param {Object} [$0]                  Optional named arguments.
 * @param {Object} [$0.typography]       MaxiBlocks typography
 * @param {string} [$0.currentClassName] Maxi Custom format className
 * @param {string} [$0.breakpoint]       Device type breakpoint
 * @param {Object} [$0.value]            Requested values to implement
 *                                       on typography object
 * @param {Object} [$0.isHover]          Is the requested typography under hover state
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
	styleCard,
}) => {
	const newTypography = {};

	newTypography[`custom-formats${isHover ? '-hover' : ''}`] =
		cleanCustomFormats(typography, isHover);

	newTypography[`custom-formats${isHover ? '-hover' : ''}`][
		currentClassName
	] = {
		...styleObjectManipulator({
			typography,
			value,
			breakpoint,
			currentStyle: getCustomFormat(
				typography,
				currentClassName,
				isHover
			),
			textLevel,
			styleCard,
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
