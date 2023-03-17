/**
 * WordPress dependencies
 */
import { dispatch } from '@wordpress/data';

/**
 * Internal dependencies
 */
import goThroughMaxiBlocks from './goThroughMaxiBlocks';
import getHoverStatus from '../relations/getHoverStatus';
import { getBlockData } from '../attributes';

/**
 * External dependencies
 */
import { isEmpty, isEqual } from 'lodash';

const updateRelationHoverStatus = (blockName, blockAttributes) => {
	const { uniqueID } = blockAttributes;

	goThroughMaxiBlocks(({ clientId, attributes: currentBlockAttributes }) => {
		const { relations, uniqueID: blockUniqueID } = currentBlockAttributes;

		if (uniqueID !== blockUniqueID && !isEmpty(relations)) {
			const newRelations = relations.map(relation => {
				const {
					attributes: relationAttributes,
					settings: settingName,
					uniqueID: relationUniqueID,
				} = relation;

				if (!settingName || uniqueID !== relationUniqueID)
					return relation;

				const { effects } = relation;

				if (!('hoverStatus' in effects)) return relation;

				const blockData = getBlockData(blockName);

				if (!blockData?.interactionBuilderSettings) return relation;

				const { hoverProp } = Object.values(
					blockData.interactionBuilderSettings
				)
					.flat()
					.find(({ label }) => label === settingName);

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
