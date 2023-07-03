/**
 * WordPress dependencies
 */
import { dispatch, select } from '@wordpress/data';

const reducer = (
	state = {
		relations: {},
	},
	action
) => {
	switch (action.type) {
		case 'ADD_RELATION': {
			const { triggerBlock, targetBlock } = action;

			const { clientId: triggerClientId, uniqueID: triggerUniqueID } =
				triggerBlock;
			const { clientId: targetClientId, uniqueID: targetUniqueID } =
				targetBlock;

			const triggerBlockRelations =
				state.relations[triggerUniqueID] || {};

			return {
				...state,
				relations: {
					...state.relations,
					[triggerUniqueID]: {
						...triggerBlockRelations,
						[targetUniqueID]: targetClientId,
						clientId: triggerClientId,
					},
				},
			};
		}
		case 'REMOVE_RELATION': {
			const { triggerBlock, targetBlock } = action;

			const { uniqueID: triggerUniqueID } = triggerBlock;
			const { uniqueID: targetUniqueID } = targetBlock;

			const triggerBlockRelations =
				state.relations[triggerUniqueID] || {};

			delete triggerBlockRelations[targetUniqueID];

			if (Object.keys(triggerBlockRelations).length === 1) {
				delete state.relations[triggerUniqueID];

				return state;
			}

			return {
				...state,
				relations: {
					...state.relations,
					[triggerUniqueID]: triggerBlockRelations,
				},
			};
		}
		case 'REMOVE_BLOCK_RELATION': {
			const { uniqueID } = action;

			// Remove the block uniqueID as has been removed
			if (uniqueID in state.relations) delete state.relations[uniqueID];

			// Remove all uniqueID entries of each relation
			Object.keys(state.relations).forEach(triggerUniqueID => {
				const triggerBlockRelations = state.relations[triggerUniqueID];

				if (uniqueID in triggerBlockRelations) {
					delete triggerBlockRelations[uniqueID];

					const blockAttributes = select(
						'core/block-editor'
					).getBlockAttributes(
						state.relations[triggerUniqueID].clientId
					);

					if (!blockAttributes) return;

					const { relations: blockRelations } = blockAttributes;

					if (blockRelations) {
						const newRelations = blockRelations.filter(
							relation => relation.uniqueID !== uniqueID
						);

						dispatch(
							'core/block-editor'
						).__unstableMarkNextChangeAsNotPersistent();
						dispatch('core/block-editor').updateBlockAttributes(
							state.relations[triggerUniqueID].clientId,
							{
								relations: newRelations,
							}
						);
					}
				}
				if (Object.keys(triggerBlockRelations).length === 1)
					// Just `clientId` left
					delete state.relations[triggerUniqueID];
			});

			return state;
		}
		case 'UPDATE_RELATION': {
			const { prevUniqueID, uniqueID } = action;

			// Update the block uniqueID as has been updated
			if (prevUniqueID in state.relations) {
				state.relations[uniqueID] = state.relations[prevUniqueID];
				delete state.relations[prevUniqueID];
			}

			// Update all uniqueID entries of each relation
			Object.keys(state.relations).forEach(triggerUniqueID => {
				const triggerBlockRelations = state.relations[triggerUniqueID];

				if (prevUniqueID in triggerBlockRelations) {
					triggerBlockRelations[uniqueID] =
						triggerBlockRelations[prevUniqueID];
					delete triggerBlockRelations[prevUniqueID];

					const { relations: blockRelations } = select(
						'core/block-editor'
					).getBlockAttributes(
						state.relations[triggerUniqueID].clientId
					);

					if (blockRelations) {
						blockRelations.forEach(relation => {
							if (relation.uniqueID === prevUniqueID)
								relation.uniqueID = uniqueID;
						});

						dispatch(
							'core/block-editor'
						).__unstableMarkNextChangeAsNotPersistent();
						dispatch('core/block-editor').updateBlockAttributes(
							state.relations[triggerUniqueID].clientId,
							{
								relations: blockRelations,
							}
						);
					}
				}
			});

			return state;
		}
		default:
			return state;
	}
};

export default reducer;
