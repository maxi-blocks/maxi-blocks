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
 * @param {void} callback Callback to execute for each of dirty entity records.
 */
const entityRecordsWrapper = callback => {
	const { __experimentalGetDirtyEntityRecords } = select('core');
	const dirtyEntityRecords = __experimentalGetDirtyEntityRecords();

	if (!isEmpty(dirtyEntityRecords)) dirtyEntityRecords.forEach(callback);
};

export default entityRecordsWrapper;
