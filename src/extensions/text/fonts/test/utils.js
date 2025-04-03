import { getAllFonts, getPageFonts } from '@extensions/text/fonts/utils';
import { getGroupAttributes } from '@extensions/styles';
import { goThroughMaxiBlocks } from '@extensions/maxi-block';

// Return mock values from style cards
jest.mock('src/extensions/text/formats/index.js', () => ({
	getCustomFormatValue: jest.fn(({ prop, styleCard, textLevel }) => {
		if (styleCard) {
			return styleCard.typography[textLevel][prop];
		}

		switch (prop) {
			case 'font-family':
				return 'Roboto';
			case 'font-weight':
				return 400;
			case 'font-style':
				return 'normal';
			default:
				return '';
		}
	}),
}));

jest.mock('@wordpress/data', () => ({
	select: jest.fn(store => {
		if (store === 'maxiBlocks/style-cards') {
			return {
				receiveMaxiSelectedStyleCard: jest.fn(() => ({
					value: {
						typography: {
							p: {
								'font-family': 'Roboto',
								'font-weight': 400,
								'font-style': 'normal',
							},
							h1: {
								'font-family': 'Arial',
								'font-weight': 700,
								'font-style': 'normal',
							},
							button: {
								'font-family': 'Helvetica',
								'font-weight': 500,
								'font-style': 'normal',
							},
						},
					},
				})),
				receiveMaxiActiveStyleCard: jest.fn(() => ({
					value: {
						gutenberg_blocks_status: true,
					},
				})),
			};
		}
		if (store === 'maxiBlocks/text') {
			return {
				getFont: jest.fn(() => ({
					files: {
						400: 'regular',
						700: 'bold',
						'400italic': 'italic',
					},
				})),
			};
		}
		if (store === 'core/block-editor') {
			return {
				getBlockParents: jest.fn(() => ['parent-1']),
				getBlockName: jest.fn(clientId => {
					if (clientId === 'parent-1') return 'maxi-blocks/text-maxi';
					return '';
				}),
			};
		}
		return {};
	}),
	dispatch: jest.fn(),
}));

jest.mock('src/extensions/styles/index.js', () => ({
	getGroupAttributes: jest.fn((attributes, group, recursive, prefix) => {
		if (group === 'typography') {
			if (prefix === 'cl-pagination-') {
				return {
					'cl-pagination-font-family-general': 'Poppins',
					'cl-pagination-font-weight-general': '500',
					'cl-pagination-font-style-general': 'normal',
				};
			}
			if (prefix === 'title-') {
				return {
					'title-font-family-general': 'Merriweather',
					'title-font-weight-general': '700',
					'title-font-style-general': 'normal',
				};
			}
			if (prefix === 'active-title-') {
				return {
					'active-title-font-family-general': 'Merriweather',
					'active-title-font-weight-general': '700',
					'active-title-font-style-general': 'italic',
				};
			}
			return {
				'font-family-general': 'Montserrat',
				'font-weight-general': '400',
				'font-style-general': 'normal',
			};
		}
		if (group === 'typographyHover') {
			if (prefix === 'title-') {
				return {
					'title-typography-status-hover': true,
					'title-font-family-hover-general': 'Merriweather',
					'title-font-weight-hover-general': '700',
					'title-font-style-hover-general': 'italic',
				};
			}
			return {
				'typography-status-hover': true,
				'font-family-hover-general': 'Open Sans',
				'font-weight-hover-general': '600',
				'font-style-hover-general': 'italic',
			};
		}
		if (group === 'numberCounter') {
			return {
				'font-family-general': 'Oswald',
				'font-weight-general': '500',
				'font-style-general': 'normal',
			};
		}
		return {};
	}),
}));

jest.mock('src/extensions/maxi-block/index.js', () => ({
	goThroughMaxiBlocks: jest.fn(callback => {
		const mockBlocks = [
			{
				clientId: 'text-block',
				name: 'maxi-blocks/text-maxi',
				attributes: {
					textLevel: 'p',
					blockStyle: 'light',
				},
			},
			{
				clientId: 'button-block',
				name: 'maxi-blocks/button-maxi',
				attributes: {
					textLevel: 'p',
					blockStyle: 'light',
				},
			},
			{
				clientId: 'accordion-block',
				name: 'maxi-blocks/accordion-maxi',
				attributes: {
					textLevel: 'p',
					blockStyle: 'light',
				},
			},
			{
				clientId: 'core-button',
				name: 'core/button',
				attributes: {},
			},
			{
				clientId: 'core-heading',
				name: 'core/heading',
				attributes: {
					level: 1,
				},
			},
			{
				clientId: 'core-paragraph',
				name: 'core/paragraph',
				attributes: {},
			},
		];

		mockBlocks.forEach(block => callback(block));
	}),
}));

describe('getAllFonts', () => {
	it('Should return an object with all fonts', () => {
		const attributes = {
			'font-family-general': 'Arial',
			'font-weight-general': '600',
			'font-style-general': 'italic',
		};
		const result = getAllFonts(attributes);
		expect(result).toEqual({
			Arial: {
				weight: '600',
				style: 'italic',
			},
		});
	});

	it('Should fallback to SC when no font is set', () => {
		const attributes = {};
		const result = getAllFonts(attributes);
		expect(result).toEqual({
			Roboto: {
				weight: '400',
				style: 'normal',
			},
		});
	});

	it('Should return an object with all fonts on responsive', () => {
		const attributes = {
			'font-family-general': 'Arial',
			'font-family-xxl': 'Arial Black',
			'font-family-m': 'Roboto',
		};
		const result = getAllFonts(attributes);
		expect(result).toEqual({
			Arial: {
				weight: '400',
				style: 'normal',
			},
			'Arial Black': {
				weight: undefined,
				style: undefined,
			},
			Roboto: {
				weight: undefined,
				style: undefined,
			},
		});
	});

	it('Should work with custom formats', () => {
		const attributes = {
			'font-family-general': 'Railway',
			'custom-formats': {
				'custom-format--1': {
					'font-family-general': 'Oswald',
				},
			},
		};
		const result = getAllFonts(attributes, 'custom-formats');
		expect(result).toEqual({
			Railway: {
				weight: '400',
				style: 'normal',
			},
			Oswald: {
				weight: '400',
				style: 'normal',
			},
		});
	});
});

describe('getPageFonts', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('Should get fonts from text block (typography without hover status)', () => {
		goThroughMaxiBlocks.mockImplementationOnce(callback => {
			const mockBlock = {
				clientId: 'text-block',
				name: 'maxi-blocks/text-maxi',
				attributes: {
					textLevel: 'p',
					blockStyle: 'light',
				},
			};
			callback(mockBlock);
		});

		getGroupAttributes
			.mockImplementationOnce(() => ({
				'font-family-general': 'Montserrat',
				'font-weight-general': '400',
				'font-style-general': 'normal',
			}))
			.mockImplementationOnce(() => ({
				'typography-status-hover': false,
			}));

		const result = getPageFonts();

		expect(result).toEqual({
			Montserrat: {
				weight: '400',
				style: 'normal',
			},
		});
	});

	it('Should get fonts from accordion block (with typography hover status)', () => {
		goThroughMaxiBlocks.mockImplementationOnce(callback => {
			const mockBlock = {
				clientId: 'accordion-block',
				name: 'maxi-blocks/accordion-maxi',
				attributes: {
					textLevel: 'p',
					blockStyle: 'light',
				},
			};
			callback(mockBlock);
		});

		const result = getPageFonts();

		expect(result).toEqual({
			Merriweather: {
				weight: '700',
				style: 'italic',
			},
			// From style cards
			Roboto: {
				weight: '400',
				style: 'normal',
			},
		});

		expect(getGroupAttributes).toHaveBeenCalledWith(
			expect.anything(),
			'typography',
			false,
			'title-'
		);
		expect(getGroupAttributes).toHaveBeenCalledWith(
			expect.anything(),
			'typography',
			false,
			'active-title-'
		);
		expect(getGroupAttributes).toHaveBeenCalledWith(
			expect.anything(),
			'typographyHover',
			false,
			'title-'
		);
	});

	it('Should get fonts from gutenberg blocks', () => {
		goThroughMaxiBlocks.mockImplementationOnce(callback => {
			const mockBlocks = [
				{
					clientId: 'core-button',
					name: 'core/button',
					attributes: {},
				},
				{
					clientId: 'core-heading',
					name: 'core/heading',
					attributes: {
						level: 1,
					},
				},
				{
					clientId: 'core-paragraph',
					name: 'core/paragraph',
					attributes: {},
				},
			];
			mockBlocks.forEach(block => callback(block));
		});

		const result = getPageFonts();

		expect(result).toEqual({
			Roboto: {
				weight: '400',
				style: 'normal',
			},
			Arial: {
				weight: '700',
				style: 'normal',
			},
			Helvetica: {
				weight: '500',
				style: 'normal',
			},
		});
	});
});
