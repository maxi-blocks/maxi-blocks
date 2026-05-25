import getRowInnerBlocksSettings from '@blocks/row-maxi/getRowInnerBlocksSettings';

describe('getRowInnerBlocksSettings', () => {
	it('keeps populated rows insertable so column-maxi remains available inside rows', () => {
		const settings = getRowInnerBlocksSettings({
			allowedBlocks: ['maxi-blocks/column-maxi'],
			hasInnerBlocks: true,
			renderEmptyAppender: jest.fn(),
		});

		expect(settings).toEqual({
			templateLock: false,
			allowedBlocks: ['maxi-blocks/column-maxi'],
			orientation: 'horizontal',
			renderAppender: false,
		});
	});

	it('preserves the empty row appender for initial column layout selection', () => {
		const renderEmptyAppender = jest.fn();

		const settings = getRowInnerBlocksSettings({
			allowedBlocks: ['maxi-blocks/column-maxi'],
			hasInnerBlocks: false,
			renderEmptyAppender,
		});

		expect(settings).toEqual({
			templateLock: false,
			allowedBlocks: ['maxi-blocks/column-maxi'],
			orientation: 'horizontal',
			renderAppender: renderEmptyAppender,
		});
	});
});
