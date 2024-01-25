/**
 * Internal dependencies
 */
import injectImgSVG from './injectImgSVG';

/**
 * External dependencies
 */
import DOMPurify from 'dompurify';
import { isEmpty, uniqueId } from 'lodash';

/**
 * Updates media in SVG element
 *
 * @param {string} uniqueID
 * @param {Object} SVGData
 * @param {string} SVGElement
 * @param {Object} media
 * @returns {Object} updated SVGElement and SVGData
 */
const getUpdatedImgSVG = (uniqueID, SVGData, SVGElement, media) => {
	if (
		isEmpty(SVGData) ||
		(SVGData[Object.keys(SVGData)[0]].imageID === media.id &&
			SVGData[Object.keys(SVGData)[0]].imageURL === media.url)
	) {
		return { SVGElement, SVGData };
	}

	const cleanedContent = DOMPurify.sanitize(SVGElement);

	const svg = document
		.createRange()
		.createContextualFragment(cleanedContent).firstElementChild;

	const resData = {
		[`${uniqueID}__${uniqueId()}`]: {
			color: '',
			imageID: '',
			imageURL: '',
		},
	};
	const SVGValue = resData;
	const el = Object.keys(SVGValue)[0];

	SVGValue[el].imageID = media.id;
	SVGValue[el].imageURL = media.url;

	const resEl = injectImgSVG(svg, resData, false, uniqueID);

	return { SVGElement: resEl.outerHTML, SVGData: SVGValue };
};

export default getUpdatedImgSVG;
