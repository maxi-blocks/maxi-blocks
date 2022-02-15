/**
 * Internal dependencies
 */
import getPaletteColor from '../style-cards/getPaletteColor';

/**
 * External dependencies
 */
import { isNumber } from 'lodash';

const getVarWithColor = ({ blockStyle, variable }) => {
	const color = getPaletteColor({
		blockStyle,
		color: variable.replace('color-', ''),
	}).replace(/ /g, '');

	return `var(--maxi-${blockStyle}-${variable}${
		variable.includes('color-') && color ? `,${color}` : ''
	})`;
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
