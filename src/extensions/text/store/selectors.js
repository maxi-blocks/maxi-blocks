export const getFonts = state => {
	if (state.fonts) return state.fonts;
	return state;
};

export const getFont = (state, font) => {
	if (state.fonts) return state.fonts[font];
	return state;
};

export const getFormatValue = state => {
	if (state.formatValue) return state.formatValue;
	return {};
};
