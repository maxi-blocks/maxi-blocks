import { isNumber } from 'lodash';

const getColorRGBAString = ({
	firstVar,
	secondVar = null,
	opacity,
	blockStyle,
}) =>
	`var(--maxi-${blockStyle}-${firstVar}${
		secondVar ? `,rgba(var(--maxi-${blockStyle}-${secondVar})` : ''
	}, ${isNumber(opacity) ? opacity / 100 : 1}))`;

export default getColorRGBAString;
