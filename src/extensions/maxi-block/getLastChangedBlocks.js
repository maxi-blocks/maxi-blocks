/**
 * WordPress dependencies
 */
import { select } from '@wordpress/data';

/**
 * External dependencies
 */
import { diff } from 'deep-object-diff';

const getLastChangedBlocks = () => {
	const { getEntityRecordEdits, getUndoEdit } = select('core');
	const { getCurrentPostType } = select('core/editor');

	const undoEdit = getUndoEdit();
	const entityRecordEdit = getEntityRecordEdits(
		'postType',
		getCurrentPostType(),
		undoEdit.recordId
	);

	const diffBlocks = diff(undoEdit.edits.blocks, entityRecordEdit.blocks);

	return Object.values(diffBlocks);
};

export default getLastChangedBlocks;
