/**
 * Internal dependencies
 */
import { getDisallowedRepeaterBlocksFromClientId } from '@extensions/repeater/disallowedBlocks';

const createBlockEditor = ({ order = {}, names = {} }) => ({
	getBlockOrder: clientId => order[clientId] || [],
	getBlockName: clientId => names[clientId],
});

describe('getDisallowedRepeaterBlocksFromClientId', () => {
	it('returns an empty array when a row only contains supported blocks', () => {
		const blockEditor = createBlockEditor({
			order: {
				row: ['column-1', 'column-2', 'column-3', 'column-4'],
				'column-1': ['icon-1'],
			},
			names: {
				'column-1': 'maxi-blocks/column-maxi',
				'column-2': 'maxi-blocks/column-maxi',
				'column-3': 'maxi-blocks/column-maxi',
				'column-4': 'maxi-blocks/column-maxi',
				'icon-1': 'maxi-blocks/svg-icon-maxi',
			},
		});

		expect(getDisallowedRepeaterBlocksFromClientId('row', blockEditor)).toEqual(
			[]
		);
	});

	it('returns unique unsupported block names from nested row contents', () => {
		const blockEditor = createBlockEditor({
			order: {
				row: ['column-1', 'column-2'],
				'column-1': ['search-1'],
				'column-2': ['group-1'],
				'group-1': ['map-1', 'search-2'],
			},
			names: {
				'column-1': 'maxi-blocks/column-maxi',
				'column-2': 'maxi-blocks/column-maxi',
				'group-1': 'maxi-blocks/group-maxi',
				'map-1': 'maxi-blocks/map-maxi',
				'search-1': 'maxi-blocks/search-maxi',
				'search-2': 'maxi-blocks/search-maxi',
			},
		});

		expect(getDisallowedRepeaterBlocksFromClientId('row', blockEditor)).toEqual(
			['maxi-blocks/search-maxi', 'maxi-blocks/map-maxi']
		);
	});
});
