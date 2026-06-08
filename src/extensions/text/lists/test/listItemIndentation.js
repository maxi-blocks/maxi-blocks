import {
	appendBlocksToListItem,
	canIndentListItem,
	canOutdentListItem,
	getNestedListAttributes,
	getParentListItemClientId,
	LIST_ITEM_BLOCK,
	TEXT_BLOCK,
} from '../listItemIndentation';

describe('list item indentation helpers', () => {
	const createSelectors = overrides => ({
		getBlockName: jest.fn(),
		getBlockRootClientId: jest.fn(),
		getBlockIndex: jest.fn(),
		...overrides,
	});

	it('detects a nested Maxi list item parent for outdent checks', () => {
		const selectors = createSelectors({
			getBlockRootClientId: jest.fn(id => {
				if (id === 'child-item') return 'nested-list';
				if (id === 'nested-list') return 'parent-item';
				return null;
			}),
			getBlockName: jest.fn(id => {
				if (id === 'child-item') return LIST_ITEM_BLOCK;
				if (id === 'parent-item') return LIST_ITEM_BLOCK;
				if (id === 'nested-list') return TEXT_BLOCK;
				return null;
			}),
		});

		expect(getParentListItemClientId(selectors, 'child-item')).toBe(
			'parent-item'
		);
		expect(canOutdentListItem(selectors, 'child-item')).toBe(true);
	});

	it('does not treat core list items as Maxi list item parents', () => {
		const selectors = createSelectors({
			getBlockRootClientId: jest.fn(id =>
				id === 'child-item' ? 'nested-list' : 'core-parent-item'
			),
			getBlockName: jest.fn(id =>
				id === 'core-parent-item' ? 'core/list-item' : TEXT_BLOCK
			),
		});

		expect(getParentListItemClientId(selectors, 'child-item')).toBeNull();
		expect(canOutdentListItem(selectors, 'child-item')).toBe(false);
	});

	it('allows indenting only a Maxi list item with a previous sibling', () => {
		const selectors = createSelectors({
			getBlockName: jest.fn(id =>
				id === 'second-item' ? LIST_ITEM_BLOCK : 'maxi-blocks/text-maxi'
			),
			getBlockIndex: jest.fn(id => (id === 'second-item' ? 1 : 0)),
		});

		expect(canIndentListItem(selectors, 'second-item')).toBe(true);
		expect(canIndentListItem(selectors, 'paragraph')).toBe(false);
	});

	it('creates nested list attributes without duplicating identity or content', () => {
		expect(
			getNestedListAttributes({
				uniqueID: 'text-maxi-1',
				content: '<li>Parent</li>',
				isList: true,
				typeOfList: 'ol',
				listStart: 7,
				listReversed: true,
				listStyle: 'custom',
				listStyleCustom: '*',
				blockStyle: 'dark',
				'list-marker-size-general': 2,
				'list-marker-size-unit-general': 'em',
			})
		).toEqual({
			isList: true,
			typeOfList: 'ol',
			listStyle: 'custom',
			listStyleCustom: '*',
			blockStyle: 'dark',
			'list-marker-size-general': 2,
			'list-marker-size-unit-general': 'em',
		});
	});

	it('appends indented blocks to the last nested Text Maxi list', () => {
		const movedBlock = {
			clientId: 'moved-item',
			name: LIST_ITEM_BLOCK,
			attributes: { content: 'Moved' },
			innerBlocks: [],
		};
		const previousListItem = {
			clientId: 'previous-item',
			name: LIST_ITEM_BLOCK,
			attributes: { content: 'Previous' },
			innerBlocks: [
				{
					clientId: 'existing-list',
					name: TEXT_BLOCK,
					attributes: { isList: true, typeOfList: 'ul' },
					innerBlocks: [
						{
							clientId: 'existing-child',
							name: LIST_ITEM_BLOCK,
							attributes: { content: 'Existing' },
							innerBlocks: [],
						},
					],
				},
			],
		};

		const result = appendBlocksToListItem({
			listItemBlock: previousListItem,
			blocks: [movedBlock],
			createBlock: jest.fn(),
			parentListAttributes: { typeOfList: 'ul' },
		});

		expect(result.innerBlocks[0].innerBlocks).toEqual([
			previousListItem.innerBlocks[0].innerBlocks[0],
			movedBlock,
		]);
		expect(previousListItem.innerBlocks[0].innerBlocks).toHaveLength(1);
	});

	it('creates a nested Text Maxi list when indenting under a plain item', () => {
		const createBlock = jest.fn((name, attributes) => ({
			clientId: 'created-list',
			name,
			attributes,
			innerBlocks: [],
		}));
		const movedBlock = {
			clientId: 'moved-item',
			name: LIST_ITEM_BLOCK,
			attributes: { content: 'Moved' },
			innerBlocks: [],
		};

		const result = appendBlocksToListItem({
			listItemBlock: {
				clientId: 'previous-item',
				name: LIST_ITEM_BLOCK,
				attributes: { content: 'Previous' },
				innerBlocks: [],
			},
			blocks: [movedBlock],
			createBlock,
			parentListAttributes: {
				typeOfList: 'ol',
				listStyle: 'custom',
				listStyleCustom: '*',
			},
		});

		expect(createBlock).toHaveBeenCalledWith(TEXT_BLOCK, {
			isList: true,
			typeOfList: 'ol',
			listStyle: 'custom',
			listStyleCustom: '*',
		});
		expect(result.innerBlocks[0].innerBlocks).toEqual([movedBlock]);
	});
});
