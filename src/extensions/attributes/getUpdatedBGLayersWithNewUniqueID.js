/**
 * Internal dependencies
 */
import { injectImgSVG } from '../svg';
import getAttributesValue from './getAttributesValue';

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
		const [SVGData, SVGElement] = getAttributesValue({
			target: ['bsv_sd', 'bsv_se'],
			props: layer,
		});

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
			bsv_sd: newSVGData,
			bsv_se: newSVGElement,
		};
	});
};

export default getUpdatedBGLayersWithNewUniqueID;
