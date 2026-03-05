import { cloneDeep } from 'lodash';

const isBackgroundDebugEnabled = () => {
	if (typeof window === 'undefined') return false;
	if (window.__MAXI_AI_DEBUG_BG) return true;
	try {
		return window.localStorage?.getItem('maxiAiDebugBackground') === '1';
	} catch (e) {
		return false;
	}
};

const summarizeBackgroundLayers = layers => {
	if (!Array.isArray(layers)) return layers;
	return layers.map(layer => ({
		id: layer?.id,
		order: layer?.order,
		type: layer?.type,
		display: layer?.['display-general'],
		paletteStatus: layer?.['background-palette-status-general'],
		paletteColor: layer?.['background-palette-color-general'],
		color: layer?.['background-color-general'],
	}));
};

const logBackgroundDebug = (label, payload) => {
	if (!isBackgroundDebugEnabled()) return;
	console.log(`[Maxi AI BG] ${label}`, payload);
};

export const updateBackgroundColor = (clientId, color, currentAttributes, prefix = '') => {
	const newAttributes = {};
	const isPalette = typeof color === 'number';

	newAttributes[`${prefix}background-active-media-general`] = 'color';
	newAttributes[`${prefix}background-class-general`] = ''; // clear class based colors

	if (isPalette) {
		newAttributes[`${prefix}background-palette-status-general`] = true;
		newAttributes[`${prefix}background-palette-color-general`] = color;
		// Explicitly clear custom color to ensure editor UI reflects palette status
		newAttributes[`${prefix}background-color-general`] = '';
	} else {
		newAttributes[`${prefix}background-palette-status-general`] = false;
		newAttributes[`${prefix}background-color-general`] = color;
	}

	if (currentAttributes['background-layers'] && Array.isArray(currentAttributes['background-layers'])) {
		const layers = cloneDeep(currentAttributes['background-layers']);
		if (layers.length > 0) {
			layers[0].type = 'color';
			layers[0]['display-general'] = 'block';

			if (isPalette) {
				layers[0]['background-palette-status-general'] = true;
				layers[0]['background-palette-color-general'] = color;
			} else {
				layers[0]['background-palette-status-general'] = false;
				layers[0]['background-color-general'] = color;
			}
			newAttributes['background-layers'] = layers;
		}
	}

	logBackgroundDebug('updateBackgroundColor', {
		clientId,
		prefix,
		color,
		isPalette,
		backgroundActiveMedia: newAttributes[`${prefix}background-active-media-general`],
		paletteStatus: newAttributes[`${prefix}background-palette-status-general`],
		paletteColor: newAttributes[`${prefix}background-palette-color-general`],
		customColor: newAttributes[`${prefix}background-color-general`],
		layers: summarizeBackgroundLayers(newAttributes['background-layers']),
	});

	return newAttributes;
};

export default updateBackgroundColor;

