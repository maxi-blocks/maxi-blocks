/**
 * Internal dependencies
 */
import getUpdatedSVGDataAndElement from './getUpdatedSVGDataAndElement';

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
		const { SVGData, SVGElement } = getUpdatedSVGDataAndElement(
			layer,
			uniqueID,
			'background-svg-'
		);

		return {
			...layer,
			'background-svg-SVGData': SVGData,
			'background-svg-SVGElement': SVGElement,
		};
	});
};

export default getUpdatedBGLayersWithNewUniqueID;
