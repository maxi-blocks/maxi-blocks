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
 * @returns {Object[] | null} Updated background layers or null if no update is needed.
 */
const getUpdatedBGLayersWithNewUniqueID = (rawBackgroundLayers, uniqueID) => {
	if (isEmpty(rawBackgroundLayers)) return rawBackgroundLayers;

	let isBGLayersUpdated = false;

	// eslint-disable-next-line @wordpress/no-unused-vars-before-return
	const updatedBGLayers = rawBackgroundLayers.map(layer => {
		if (
			!('background-svg-SVGData' in layer) &&
			!('background-svg-SVGElement' in layer)
		) {
			return layer;
		}

		isBGLayersUpdated = true;

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

	if (!isBGLayersUpdated) return null;

	return updatedBGLayers;
};

export default getUpdatedBGLayersWithNewUniqueID;
