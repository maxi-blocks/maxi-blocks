const getPaletteDefault = (
	colorPaletteType,
	blockName = '',
	textLevel = 'p'
) => {
	let defaultValue = '';

	if (colorPaletteType === 'typography') {
		['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(textLevel)
			? (defaultValue = '5')
			: (defaultValue = '3');
	}

	if (colorPaletteType === 'background') {
		if (blockName === 'maxi-blocks/button-maxi') {
			defaultValue = '4';
		} else {
			defaultValue = '1';
		}
	}

	return defaultValue;
};

export default getPaletteDefault;
