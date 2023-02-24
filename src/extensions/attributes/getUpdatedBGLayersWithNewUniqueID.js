/**
 * Internal dependencies
 */
import { injectImgSVG } from '../svg';

/**
 * External dependencies
 */
import { isEmpty, cloneDeep } from 'lodash';

/**
 * Replaces the uniqueID in the SVGData object.
 *
 * @param {Object[]} rawBackgroundLayers Background layers for cloning.
 * @param {string}   uniqueID
 * @returns {Object[]} Updated background layers.
 */
const getUpdatedBGLayersWithNewUniqueID = (rawBackgroundLayers, uniqueID) => {
	const backgroundLayers = cloneDeep(rawBackgroundLayers);

	if (!isEmpty(backgroundLayers))
		backgroundLayers.forEach(layer => {
			const SVGData = layer?.['background-svg-SVGData'];
			if (!SVGData) return;

			const id = Object.keys(SVGData)[0];
			if (id.includes(uniqueID)) return;

			const newId = id.replace(/^(.*?)(?=(__))/, uniqueID);
			SVGData[newId] = { ...SVGData[id] };
			delete SVGData[id];

			const SVGElement = layer?.['background-svg-SVGElement'];
			if (!SVGElement) return;

			layer['background-svg-SVGElement'] = injectImgSVG(
				SVGElement,
				SVGData,
				false,
				uniqueID
			).outerHTML;
		});

	return backgroundLayers;
};

export default getUpdatedBGLayersWithNewUniqueID;
