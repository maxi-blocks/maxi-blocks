const actions = {
	updateFonts(fonts) {
		return {
			type: 'UPDATE_FONTS',
			fonts,
		};
	},
	setFontUrl(fontName, fontData, url) {
		if (Array.isArray(fontData.weight)) {
			fontData.weight = fontData.weight.join();
		}

		const name = fontName + fontData.style + fontData.weight;
		return {
			type: 'SET_FONT_URL',
			name,
			url,
		};
	},
};
export default actions;
