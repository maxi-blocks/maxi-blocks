import { isNumber } from 'lodash';

const getColorRGBAString = ({
	firstVar,
	secondVar = null,
	opacity,
	blockStyle,
}) =>
	secondVar
		? `var(--maxi-${blockStyle}-${firstVar},rgba(var(--maxi-${blockStyle}-${secondVar}),${
				isNumber(opacity) ? opacity / 100 : 1
		  }))`
		: `rgba(var(--maxi-${blockStyle}-${firstVar}),${
				isNumber(opacity) ? opacity / 100 : 1
		  })`;

export default getColorRGBAString;
