/**
 * Internal dependencies
 */
import { injectImgSVG } from '@extensions/svg';

/**
 * External dependencies
 */
import DOMPurify from 'dompurify';

/**
 * Prepares SVG data for saving by replacing media with placeholders
 *
 * @param {string} uniqueID
 * @param {Object} SVGData
 * @param {string} SVGElement
 * @returns {string} SVGElement with placeholders
 */
const getDCImgSVG = (uniqueID, SVGData, SVGElement) => {
	const preparedSVGData = { ...SVGData };

	for (const key in preparedSVGData) {
		if (key in preparedSVGData) {
			preparedSVGData[key].imageID = '$media-id-to-replace';
			preparedSVGData[key].imageURL = '$media-url-to-replace';
		}
	}

	const cleanedContent = DOMPurify.sanitize(SVGElement);
	const svg = document
		.createRange()
		.createContextualFragment(cleanedContent).firstElementChild;
	const resEl = injectImgSVG(svg, preparedSVGData, false, uniqueID);

	return resEl.outerHTML;
};

export default getDCImgSVG;
