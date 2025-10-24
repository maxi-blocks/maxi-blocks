/**
 * WordPress dependencies
 */
import apiFetch from '@wordpress/api-fetch';

/**
 * Internal dependencies
 */
import { removeBlockStyles } from '@extensions/maxi-block/globalStyleManager';

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
		console.log(
			'[uniqueIDRemover] Processing block deletion:',
			JSON.stringify({ uniqueID })
		);

		// Remove styles from GlobalStyleManager - this is the proper place for style cleanup
		// since this function is only called when blocks are actually deleted by user action
		try {
			removeBlockStyles(uniqueID);
			console.log(
				'[uniqueIDRemover] Successfully removed styles for:',
				JSON.stringify({ uniqueID })
			);
		} catch (error) {
			console.error(
				'[uniqueIDRemover] Error removing styles for block:',
				uniqueID,
				error
			);
		}

		// Remove from database
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

			console.log(
				'[uniqueIDRemover] Successfully removed from DB:',
				JSON.stringify({ uniqueID })
			);
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
