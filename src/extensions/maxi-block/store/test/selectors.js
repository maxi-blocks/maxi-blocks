import selectors from '@extensions/maxi-block/store/selectors';

describe('maxi-block selectors', () => {
	describe('getBlocks', () => {
		it('Should return blocks from state', () => {
			const state = { blocks: { 'block-1': {} } };
			expect(selectors.getBlocks(state)).toEqual({ 'block-1': {} });
		});

		it('Should return false if state is undefined', () => {
			expect(selectors.getBlocks(undefined)).toBe(false);
		});
	});

	describe('getBlock', () => {
		it('Should return block by uniqueID', () => {
			const state = { blocks: { 'block-1': { id: 1 } } };
			expect(selectors.getBlock(state, 'block-1')).toEqual({ id: 1 });
		});

		it('Should return false if state or uniqueID is undefined', () => {
			expect(selectors.getBlock(undefined, 'block-1')).toBe(false);
			expect(selectors.getBlock({ blocks: {} }, undefined)).toBe(false);
		});
	});

	describe('getBlockRoot', () => {
		it('Should return block root', () => {
			const state = { blocks: { 'block-1': { blockRoot: true } } };
			expect(selectors.getBlockRoot(state, 'block-1')).toBe(true);
		});

		it('Should return false if state or uniqueID is undefined', () => {
			expect(selectors.getBlockRoot(undefined, 'block-1')).toBe(false);
			expect(selectors.getBlockRoot({ blocks: {} }, undefined)).toBe(
				false
			);
		});
	});

	describe('getIsNewBlock', () => {
		it('Should return true if block is new', () => {
			const state = { newBlocksUniqueIDs: ['block-1'] };
			expect(selectors.getIsNewBlock(state, 'block-1')).toBe(true);
		});

		it('Should return false if block is not new', () => {
			const state = { newBlocksUniqueIDs: ['block-1'] };
			expect(selectors.getIsNewBlock(state, 'block-2')).toBe(false);
		});
	});

	describe('getIsBlockWithUpdatedAttributes', () => {
		it('Should return true if block has updated attributes', () => {
			const state = { blockClientIdsWithUpdatedAttributes: ['client-1'] };
			expect(
				selectors.getIsBlockWithUpdatedAttributes(state, 'client-1')
			).toBe(true);
		});

		it('Should return false if block has no updated attributes', () => {
			const state = { blockClientIdsWithUpdatedAttributes: ['client-1'] };
			expect(
				selectors.getIsBlockWithUpdatedAttributes(state, 'client-2')
			).toBe(false);
		});
	});

	describe('getLastInsertedBlocks', () => {
		it('Should return last inserted blocks', () => {
			const state = { lastInsertedBlocks: ['block-1', 'block-2'] };
			expect(selectors.getLastInsertedBlocks(state)).toEqual([
				'block-1',
				'block-2',
			]);
		});

		it('Should return false if state is undefined', () => {
			expect(selectors.getLastInsertedBlocks(undefined)).toBe(false);
		});
	});

	describe('getBlockClientIds', () => {
		it('Should return block client IDs', () => {
			const state = { blockClientIds: ['client-1', 'client-2'] };
			expect(selectors.getBlockClientIds(state)).toEqual([
				'client-1',
				'client-2',
			]);
		});

		it('Should return false if state is undefined', () => {
			expect(selectors.getBlockClientIds(undefined)).toBe(false);
		});
	});

	describe('getBlockByClientId', () => {
		it('Should return block by clientId', () => {
			const state = {
				blocks: {
					'block-1': { clientId: 'client-1' },
					'block-2': { clientId: 'client-2' },
				},
			};

			const result = selectors.getBlockByClientId(state, 'client-1');

			expect(result).toEqual({ clientId: 'client-1' });
		});

		it('Should return false if state is undefined', () => {
			const result = selectors.getBlockByClientId(undefined, 'client-1');
			expect(result).toBe(false);
		});

		it('Should return false if clientId is undefined', () => {
			const state = {
				blocks: {
					'block-1': { clientId: 'client-1' },
				},
			};

			const result = selectors.getBlockByClientId(state, undefined);
			expect(result).toBe(false);
		});

		it('Should return false if block with clientId does not exist', () => {
			const state = {
				blocks: {
					'block-1': { clientId: 'client-1' },
				},
			};

			const result = selectors.getBlockByClientId(state, 'non-existent');
			expect(result).toBe(false);
		});
	});
});
