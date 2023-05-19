/**
 * WordPress dependencies
 */
import { dispatch } from '@wordpress/data';

/**
 * Internal dependencies
 */
import {
	getUpdatedBGLayersWithNewUniqueID,
	getAttributesValue,
} from '../attributes';
import getLastChangedBlocks from './getLastChangedBlocks';

/**
 * External dependencies
 */
import { cloneDeep, isArray, isEmpty, isEqual } from 'lodash';

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

			if ('_r' in attributes && !isEmpty(attributes._r)) {
				const relations = getAttributesValue({
					target: '_r',
					props: attributes,
				});

				const newRelations = cloneDeep(relations).map(relation => {
					const { _uid: uniqueID } = relation;

					if (uniqueID === oldUniqueID) {
						relation._uid = newUniqueID;
					}

					return relation;
				});

				if (!isEqual(relations, newRelations) && clientId)
					updateBlockAttributesUpdate(clientId, '_r', newRelations);
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
		blockAttributesUpdate.b_ly = getUpdatedBGLayersWithNewUniqueID(
			bgLayers,
			newUniqueID
		);
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
