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
import { cloneDeep, isArray, isEmpty, isEqual, isPlainObject } from 'lodash';

const propagateNewUniqueID = (
	oldUniqueID,
	newUniqueID,
	clientId,
	repeaterStatus,
	maxiSetAttributes,
	getInnerBlocksPositions,
	bgLayers
) => {
	const blockAttributesUpdate = {};
	const lastChangedBlocks =
		select('maxiBlocks/blocks').getLastInsertedBlocks();

	const updateBlockAttributesUpdate = (clientId, key, value) => {
		if (!blockAttributesUpdate[clientId])
			blockAttributesUpdate[clientId] = {};

		blockAttributesUpdate[clientId][key] = value;

		return blockAttributesUpdate;
	};

	const updateRelations = () => {
		if (isEmpty(lastChangedBlocks)) return;

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

		/**
		 * In case if some of blocks was inserted into repeater (for example on validation),
		 * then we need to check the column as well.
		 */
		const getRepeaterColumnClientId = () => {
			if (!lastChangedBlocks.includes(clientId) || !repeaterStatus) {
				return null;
			}

			const columnInnerBlocksPositions =
				getInnerBlocksPositions()?.[[-1]];

			if (!columnInnerBlocksPositions) {
				return null;
			}

			const parentColumnsClientIds = select(
				'core/block-editor'
			).getBlockParentsByBlockName(clientId, 'maxi-blocks/column-maxi');

			return parentColumnsClientIds.find(columnClientId =>
				columnInnerBlocksPositions.includes(columnClientId)
			);
		};

		[...lastChangedBlocks, getRepeaterColumnClientId()].forEach(
			clientId => {
				const block = select('core/block-editor').getBlock(clientId);
				updateNewUniqueID(block);
			}
		);
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
		} = dispatch('core/block-editor');

		Object.entries(blockAttributesUpdate).forEach(
			([clientId, attributes]) => {
				markNextChangeAsNotPersistent();
				maxiSetAttributes(clientId, attributes);
			}
		);
	}
};

export default propagateNewUniqueID;
