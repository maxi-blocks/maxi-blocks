/**
 * Internal dependencies
 */
import actions from '@extensions/relations/store/actions';

describe('relations/actions', () => {
	describe('addRelation', () => {
		it('should return ADD_RELATION action', () => {
			const triggerBlock = {
				clientId: 'trigger-client-id',
				uniqueID: 'trigger-unique-id',
			};
			const targetBlock = {
				clientId: 'target-client-id',
				uniqueID: 'target-unique-id',
			};

			const result = actions.addRelation(triggerBlock, targetBlock);

			expect(result).toEqual({
				type: 'ADD_RELATION',
				triggerBlock,
				targetBlock,
			});
		});
	});

	describe('removeRelation', () => {
		it('should return REMOVE_RELATION action', () => {
			const triggerBlock = {
				clientId: 'trigger-client-id',
				uniqueID: 'trigger-unique-id',
			};
			const targetBlock = {
				clientId: 'target-client-id',
				uniqueID: 'target-unique-id',
			};

			const result = actions.removeRelation(triggerBlock, targetBlock);

			expect(result).toEqual({
				type: 'REMOVE_RELATION',
				triggerBlock,
				targetBlock,
			});
		});
	});

	describe('removeBlockRelation', () => {
		it('should return REMOVE_BLOCK_RELATION action', () => {
			const uniqueID = 'block-unique-id';

			const result = actions.removeBlockRelation(uniqueID);

			expect(result).toEqual({
				type: 'REMOVE_BLOCK_RELATION',
				uniqueID,
			});
		});
	});

	describe('updateRelation', () => {
		it('should return UPDATE_RELATION action', () => {
			const prevUniqueID = 'old-unique-id';
			const uniqueID = 'new-unique-id';

			const result = actions.updateRelation(prevUniqueID, uniqueID);

			expect(result).toEqual({
				type: 'UPDATE_RELATION',
				prevUniqueID,
				uniqueID,
			});
		});
	});
});
