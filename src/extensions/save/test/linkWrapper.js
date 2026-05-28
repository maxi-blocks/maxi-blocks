import { shouldWrapWithLink } from '../linkWrapper';

const allowedBlocks = [
	'maxi-blocks/svg-icon-maxi',
	'maxi-blocks/image-maxi',
	'maxi-blocks/pane-maxi',
];

describe('save link wrapper', () => {
	it('wraps the canvas when a block has no element-specific link target', () => {
		expect(
			shouldWrapWithLink({
				blockName: 'maxi-blocks/image-maxi',
				allowedBlocks,
			})
		).toBe(true);
		expect(
			shouldWrapWithLink({
				blockName: 'maxi-blocks/pane-maxi',
				allowedBlocks,
			})
		).toBe(true);
	});

	it('does not wrap the canvas when an element-specific link target is selected', () => {
		expect(
			shouldWrapWithLink({
				blockName: 'maxi-blocks/svg-icon-maxi',
				allowedBlocks,
				linkElements: ['svg', 'canvas'],
				linkSettings: { linkElement: 'svg' },
			})
		).toBe(false);
	});

	it('wraps the canvas when the canvas link target is selected', () => {
		expect(
			shouldWrapWithLink({
				blockName: 'maxi-blocks/svg-icon-maxi',
				allowedBlocks,
				linkElements: ['svg', 'canvas'],
				linkSettings: { linkElement: 'canvas' },
			})
		).toBe(true);
	});
});
