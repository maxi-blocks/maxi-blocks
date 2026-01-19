export const getPostFonts = state => {
	if (state.postFonts) return state.postFonts;
	return state;
};

export const getFonts = state => {
	if (state.fonts) return state.fonts;
	return state;
};

export const getCustomFonts = state => {
	if (state.customFonts) return state.customFonts;
	return {};
};

export const getFont = (state, font) => {
	if (state.fonts) return state.fonts[font];
	return state;
};

export const getFontUrl = (state, fontName, fontData) => {
	if (Array.isArray(fontData.weight)) {
		fontData.weight = fontData.weight.join();
	}

	if (state.fontUrls)
		return state.fontUrls[fontName + fontData.style + fontData.weight];
	return state;
};
