import fonts from '../../../../fonts/fonts.json';

export const updateFonts = fonts => {
	return {
		type: 'UPDATE_FONTS',
		fonts,
	};
};

export const setFonts = fonts => ({
	type: 'SET_FONTS',
	fonts,
});

export const initializeFonts = () => setFonts(fonts);
