/**
 * Internal dependencies
 */
import getPaletteColor from '@extensions/style-cards/getPaletteColor';

/**
 * External dependencies
 */
import { isNumber } from 'lodash';

const getVarWithColor = ({ blockStyle, variable }) => {
	// Early return for variables that don't include 'color-'
	if (!variable.includes('color-')) {
		return `var(--maxi-${blockStyle}-${variable})`;
	}

	const colorPart = variable.split('-')[1];
	const color = getPaletteColor({
		blockStyle,
		color: colorPart,
	})?.replace(/ /g, '');

	// Use color in the return value only if it's truthy
	return `var(--maxi-${blockStyle}-${variable}${color ? `,${color}` : ''})`;
};

const getColorRGBAString = ({
	firstVar,
	secondVar = null,
	opacity,
	blockStyle,
}) =>
	secondVar
		? `var(--maxi-${blockStyle}-${firstVar},rgba(${getVarWithColor({
				blockStyle,
				variable: secondVar,
		  })},${isNumber(opacity) ? opacity : 1}))`
		: `rgba(${getVarWithColor({ blockStyle, variable: firstVar })},${
				isNumber(opacity) ? opacity : 1
		  })`;

export default getColorRGBAString;
