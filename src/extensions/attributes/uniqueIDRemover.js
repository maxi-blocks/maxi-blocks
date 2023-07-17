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
	await apiFetch({
		path: `/maxi-blocks/v1.0/unique-id/remove/${uniqueID}`,
	});
	return true;
};

export default uniqueIDRemover;
