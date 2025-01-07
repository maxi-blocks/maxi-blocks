/**
 * External dependencies
 */
import { capitalize } from 'lodash';

/**
 * Internal dependencies
 */
import uniqueCustomLabelGenerator from '@extensions/attributes/uniqueCustomLabelGenerator';

/**
 *
 * @param {string} uniqueId
 * @example `text-maxi-ecbf22bc-u` => `text`
 * @example `button-maxi-124` => `button`
 * @returns {string} Capitalized lock name without `-maxi-{randomPart}-u` at the end
 */
const sanitizeUniqueId = uniqueId =>
	capitalize(uniqueId.replace(/-maxi-.*?-u$/, '').replace(/-maxi-.*?$/, ''));

/**
 *
 * @param {string} previousCustomLabel
 * @returns {string} The previous custom label without the random part at the end
 */
const sanitizePreviousCustomLabel = previousCustomLabel =>
	previousCustomLabel.replace(/_\d+$/, '');

const getCustomLabel = (previousCustomLabel, uniqueID) => {
	if (previousCustomLabel) {
		const sanitizedPreviousCustomLabel =
			sanitizePreviousCustomLabel(previousCustomLabel);

		return uniqueCustomLabelGenerator(
			sanitizedPreviousCustomLabel,
			uniqueID,
			sanitizedPreviousCustomLabel === previousCustomLabel ? null : 1
		);
	}

	return uniqueCustomLabelGenerator(sanitizeUniqueId(uniqueID), uniqueID);
};

export default getCustomLabel;
