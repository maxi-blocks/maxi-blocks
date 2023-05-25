export const getPostFonts = state => {
	if (state.postFonts) return state.postFonts;
	return state;
};

export const getFonts = state => {
	if (state.fonts) return state.fonts;
	return state;
};

export const getFont = (state, font) => {
	if (state.fonts) return state.fonts[font];
	return state;
};
