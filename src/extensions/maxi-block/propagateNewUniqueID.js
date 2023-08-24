/**
 * WordPress dependencies
 */
import { dispatch, select } from '@wordpress/data';

/**
 * Internal dependencies
 */
import { getUpdatedBGLayersWithNewUniqueID } from '../attributes';

/**
 * External dependencies
 */
import {
	cloneDeep,
	isArray,
	isEmpty,
	isEqual,
	isPlainObject,
	uniq,
} from 'lodash';

const propagateNewUniqueID = (
	oldUniqueID,
	newUniqueID,
	repeaterStatus,
	bgLayers
) => {
	const blockAttributesUpdate = {};
	const lastInsertedBlocks =
		select('maxiBlocks/blocks').getLastInsertedBlocks();
	const lastParentBlocks = repeaterStatus
		? select('maxiBlocks/blocks').getLastParentBlocks()
		: [];

	const updateBlockAttributesUpdate = (clientId, key, value) => {
		if (!blockAttributesUpdate[clientId])
			blockAttributesUpdate[clientId] = {};

		blockAttributesUpdate[clientId][key] = value;

		return blockAttributesUpdate;
	};

	const updateRelations = () => {
		if ([lastInsertedBlocks, lastParentBlocks].every(isEmpty)) return;

		let firstColumnToModifyClientId = null;

		const updateNewUniqueID = block => {
			if (!block) return;

			const { attributes = {}, clientId } = block;

			if (
				'relations' in attributes &&
				!isEmpty(attributes.relations) &&
				(isArray(attributes.relations) ||
					(isPlainObject(attributes.relations) &&
						isArray(Object.values(attributes.relations))))
			) {
				const relations = isArray(attributes.relations)
					? attributes.relations
					: Object.values(attributes.relations);

				const newRelations = cloneDeep(relations).map(relation => {
					const { uniqueID } = relation;

					const { getBlockName, getBlockParentsByBlockName } =
						select('core/block-editor');
					const columnClientId =
						getBlockParentsByBlockName(
							clientId,
							'maxi-blocks/column-maxi'
						)[0] ||
						(getBlockName(clientId) === 'maxi-blocks/column-maxi' &&
							clientId);

					if (
						uniqueID === oldUniqueID &&
						(!repeaterStatus ||
							!columnClientId ||
							(repeaterStatus &&
								(!firstColumnToModifyClientId ||
									firstColumnToModifyClientId ===
										columnClientId)))
					) {
						firstColumnToModifyClientId = columnClientId;

						relation.uniqueID = newUniqueID;
					}

					return relation;
				});

				if (!isEqual(relations, newRelations) && clientId)
					updateBlockAttributesUpdate(
						clientId,
						'relations',
						newRelations
					);
			}
		};

		const clientIdsToUpdate = uniq([
			...lastInsertedBlocks,
			...lastParentBlocks,
		]);

		clientIdsToUpdate.forEach(clientId => {
			const block = select('core/block-editor').getBlock(clientId);
			updateNewUniqueID(block);
		});
	};

	const updateBGLayers = () => {
		blockAttributesUpdate['background-layers'] =
			getUpdatedBGLayersWithNewUniqueID(bgLayers, newUniqueID);
	};

	updateRelations();
	updateBGLayers();

	if (!isEmpty(blockAttributesUpdate)) {
		const {
			__unstableMarkNextChangeAsNotPersistent:
				markNextChangeAsNotPersistent,
			updateBlockAttributes,
		} = dispatch('core/block-editor');

		Object.entries(blockAttributesUpdate).forEach(
			([clientId, attributes]) => {
				markNextChangeAsNotPersistent();
				updateBlockAttributes(clientId, attributes);
			}
		);
	}
};

export default propagateNewUniqueID;
