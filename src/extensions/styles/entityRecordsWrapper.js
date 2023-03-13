/**
 * WordPress dependencies
 */
import { select } from '@wordpress/data';

/**
 * External dependencies
 */
import { isEmpty } from 'lodash';

/**
 * Wrapper which go through all dirty entity records and execute callback for each of them.
 *
 * @param {void}    callback       Callback to execute for each of dirty entity records.
 * @param {boolean} addClearEntity If true, add current post id and type to dirty entity records.
 */
const entityRecordsWrapper = (callback, addClearEntity = false) => {
	const { __experimentalGetDirtyEntityRecords } = select('core');
	const dirtyEntityRecords = __experimentalGetDirtyEntityRecords();

	if (!isEmpty(dirtyEntityRecords)) dirtyEntityRecords.forEach(callback);

	if (addClearEntity) {
		const { getCurrentPostId, getCurrentPostType } = select('core/editor');

		callback({
			key: getCurrentPostId(),
			name: getCurrentPostType(),
		});
	}
};

export default entityRecordsWrapper;
