/**
 * Internal dependencies
 */
import { getUpdatedSVGDataAndElement } from '../attributes';
import {
	getSVGPosition,
	getSVGRatio,
	setSVGPosition,
	setSVGRatio,
} from '../svg';

/**
 * Sets correct uniqueID, mediaURL, SVGPosition and SVGRatio for repeated SVGs
 *
 * @param {Object} updatedAttributes
 * @param {Object} blockAttributes
 * @returns
 */
const updateSVG = (updatedAttributes, blockAttributes) => {
	if (!('SVGElement' in updatedAttributes)) return;

	if ('SVGData' in updatedAttributes) {
		const { SVGData, SVGElement } = getUpdatedSVGDataAndElement(
			updatedAttributes,
			blockAttributes.uniqueID,
			'',
			blockAttributes.mediaURL
		);

		if (SVGData && SVGElement) {
			updatedAttributes.SVGData = SVGData;
			updatedAttributes.SVGElement = SVGElement;
		}
	} else {
		const oldShapePosition = getSVGPosition(blockAttributes.SVGElement);
		const newShapePosition = getSVGPosition(updatedAttributes.SVGElement);

		const oldShapeRatio = getSVGRatio(blockAttributes.SVGElement);
		const newShapeRatio = getSVGRatio(updatedAttributes.SVGElement);

		if (oldShapePosition !== newShapePosition) {
			updatedAttributes.SVGElement = setSVGPosition(
				blockAttributes.SVGElement,
				newShapePosition
			);
		}

		if (oldShapeRatio !== newShapeRatio) {
			updatedAttributes.SVGElement = setSVGRatio(
				blockAttributes.SVGElement,
				newShapeRatio
			);
		}
	}
};

export default updateSVG;
