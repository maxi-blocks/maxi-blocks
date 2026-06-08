import { shouldWrapWithLink } from '../linkWrapper';

const allowedBlocks = [
	'maxi-blocks/image-maxi',
	'maxi-blocks/pane-maxi',
	'maxi-blocks/button-maxi',
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

	it('does not wrap when an element-specific link target is selected', () => {
		expect(
			shouldWrapWithLink({
				blockName: 'maxi-blocks/button-maxi',
				allowedBlocks,
				linkElements: ['button', 'canvas'],
				linkSettings: { linkElement: 'button' },
			})
		).toBe(false);
	});

	it('wraps the canvas when the canvas link target is selected', () => {
		expect(
			shouldWrapWithLink({
				blockName: 'maxi-blocks/button-maxi',
				allowedBlocks,
				linkElements: ['button', 'canvas'],
				linkSettings: { linkElement: 'canvas' },
			})
		).toBe(true);
	});

	it('does not wrap blocks not in allowedBlocks', () => {
		expect(
			shouldWrapWithLink({
				blockName: 'maxi-blocks/svg-icon-maxi',
				allowedBlocks,
			})
		).toBe(false);
	});
});
