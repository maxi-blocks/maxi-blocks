/**
 * WordPress dependencies
 */
import { dispatch, select } from '@wordpress/data';

/**
 * Internal dependencies
 */
import getHoverStatus from '../relations/getHoverStatus';
import { getBlockData } from '../attributes';

/**
 * External dependencies
 */
import { isEmpty, isEqual } from 'lodash';

const updateRelationHoverStatus = (blockName, blockAttributes) => {
	const { uniqueID } = blockAttributes;

	const blocksRelations = select('maxiBlocks/relations').receiveRelations();

	if (!blocksRelations) return;

	Object.values(blocksRelations).forEach(blockRelationData => {
		if (uniqueID in blockRelationData) {
			const { clientId: targetClientId } = blockRelationData;
			const { relations } =
				select('core/block-editor').getBlockAttributes(targetClientId);

			if (!isEmpty(relations)) {
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

					const blockData = getBlockData(blockName);

					if (!blockData?.interactionBuilderSettings) return relation;

					const { hoverProp } = Object.values(
						blockData.interactionBuilderSettings
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
					dispatch('core/block-editor').updateBlockAttributes(
						targetClientId,
						{
							relations: newRelations,
						}
					);
			}
		}
	});
};

export default updateRelationHoverStatus;
