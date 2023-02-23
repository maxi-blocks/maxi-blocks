/**
 * External dependencies
 */
import { isEmpty } from 'lodash';

/**
 * Replaces the uniqueID in the SVGData object.
 *
 * @param {Object}   attributes
 * @param {Object[]} backgroundLayers Background layers, if it's different from background layers in attributes.
 */
const handleBGLayersOnUniqueIDChange = (attributes, rawBackgroundLayers) => {
	const backgroundLayers =
		rawBackgroundLayers || attributes['background-layers'];

	if (isEmpty(backgroundLayers)) return;

	backgroundLayers.forEach(layer => {
		const { uniqueID } = attributes;
		const SVGData = layer?.['background-svg-SVGData'];
		if (!SVGData) return;

		const id = Object.keys(SVGData)[0];
		if (id.includes(uniqueID)) return;

		const newId = id.replace(/^(.*?)(?=(__))/, uniqueID);
		SVGData[newId] = { ...SVGData[id] };
		delete SVGData[id];
	});
};

export default handleBGLayersOnUniqueIDChange;
