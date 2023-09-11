/**
 * WordPress dependencies
 */
import apiFetch from '@wordpress/api-fetch';

/**
 * External dependencies
 */
import { isNil } from 'lodash';

const uniqueIDRemover = async (uniqueID, innerBlocks = null) => {
	if (!uniqueID || isNil(uniqueID)) return null;
	const uniqueIDArray = [uniqueID];

	const processBlock = async block => {
		if (block.attributes.uniqueID) {
			uniqueIDArray.push(block.attributes.uniqueID);
		}
		if (block.innerBlocks && block.innerBlocks.length > 0) {
			for (const innerBlock of block.innerBlocks) {
				// eslint-disable-next-line no-await-in-loop
				await processBlock(innerBlock); // Recursive call for inner blocks
			}
		}
	};

	if (!isNil(innerBlocks)) {
		for (const block of innerBlocks) {
			// eslint-disable-next-line no-await-in-loop
			await processBlock(block);
		}
	}

	for (const uniqueID of uniqueIDArray) {
		try {
			// eslint-disable-next-line no-await-in-loop
			const response = await apiFetch({
				path: `/maxi-blocks/v1.0/unique-id/remove/${uniqueID}`,
				method: 'DELETE',
			});

			if (response === false) {
				throw new Error(
					`Could not remove block ${uniqueID} from the DB`
				);
			} else if (response !== true) {
				throw new Error(
					`Unexpected response data: ${JSON.stringify(response)}`
				);
			}
		} catch (error) {
			console.error(
				'There was an error with the fetch call',
				error.message
			);
		}
	}

	return { response: 'true' };
};

export default uniqueIDRemover;
