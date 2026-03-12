import reducer from '@extensions/store/reducer';

describe('maxiBlocks store reducer', () => {
	it('removes deprecated block data from both stores', () => {
		const state = reducer(
			{
				deprecatedBlocks: {
					block1: { foo: 'bar' },
					block2: { baz: 'qux' },
				},
				deprecatedBlocksSave: {
					block1: { foo: 'bar' },
					block2: { baz: 'qux' },
				},
			},
			{
				type: 'REMOVE_DEPRECATED_BLOCK',
				uniqueID: 'block1',
			}
		);

		expect(state.deprecatedBlocks.block1).toBeUndefined();
		expect(state.deprecatedBlocksSave.block1).toBeUndefined();
		expect(state.deprecatedBlocks.block2).toEqual({ baz: 'qux' });
		expect(state.deprecatedBlocksSave.block2).toEqual({ baz: 'qux' });
	});
});
