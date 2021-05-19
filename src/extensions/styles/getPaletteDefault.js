const getPaletteDefault = (
	colorPaletteType,
	blockName = '',
	textLevel = 'p'
) => {
	let defaultValue = '';

	if (colorPaletteType === 'typography') {
		if (
			blockName === 'maxi-blocks/text-maxi' &&
			['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(textLevel)
		) {
			defaultValue = 5;
		} else if (blockName === 'maxi-blocks/number-counter-maxi') {
			defaultValue = 4;
		} else {
			defaultValue = 3;
		}

		if (blockName === 'maxi-blocks/button-maxi') defaultValue = 1;
	}

	if (colorPaletteType === 'background') {
		blockName === 'maxi-blocks/button-maxi'
			? (defaultValue = 4)
			: (defaultValue = 1);
	}

	return defaultValue;
};

export default getPaletteDefault;
