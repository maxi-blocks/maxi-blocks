const getColorRGBAString = ({
	firstVar,
	secondVar = null,
	opacity,
	blockStyle,
}) =>
	`rgba(var(--maxi-${blockStyle}-${firstVar}${
		secondVar ? `,var(--maxi-${blockStyle}-${secondVar})` : ''
	}), ${opacity / 100 || 1})`;

export default getColorRGBAString;
