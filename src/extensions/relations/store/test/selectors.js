/**
 * Internal dependencies
 */
import selectors from '@extensions/relations/store/selectors';

describe('relations/selectors', () => {
	describe('receiveRelations', () => {
		it('should return relations from state', () => {
			const state = {
				relations: {
					'trigger-unique-id': {
						'target-unique-id': 'target-client-id',
						clientId: 'trigger-client-id',
					},
				},
			};

			const result = selectors.receiveRelations(state);

			expect(result).toEqual({
				'trigger-unique-id': {
					'target-unique-id': 'target-client-id',
					clientId: 'trigger-client-id',
				},
			});
		});

		it('should return false if state is not provided', () => {
			const result = selectors.receiveRelations(null);
			expect(result).toBe(false);
		});
	});

	describe('receiveBlockUnderRelationClientIDs', () => {
		it('should return blocks that have relations with the provided uniqueID', () => {
			const state = {
				relations: {
					'trigger-1': {
						'target-unique-id': 'target-client-id',
						clientId: 'trigger-1-client-id',
					},
					'trigger-2': {
						'target-unique-id': 'target-client-id',
						clientId: 'trigger-2-client-id',
					},
					'trigger-3': {
						'other-target': 'other-client-id',
						clientId: 'trigger-3-client-id',
					},
				},
			};

			const result = selectors.receiveBlockUnderRelationClientIDs(
				state,
				'target-unique-id'
			);

			expect(result).toEqual([
				{
					uniqueID: 'trigger-1',
					clientId: 'trigger-1-client-id',
				},
				{
					uniqueID: 'trigger-2',
					clientId: 'trigger-2-client-id',
				},
			]);
		});

		it('should return empty array if no blocks have relations with the provided uniqueID', () => {
			const state = {
				relations: {
					'trigger-1': {
						'target-1': 'target-1-client-id',
						clientId: 'trigger-1-client-id',
					},
				},
			};

			const result = selectors.receiveBlockUnderRelationClientIDs(
				state,
				'non-existent-id'
			);

			expect(result).toEqual([]);
		});

		it('should return false if state is not provided', () => {
			const result = selectors.receiveBlockUnderRelationClientIDs(
				null,
				'target-id'
			);
			expect(result).toBe(false);
		});

		it('should return false if relations does not exist in state', () => {
			const state = {};
			const result = selectors.receiveBlockUnderRelationClientIDs(
				state,
				'target-id'
			);
			expect(result).toBe(false);
		});
	});
});
