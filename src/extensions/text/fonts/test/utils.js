import { getAllFonts } from '..';

// Return mock values from style cards
jest.mock('src/extensions/text/formats/index.js', () => ({
	getCustomFormatValue: jest.fn(({ prop }) => {
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
jest.mock('@wordpress/data', () => {
	return {
		select: jest.fn(() => {
			return {
				receiveMaxiSelectedStyleCard: jest.fn(() => {}),
			};
		}),
	};
});
jest.mock('src/extensions/styles/index.js', () => {
	return {
		getGroupAttributes: jest.fn(() => {}),
	};
});
jest.mock('src/extensions/maxi-block/index', () => {
	return {
		goThroughMaxiBlocks: jest.fn(() => {}),
	};
});

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
