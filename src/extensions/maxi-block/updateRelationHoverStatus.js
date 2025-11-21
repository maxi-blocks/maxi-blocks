/**
 * WordPress dependencies
 */
import { dispatch, select } from '@wordpress/data';

/**
 * Internal dependencies
 */
import goThroughMaxiBlocks from './goThroughMaxiBlocks';
import getHoverStatus from '@extensions/relations/getHoverStatus';
import { getBlockData } from '@extensions/attributes';

/**
 * External dependencies
 */
import { isEmpty, isEqual } from 'lodash';

const updateRelationHoverStatus = (blockName, blockAttributes) => {
	const { uniqueID } = blockAttributes;

	// Optimization: Use Redux store to iterate through known blocks first
	// This avoids full tree traversal for most cases
	const maxiBlocks = select('maxiBlocks/blocks').getBlocks();
	const blockEditorStore = select('core/block-editor');

	if (maxiBlocks && Object.keys(maxiBlocks).length > 0) {
		// Fast path: iterate through Redux store
		Object.entries(maxiBlocks).forEach(([blockUniqueID, blockData]) => {
			if (uniqueID === blockUniqueID) return;

			const { clientId } = blockData;
			const block = blockEditorStore.getBlock(clientId);
			if (!block) return;

			const { relations } = block.attributes;
			if (isEmpty(relations)) return;

			const newRelations = relations.map(relation => {
				const {
					attributes: relationAttributes,
					sid: relationSettingID,
					uniqueID: relationUniqueID,
				} = relation;

				if (!relationSettingID || uniqueID !== relationUniqueID)
					return relation;

				const { effects } = relation;

				if (!('hoverStatus' in effects)) return relation;

				const blockDataInfo = getBlockData(blockName);

				if (!blockDataInfo?.interactionBuilderSettings) return relation;

				const settingMatch = Object.values(
					blockDataInfo.interactionBuilderSettings
				)
					.flat()
					.find(({ sid }) => sid === relationSettingID);

				if (!settingMatch) return relation;

				const { hoverProp } = settingMatch;

				return {
					...relation,
					effects: {
						...effects,
						hoverStatus: getHoverStatus(
							hoverProp,
							blockAttributes,
							relationAttributes
						),
					},
				};
			});

			if (!isEqual(relations, newRelations))
				dispatch('core/block-editor').updateBlockAttributes(clientId, {
					relations: newRelations,
				});
		});
		return;
	}

	// Fallback: use tree traversal for edge cases (e.g., template parts)
	goThroughMaxiBlocks(({ clientId, attributes: currentBlockAttributes }) => {
		const { relations, uniqueID: blockUniqueID } = currentBlockAttributes;

		if (uniqueID !== blockUniqueID && !isEmpty(relations)) {
			const newRelations = relations.map(relation => {
				const {
					attributes: relationAttributes,
					sid: relationSettingID,
					uniqueID: relationUniqueID,
				} = relation;

				if (!relationSettingID || uniqueID !== relationUniqueID)
					return relation;

				const { effects } = relation;

				if (!('hoverStatus' in effects)) return relation;

				const blockDataInfo = getBlockData(blockName);

				if (!blockDataInfo?.interactionBuilderSettings) return relation;

				const { hoverProp } = Object.values(
					blockDataInfo.interactionBuilderSettings
				)
					.flat()
					.find(({ sid }) => sid === relationSettingID);

				return {
					...relation,
					effects: {
						...effects,
						hoverStatus: getHoverStatus(
							hoverProp,
							blockAttributes,
							relationAttributes
						),
					},
				};
			});

			if (!isEqual(relations, newRelations))
				dispatch('core/block-editor').updateBlockAttributes(clientId, {
					relations: newRelations,
				});
		}
	});
};

export default updateRelationHoverStatus;
