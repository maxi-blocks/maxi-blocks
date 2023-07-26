/**
 * WordPress dependencies
 */
import { select } from '@wordpress/data';

const customDiff = (oldObject, newObject) => {
	const output = {};

	// Iterate over each property in newObject
	for (const key in newObject) {
		if (key in newObject) {
			// If property is an object, run customDiff recursively
			if (
				typeof newObject[key] === 'object' &&
				typeof oldObject[key] === 'object' &&
				oldObject[key]
			) {
				const valueDiff = customDiff(oldObject[key], newObject[key]);
				if (Object.keys(valueDiff).length > 0) {
					output[key] = valueDiff;
				}
			}
			// If the property has changed, or if it's the 'clientId', include it in the output
			else if (key === 'clientId' || oldObject[key] !== newObject[key]) {
				output[key] = newObject[key];
			}
		}
	}

	return output;
};

const getLastChangedBlocks = () => {
	const { getEntityRecordEdits, getUndoEdit } = select('core');

	const undoEdit = getUndoEdit();

	if (!undoEdit) return false;

	const entityRecordEdit = getEntityRecordEdits(
		'postType',
		undoEdit.name,
		undoEdit.recordId
	);

	const diffBlocks = customDiff(
		undoEdit?.edits?.blocks,
		entityRecordEdit?.blocks
	);

	if (typeof diffBlocks !== 'object') return false;

	return Object.values(diffBlocks);
};

export default getLastChangedBlocks;
