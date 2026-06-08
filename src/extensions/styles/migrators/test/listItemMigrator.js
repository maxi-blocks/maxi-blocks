/**
 * WordPress dependencies
 */
import { createBlock } from '@wordpress/blocks';

/**
 * Internal dependencies
 */
import listItemMigrator from '../listItemMigrator';
import uniqueIDGenerator from '@extensions/attributes/uniqueIDGenerator';
import getCustomLabel from '@extensions/maxi-block/getCustomLabel';

jest.mock('@wordpress/blocks', () => ({
	createBlock: jest.fn((name, attributes) => ({
		name,
		attributes,
		innerBlocks: [],
	})),
}));

jest.mock('@wordpress/block-editor', () => ({
	RichText: {
		Content: jest.fn(() => null),
	},
}));

jest.mock('@components/maxi-block', () => ({
	getMaxiBlockAttributes: jest.fn(() => ({})),
	MaxiBlock: {
		save: jest.fn(({ children }) => children),
	},
}));

let mockGeneratedIdCount = 0;

jest.mock('@extensions/attributes/uniqueIDGenerator', () =>
	jest.fn(({ blockName }) => {
		mockGeneratedIdCount += 1;
		return `${blockName.replace('maxi-blocks/', '')}-${mockGeneratedIdCount}-u`;
	})
);

jest.mock('@extensions/maxi-block/getCustomLabel', () =>
	jest.fn((previousCustomLabel, uniqueID) =>
		previousCustomLabel || `List-item_${uniqueID}`
	)
);

describe('listItemMigrator', () => {
	beforeEach(() => {
		mockGeneratedIdCount = 0;
		jest.clearAllMocks();
	});

	it('adds Maxi identity attributes to migrated list item blocks', () => {
		const attributes = {
			isList: true,
			content:
				'<li>Lorem ipsum dolor</li><br><li><span>Integer vitae</span></li>',
		};

		const [, innerBlocks] = listItemMigrator.migrate(attributes);

		expect(innerBlocks).toHaveLength(2);
		expect(uniqueIDGenerator).toHaveBeenCalledTimes(2);
		expect(uniqueIDGenerator).toHaveBeenNthCalledWith(1, {
			blockName: 'maxi-blocks/list-item-maxi',
		});
		expect(getCustomLabel).toHaveBeenCalledTimes(2);
		expect(createBlock).toHaveBeenNthCalledWith(
			1,
			'maxi-blocks/list-item-maxi',
			{
				content: 'Lorem ipsum dolor',
				customLabel: 'List-item_list-item-maxi-1-u',
				uniqueID: 'list-item-maxi-1-u',
			}
		);
		expect(createBlock).toHaveBeenNthCalledWith(
			2,
			'maxi-blocks/list-item-maxi',
			{
				content: '<span>Integer vitae</span>',
				customLabel: 'List-item_list-item-maxi-2-u',
				uniqueID: 'list-item-maxi-2-u',
			}
		);
	});
});
