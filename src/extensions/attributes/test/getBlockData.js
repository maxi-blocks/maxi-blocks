import getBlockData from '@extensions/attributes/getBlockData';

// Mock the blocks data
jest.mock('@blocks/data', () => ({
	textMaxi: {
		name: 'text-maxi',
		title: 'Text Maxi',
		description: 'A text block',
	},
	buttonMaxi: {
		name: 'button-maxi',
		title: 'Button Maxi',
		description: 'A button block',
	},
}));

describe('getBlockData', () => {
	it('Should return block data for valid block name', () => {
		const data = getBlockData('maxi-blocks/text-maxi');
		expect(data).toEqual({
			name: 'text-maxi',
			title: 'Text Maxi',
			description: 'A text block',
		});
	});

	it('Should return block data for another valid block name', () => {
		const data = getBlockData('maxi-blocks/button-maxi');
		expect(data).toEqual({
			name: 'button-maxi',
			title: 'Button Maxi',
			description: 'A button block',
		});
	});

	it('Should return empty object for invalid block name', () => {
		const data = getBlockData('maxi-blocks/nonexistent-block');
		expect(data).toEqual({});
	});

	it('Should return empty object for non-maxi block name', () => {
		const data = getBlockData('core/paragraph');
		expect(data).toEqual({});
	});
});
