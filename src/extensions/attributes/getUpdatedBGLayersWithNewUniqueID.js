/**
 * Internal dependencies
 */
import { injectImgSVG } from '../svg';

/**
 * External dependencies
 */
import { isEmpty } from 'lodash';

/**
 * Replaces the uniqueID in the SVGData object.
 *
 * @param {Object[]} rawBackgroundLayers Background layers for cloning.
 * @param {string}   uniqueID
 * @returns {Object[]} Updated background layers.
 */
const getUpdatedBGLayersWithNewUniqueID = (rawBackgroundLayers, uniqueID) => {
	if (isEmpty(rawBackgroundLayers)) return rawBackgroundLayers;

	return rawBackgroundLayers.map(layer => {
		const SVGData = layer?.['background-svg-SVGData'];
		const SVGElement = layer?.['background-svg-SVGElement'];
		if (!SVGData || !SVGElement) return layer;

		const id = Object.keys(SVGData)[0];
		const uniqueIDFromId = id.match(/^(.*?)(?=(__))/)?.[0];
		if (uniqueIDFromId === uniqueID) return layer;

		const newId = id.replace(/^(.*?)(?=(__))/, uniqueID);
		const newSVGData = { ...SVGData, [newId]: SVGData[id] };
		delete newSVGData[id];

		const newSVGElement = injectImgSVG(
			SVGElement,
			newSVGData,
			false,
			uniqueID
		).outerHTML;

		return {
			...layer,
			'background-svg-SVGData': newSVGData,
			'background-svg-SVGElement': newSVGElement,
		};
	});
};

export default getUpdatedBGLayersWithNewUniqueID;
