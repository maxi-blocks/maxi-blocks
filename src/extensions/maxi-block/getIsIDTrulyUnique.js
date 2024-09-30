/**
 * WordPress dependencies
 */
import apiFetch from '@wordpress/api-fetch';

/**
 * Internal dependencies
 */
import goThroughMaxiBlocks from './goThroughMaxiBlocks';

/**
 * Checks if the given ID is unique within the current page context.
 *
 * @param {string} id              - The ID to check.
 * @param {number} [repeatCount=1] - The allowed number of repetitions.
 * @returns {boolean} - Returns true if the ID is unique on the page, otherwise false.
 */
export const getIsIDUniqueOnPage = (id, repeatCount = 1) => {
	if (!id.endsWith('-u')) return false;

	let currentRepeatCount = 0;

	goThroughMaxiBlocks(block => {
		const { uniqueID } = block.attributes;
		if (uniqueID === id) {
			currentRepeatCount += 1;
		}
	});

	return currentRepeatCount <= repeatCount;
};

/**
 * Checks if the given ID exists in the database.
 *
 * @param {string}      id       - The ID to check.
 * @param {AbortSignal} [signal] - The AbortSignal to cancel the request.
 * @returns {Promise<boolean>} - Returns true if the ID doesn't exist in the database, otherwise false.
 */
export const getIsIDUniqueOnDB = async (id, signal) => {
	try {
		const uniqueIDInDB = await apiFetch({
			path: `/maxi-blocks/v1.0/block-exists/${id}`,
			method: 'GET',
			signal,
		});

		return uniqueIDInDB?.exists;
	} catch (error) {
		if (error.name === 'AbortError') {
			console.warn('checkUniqueIDOnDB aborted');
		} else {
			console.error('An error occurred in checkUniqueIDOnDB:', error);
		}
	}

	return true;
};
