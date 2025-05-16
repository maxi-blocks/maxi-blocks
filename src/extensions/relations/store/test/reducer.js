/**
 * WordPress dependencies
 */
import { dispatch, select } from '@wordpress/data';

/**
 * Internal dependencies
 */
import reducer from '@extensions/relations/store/reducer';

jest.mock('@wordpress/data', () => {
	const mockDispatch = {
		__unstableMarkNextChangeAsNotPersistent: jest.fn(),
		updateBlockAttributes: jest.fn(),
	};

	return {
		dispatch: jest.fn(() => mockDispatch),
		select: jest.fn(() => ({
			getBlockAttributes: jest.fn(),
		})),
	};
});

describe('relations/reducer', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('should return default state', () => {
		const state = reducer(undefined, { type: 'UNKNOWN_ACTION' });
		expect(state).toEqual({ relations: {} });
	});

	describe('ADD_RELATION', () => {
		it('should add a new relation', () => {
			const initialState = { relations: {} };
			const triggerBlock = {
				clientId: 'trigger-client-id',
				uniqueID: 'trigger-unique-id',
			};
			const targetBlock = {
				clientId: 'target-client-id',
				uniqueID: 'target-unique-id',
			};

			const action = {
				type: 'ADD_RELATION',
				triggerBlock,
				targetBlock,
			};

			const newState = reducer(initialState, action);

			expect(newState).toEqual({
				relations: {
					'trigger-unique-id': {
						'target-unique-id': 'target-client-id',
						clientId: 'trigger-client-id',
					},
				},
			});
		});

		it('should add a relation to existing relations', () => {
			const initialState = {
				relations: {
					'trigger-unique-id': {
						'existing-target-id': 'existing-client-id',
						clientId: 'trigger-client-id',
					},
				},
			};

			const triggerBlock = {
				clientId: 'trigger-client-id',
				uniqueID: 'trigger-unique-id',
			};
			const targetBlock = {
				clientId: 'target-client-id',
				uniqueID: 'target-unique-id',
			};

			const action = {
				type: 'ADD_RELATION',
				triggerBlock,
				targetBlock,
			};

			const newState = reducer(initialState, action);

			expect(newState).toEqual({
				relations: {
					'trigger-unique-id': {
						'existing-target-id': 'existing-client-id',
						'target-unique-id': 'target-client-id',
						clientId: 'trigger-client-id',
					},
				},
			});
		});
	});

	describe('REMOVE_RELATION', () => {
		it('should remove a specific relation', () => {
			const initialState = {
				relations: {
					'trigger-unique-id': {
						'target-unique-id': 'target-client-id',
						'other-target-id': 'other-client-id',
						clientId: 'trigger-client-id',
					},
				},
			};

			const triggerBlock = {
				uniqueID: 'trigger-unique-id',
			};
			const targetBlock = {
				uniqueID: 'target-unique-id',
			};

			const action = {
				type: 'REMOVE_RELATION',
				triggerBlock,
				targetBlock,
			};

			const newState = reducer(initialState, action);

			expect(newState).toEqual({
				relations: {
					'trigger-unique-id': {
						'other-target-id': 'other-client-id',
						clientId: 'trigger-client-id',
					},
				},
			});
		});

		it('should remove the entire trigger block when only clientId remains', () => {
			const initialState = {
				relations: {
					'trigger-unique-id': {
						'target-unique-id': 'target-client-id',
						clientId: 'trigger-client-id',
					},
				},
			};

			const triggerBlock = {
				uniqueID: 'trigger-unique-id',
			};
			const targetBlock = {
				uniqueID: 'target-unique-id',
			};

			const action = {
				type: 'REMOVE_RELATION',
				triggerBlock,
				targetBlock,
			};

			const newState = reducer(initialState, action);

			expect(newState).toEqual({
				relations: {},
			});
		});
	});

	describe('REMOVE_BLOCK_RELATION', () => {
		it('should remove all relations for a block uniqueID', () => {
			const initialState = {
				relations: {
					'unique-id-to-remove': {
						'other-id': 'other-client-id',
						clientId: 'client-id-to-remove',
					},
					'other-trigger': {
						'unique-id-to-remove': 'client-id-to-remove',
						clientId: 'other-trigger-client',
					},
				},
			};

			const action = {
				type: 'REMOVE_BLOCK_RELATION',
				uniqueID: 'unique-id-to-remove',
			};

			// Mock select to return block attributes with relations
			select.mockImplementation(() => ({
				getBlockAttributes: jest.fn().mockReturnValue({
					relations: [
						{ uniqueID: 'unique-id-to-remove' },
						{ uniqueID: 'other-id' },
					],
				}),
			}));

			const newState = reducer(initialState, action);

			// Verify the dispatch was called to update block attributes
			expect(dispatch).toHaveBeenCalledWith('core/block-editor');
			expect(dispatch().updateBlockAttributes).toHaveBeenCalledWith(
				'other-trigger-client',
				{
					relations: [{ uniqueID: 'other-id' }],
				}
			);

			// Verify state was updated correctly
			expect(newState).toEqual({
				relations: {},
			});
		});

		it('should handle case where no relations exist', () => {
			const initialState = {
				relations: {},
			};

			const action = {
				type: 'REMOVE_BLOCK_RELATION',
				uniqueID: 'non-existent-id',
			};

			const newState = reducer(initialState, action);
			expect(newState).toEqual({ relations: {} });
		});
	});

	describe('UPDATE_RELATION', () => {
		it('should update relations when block uniqueID changes', () => {
			const initialState = {
				relations: {
					'old-unique-id': {
						'target-id': 'target-client-id',
						clientId: 'trigger-client-id',
					},
					'other-trigger': {
						'old-unique-id': 'trigger-client-id',
						clientId: 'other-client-id',
					},
				},
			};

			const action = {
				type: 'UPDATE_RELATION',
				prevUniqueID: 'old-unique-id',
				uniqueID: 'new-unique-id',
			};

			// Mock select to return block attributes with relations
			select.mockImplementation(() => ({
				getBlockAttributes: jest.fn().mockReturnValue({
					relations: [
						{ uniqueID: 'old-unique-id' },
						{ uniqueID: 'some-other-id' },
					],
				}),
			}));

			const newState = reducer(initialState, action);

			// Verify the dispatch was called to update block attributes
			expect(dispatch).toHaveBeenCalledWith('core/block-editor');
			expect(dispatch().updateBlockAttributes).toHaveBeenCalledWith(
				'other-client-id',
				{
					relations: [
						{ uniqueID: 'new-unique-id' },
						{ uniqueID: 'some-other-id' },
					],
				}
			);

			// Verify state was updated correctly
			expect(newState).toEqual({
				relations: {
					'new-unique-id': {
						'target-id': 'target-client-id',
						clientId: 'trigger-client-id',
					},
					'other-trigger': {
						'new-unique-id': 'trigger-client-id',
						clientId: 'other-client-id',
					},
				},
			});
		});

		it('should handle case where the old uniqueID does not exist', () => {
			const initialState = {
				relations: {
					'existing-id': {
						'target-id': 'target-client-id',
						clientId: 'existing-client-id',
					},
				},
			};

			const action = {
				type: 'UPDATE_RELATION',
				prevUniqueID: 'non-existent-id',
				uniqueID: 'new-unique-id',
			};

			const newState = reducer(initialState, action);

			// State should remain unchanged except for potential relations updates
			expect(newState).toEqual({
				relations: {
					'existing-id': {
						'target-id': 'target-client-id',
						clientId: 'existing-client-id',
					},
				},
			});
		});
	});
});
