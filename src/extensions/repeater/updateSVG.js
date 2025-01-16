/**
 * Internal dependencies
 */
import { getUpdatedSVGDataAndElement } from '@extensions/attributes';
import {
	shouldSetPreserveAspectRatio,
	getSVGPosition,
	getSVGRatio,
	setSVGPosition,
	setSVGRatio,
	togglePreserveAspectRatio,
	setSVGAriaLabel,
} from '@extensions/svg';

/**
 * Sets correct uniqueID, mediaURL, SVGPosition, SVGRatio and aria-label for repeated SVGs
 *
 * @param {Object} updatedAttributes
 * @param {Object} blockAttributes
 * @returns
 */
const updateSVG = (updatedAttributes, blockAttributes) => {
	const getPrefix = () => {
		const { uniqueID } = blockAttributes;

		if (uniqueID) {
			if (uniqueID.startsWith('svg-')) return 'svg-';

			if (uniqueID.startsWith('button-')) return 'icon-';
		}

		return null;
	};

	const prefix = getPrefix();

	if (prefix) {
		const contentKey = `${prefix === 'svg-' ? '' : prefix}content`;

		if (
			contentKey in blockAttributes &&
			!(contentKey in updatedAttributes) &&
			shouldSetPreserveAspectRatio(updatedAttributes, prefix)
		) {
			updatedAttributes[contentKey] = togglePreserveAspectRatio(
				blockAttributes[contentKey],
				true
			);
		}
	}

	if ('ariaLabels' in updatedAttributes) {
		const { ariaLabels } = updatedAttributes;
		const contentKey = `${prefix === 'svg-' ? '' : prefix}content`;

		const updateIcon = ariaLabel => {
			updatedAttributes[contentKey] = setSVGAriaLabel(
				ariaLabel,
				() =>
					updatedAttributes[contentKey] || blockAttributes[contentKey]
			);
		};

		if (ariaLabels?.svg) {
			updateIcon(ariaLabels.svg);
		} else if (ariaLabels?.icon) {
			updateIcon(ariaLabels.icon);
		}
	}

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
