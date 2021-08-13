import { isNumber } from 'lodash';

const getColorRGBAString = ({
	firstVar,
	secondVar = null,
	opacity,
	blockStyle,
}) =>
	`rgba(var(--maxi-${blockStyle}-${firstVar}${
		secondVar ? `,var(--maxi-${blockStyle}-${secondVar})` : ''
	}), ${isNumber(opacity) ? opacity / 100 : 1})`;

export default getColorRGBAString;
