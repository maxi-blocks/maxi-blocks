import { restrictColumnMaxiToRow } from '@extensions/inserter/columnMaxiParentGuard';

const createGetBlock =
	(blocks = {}) =>
	clientId =>
		blocks[clientId];

describe('restrictColumnMaxiToRow', () => {
	it('allows column-maxi when the insertion root is a row-maxi block', () => {
		const result = restrictColumnMaxiToRow({
			canInsert: true,
			blockName: 'maxi-blocks/column-maxi',
			rootClientId: 'row-client-id',
			getBlock: createGetBlock({
				'row-client-id': { name: 'maxi-blocks/row-maxi' },
			}),
		});

		expect(result).toBe(true);
	});

	it.each([
		{
			label: 'container root',
			rootClientId: 'container-client-id',
			rootBlockName: 'maxi-blocks/container-maxi',
		},
		{
			label: 'column root',
			rootClientId: 'column-client-id',
			rootBlockName: 'maxi-blocks/column-maxi',
		},
		{
			label: 'group root',
			rootClientId: 'group-client-id',
			rootBlockName: 'maxi-blocks/group-maxi',
		},
		{
			label: 'slide root',
			rootClientId: 'slide-client-id',
			rootBlockName: 'maxi-blocks/slide-maxi',
		},
		{
			label: 'another root',
			rootClientId: 'button-client-id',
			rootBlockName: 'maxi-blocks/button-maxi',
		},
	])('denies column-maxi for $label', ({ rootClientId, rootBlockName }) => {
		const result = restrictColumnMaxiToRow({
			canInsert: true,
			blockName: 'maxi-blocks/column-maxi',
			rootClientId,
			getBlock: createGetBlock({
				[rootClientId]: { name: rootBlockName },
			}),
		});

		expect(result).toBe(false);
	});

	it.each([true, false])(
		'leaves column-maxi unchanged when there is no insertion root and canInsert is %s',
		canInsert => {
			const result = restrictColumnMaxiToRow({
				canInsert,
				blockName: 'maxi-blocks/column-maxi',
				rootClientId: null,
				getBlock: createGetBlock(),
			});

			expect(result).toBe(canInsert);
		}
	);

	it('denies column-maxi when the insertion root cannot be resolved', () => {
		const result = restrictColumnMaxiToRow({
			canInsert: true,
			blockName: 'maxi-blocks/column-maxi',
			rootClientId: 'missing-client-id',
			getBlock: createGetBlock(),
		});

		expect(result).toBe(false);
	});

	it('keeps column-maxi denied when the original selector denied insertion', () => {
		const result = restrictColumnMaxiToRow({
			canInsert: false,
			blockName: 'maxi-blocks/column-maxi',
			rootClientId: 'row-client-id',
			getBlock: createGetBlock({
				'row-client-id': { name: 'maxi-blocks/row-maxi' },
			}),
		});

		expect(result).toBe(false);
	});

	it.each([true, false])(
		'leaves non-column blocks unchanged when canInsert is %s',
		canInsert => {
			const result = restrictColumnMaxiToRow({
				canInsert,
				blockName: 'maxi-blocks/text-maxi',
				rootClientId: 'container-client-id',
				getBlock: createGetBlock({
					'container-client-id': {
						name: 'maxi-blocks/container-maxi',
					},
				}),
			});

			expect(result).toBe(canInsert);
		}
	);
});
