import reducer from '@extensions/maxi-block/store/reducer';

describe('maxi-block reducer', () => {
	const initialState = {
		blocks: {},
		lastInsertedBlocks: [],
		blockClientIds: [],
		newBlocksUniqueIDs: [],
		blockClientIdsWithUpdatedAttributes: [],
	};

	it('Should return initial state', () => {
		const state = reducer(undefined, { type: 'DUMMY_ACTION' });
		expect(state).toEqual(initialState);
	});

	describe('ADD_BLOCK action', () => {
		it('Should add a block to the blocks object', () => {
			const action = {
				type: 'ADD_BLOCK',
				uniqueID: 'test-block-123',
				clientId: 'client-123',
				blockRoot: 'blockRoot-123',
			};

			const state = reducer(initialState, action);

			expect(state.blocks).toHaveProperty('test-block-123');
			expect(state.blocks['test-block-123']).toEqual({
				clientId: 'client-123',
				blockRoot: 'blockRoot-123',
			});
		});

		it('Should keep existing blocks when adding a new one', () => {
			const existingState = {
				...initialState,
				blocks: {
					'existing-block': {
						clientId: 'existing-client',
						blockRoot: 'existing-root',
					},
				},
			};

			const action = {
				type: 'ADD_BLOCK',
				uniqueID: 'test-block-123',
				clientId: 'client-123',
				blockRoot: 'blockRoot-123',
			};

			const state = reducer(existingState, action);

			expect(state.blocks).toHaveProperty('existing-block');
			expect(state.blocks).toHaveProperty('test-block-123');
		});
	});

	describe('REMOVE_BLOCK action', () => {
		it('Should remove a block from the blocks object', () => {
			const existingState = {
				...initialState,
				blocks: {
					'test-block-123': {
						clientId: 'client-123',
						blockRoot: 'blockRoot-123',
					},
					'other-block': {
						clientId: 'other-client',
						blockRoot: 'other-root',
					},
				},
				lastInsertedBlocks: ['client-123', 'other-client'],
				blockClientIds: ['client-123', 'other-client'],
				newBlocksUniqueIDs: ['test-block-123', 'other-block'],
				blockClientIdsWithUpdatedAttributes: [
					'client-123',
					'other-client',
				],
			};

			const action = {
				type: 'REMOVE_BLOCK',
				uniqueID: 'test-block-123',
				clientId: 'client-123',
			};

			const state = reducer(existingState, action);

			expect(state.blocks).not.toHaveProperty('test-block-123');
			expect(state.blocks).toHaveProperty('other-block');
			expect(state.lastInsertedBlocks).not.toContain('client-123');
			expect(state.blockClientIds).not.toContain('client-123');
			expect(state.newBlocksUniqueIDs).not.toContain('test-block-123');
			expect(state.blockClientIdsWithUpdatedAttributes).not.toContain(
				'client-123'
			);
		});
	});

	describe('UPDATE_BLOCK_STYLES_ROOT action', () => {
		it('Should update blockRoot for a block', () => {
			const existingState = {
				...initialState,
				blocks: {
					'test-block-123': {
						clientId: 'client-123',
						blockRoot: 'old-root',
					},
				},
			};

			const action = {
				type: 'UPDATE_BLOCK_STYLES_ROOT',
				uniqueID: 'test-block-123',
				blockRoot: 'new-root',
			};

			const state = reducer(existingState, action);

			expect(state.blocks['test-block-123'].blockRoot).toBe('new-root');
			expect(state.blocks['test-block-123'].clientId).toBe('client-123');
		});
	});

	describe('ADD_NEW_BLOCK action', () => {
		it('Should add a block uniqueID to newBlocksUniqueIDs array', () => {
			const action = {
				type: 'ADD_NEW_BLOCK',
				uniqueID: 'test-block-123',
			};

			const state = reducer(initialState, action);

			expect(state.newBlocksUniqueIDs).toContain('test-block-123');
		});
	});

	describe('ADD_BLOCK_WITH_UPDATED_ATTRIBUTES action', () => {
		it('Should add clientId to blockClientIdsWithUpdatedAttributes array', () => {
			const action = {
				type: 'ADD_BLOCK_WITH_UPDATED_ATTRIBUTES',
				clientId: 'client-123',
			};

			const state = reducer(initialState, action);

			expect(state.blockClientIdsWithUpdatedAttributes).toContain(
				'client-123'
			);
		});

		it('Should return original state if clientId is not provided', () => {
			const action = {
				type: 'ADD_BLOCK_WITH_UPDATED_ATTRIBUTES',
				clientId: null,
			};

			const state = reducer(initialState, action);

			expect(state).toBe(initialState);
		});
	});

	describe('SAVE_LAST_INSERTED_BLOCKS action', () => {
		it('Should save newly inserted blocks', () => {
			const existingState = {
				...initialState,
				blockClientIds: ['client-1', 'client-2'],
			};

			const action = {
				type: 'SAVE_LAST_INSERTED_BLOCKS',
				allClientIds: ['client-1', 'client-2', 'client-3', 'client-4'],
				isCurrentPostClean: false,
			};

			const state = reducer(existingState, action);

			expect(state.lastInsertedBlocks).toEqual(['client-3', 'client-4']);
		});

		it('Should return original state if post is clean', () => {
			const existingState = {
				...initialState,
				blockClientIds: ['client-1', 'client-2'],
			};

			const action = {
				type: 'SAVE_LAST_INSERTED_BLOCKS',
				allClientIds: ['client-1', 'client-2', 'client-3'],
				isCurrentPostClean: true,
			};

			const state = reducer(existingState, action);

			expect(state).toBe(existingState);
		});
	});

	describe('SAVE_BLOCK_CLIENT_IDS action', () => {
		it('Should save block client IDs', () => {
			const action = {
				type: 'SAVE_BLOCK_CLIENT_IDS',
				blockClientIds: ['client-1', 'client-2', 'client-3'],
			};

			const state = reducer(initialState, action);

			expect(state.blockClientIds).toEqual([
				'client-1',
				'client-2',
				'client-3',
			]);
		});
	});
});
