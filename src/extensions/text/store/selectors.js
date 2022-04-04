/**
 * WordPress dependencies
 */
import { select } from '@wordpress/data';

const { getSelectedBlockClientId } = select('core/block-editor');

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

export const getFormatValue = (state, clientId) => {
	const selectedClientId = clientId || getSelectedBlockClientId();

	console.log('clientId');
	console.log(selectedClientId);

	if (state.formatValues && state.formatValues[selectedClientId])
		return state.formatValues[selectedClientId];

	return {};
};
