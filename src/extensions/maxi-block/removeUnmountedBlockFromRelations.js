/**
 * WordPress dependencies
 */
import { dispatch, select } from '@wordpress/data';

/**
 * Internal dependencies
 */
import goThroughMaxiBlocks from './goThroughMaxiBlocks';

/**
 * External dependencies
 */
import { isEmpty, isEqual } from 'lodash';

const removeUnmountedBlockFromRelations = uniqueID => {
	const { isDraggingBlocks } = select('core/block-editor');

	const isDragging = isDraggingBlocks();

	if (!isDragging)
		goThroughMaxiBlocks(({ clientId, attributes }) => {
			const { relations, uniqueID: blockUniqueID } = attributes;

			if (uniqueID !== blockUniqueID && !isEmpty(relations)) {
				const filteredRelations = relations.filter(
					({ uniqueID: relationUniqueID }) =>
						relationUniqueID !== uniqueID
				);

				if (!isEqual(relations, filteredRelations)) {
					const { updateBlockAttributes } =
						dispatch('core/block-editor');

					updateBlockAttributes(clientId, {
						relations: filteredRelations,
					});

					return true;
				}
			}

			return false;
		});
};

export default removeUnmountedBlockFromRelations;
