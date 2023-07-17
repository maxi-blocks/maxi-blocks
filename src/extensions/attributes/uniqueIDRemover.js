/**
 * WordPress dependencies
 */
import apiFetch from '@wordpress/api-fetch';

/**
 * External dependencies
 */
import { isNil } from 'lodash';

const uniqueIDRemover = async uniqueID => {
	if (!uniqueID || isNil(uniqueID)) return null;
	try {
		const response = await apiFetch({
			path: `/maxi-blocks/v1.0/unique-id/remove/${uniqueID}`,
		});

		if (response === false) {
			console.error(`Could not remove block ${uniqueID} from the DB`);
		} else {
			throw new Error(
				`Unexpected response data: ${JSON.stringify(response)}`
			);
		}
	} catch (error) {
		console.error('There was an error with the fetch call', error.message);
	}

	return { response: 'true' };
};

export default uniqueIDRemover;
