/**
 * Internal dependencies
 */
import { injectImgSVG } from '@extensions/svg';

/**
 *
 * @param {Object} attributes
 * @param {string} uniqueID
 * @param {string} prefix
 * @param {string} imageURL
 * @returns {Object} Object with new SVGData and SVGElement.
 */
const getUpdatedSVGDataAndElement = (
	attributes,
	uniqueID,
	prefix = '',
	imageURL
) => {
	const SVGData = attributes?.[`${prefix}SVGData`];
	const SVGElement = attributes?.[`${prefix}SVGElement`];
	if (!SVGData || !SVGElement) return {};

	const id = Object.keys(SVGData)[0];
	const uniqueIDFromId = id.match(/^(.*?)(?=(__))/)?.[0];
	if (uniqueIDFromId === uniqueID) return {};

	const newId = id.replace(/^(.*?)(?=(__))/, uniqueID);
	const newSVGData = { ...SVGData, [newId]: SVGData[id] };
	delete newSVGData[id];

	if (imageURL) {
		newSVGData[newId].imageURL = imageURL;
	}

	const newSVGElement = injectImgSVG(
		SVGElement,
		newSVGData,
		false,
		uniqueID
	).outerHTML;

	return {
		SVGData: newSVGData,
		SVGElement: newSVGElement,
	};
};

export default getUpdatedSVGDataAndElement;
