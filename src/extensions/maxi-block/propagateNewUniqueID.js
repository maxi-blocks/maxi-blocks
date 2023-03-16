/**
 * WordPress dependencies
 */
import { dispatch } from '@wordpress/data';

/**
 * Internal dependencies
 */
import { getUpdatedBGLayersWithNewUniqueID } from '../attributes';
import getLastChangedBlocks from './getLastChangedBlocks';

/**
 * External dependencies
 */
import { cloneDeep, isEmpty, isEqual, isArray } from 'lodash';

const propagateNewUniqueID = (oldUniqueID, newUniqueID, bgLayers) => {
	const blockAttributesUpdate = {};
	const lastChangedBlocks = getLastChangedBlocks();

	const updateBlockAttributesUpdate = (clientId, key, value) => {
		if (!blockAttributesUpdate[clientId])
			blockAttributesUpdate[clientId] = {};

		blockAttributesUpdate[clientId][key] = value;

		return blockAttributesUpdate;
	};

	const updateRelations = () => {
		if (isEmpty(lastChangedBlocks)) return;

		const updateNewUniqueID = block => {
			if (!block) return;

			const {
				attributes = {},
				innerBlocks: rawInnerBlocks = [],
				clientId,
			} = block;

			if ('relations' in attributes && !isEmpty(attributes.relations)) {
				const { relations } = attributes;

				const newRelations = cloneDeep(relations).map(relation => {
					const { uniqueID } = relation;

					if (uniqueID === oldUniqueID) {
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

			if (!isEmpty(rawInnerBlocks)) {
				const innerBlocks = isArray(rawInnerBlocks)
					? rawInnerBlocks
					: Object.values(rawInnerBlocks);

				innerBlocks.forEach(innerBlock => {
					updateNewUniqueID(innerBlock);
				});
			}
		};

		lastChangedBlocks.forEach(block => updateNewUniqueID(block));
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
