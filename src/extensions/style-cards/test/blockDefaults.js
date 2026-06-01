import {
	applySCBlockDefaultsToAttributes,
	getBlockDefaultKey,
	getStyleCardBlockDefaultVariables,
} from '@extensions/style-cards/blockDefaults';

const sizeDefaults = {
	'max-width-xl': {},
	'max-width-unit-xl': {
		default: 'px',
	},
	'full-width-xl': {
		default: false,
	},
	'width-fit-content-xl': {
		default: false,
	},
	'width-xl': {},
	'width-unit-xl': {
		default: 'px',
	},
};

const getStyleCard = blockDefaults => ({
	light: {
		defaultStyleCard: {
			blockDefaults: {},
		},
		styleCard: {
			blockDefaults,
		},
	},
	dark: {
		defaultStyleCard: {
			blockDefaults: {},
		},
		styleCard: {
			blockDefaults: {},
		},
	},
});

describe('Style Card block defaults', () => {
	it('applies Style Card row max-width when the block still has shipped defaults', () => {
		const result = applySCBlockDefaultsToAttributes({
			response: {
				'max-width-xl': '1170',
				'max-width-unit-xl': 'px',
			},
			attributes: {
				uniqueID: 'row-maxi-test-u',
				blockStyle: 'light',
				'max-width-xl': '1170',
				'max-width-unit-xl': 'px',
			},
			defaultAttributes: sizeDefaults,
			styleCard: getStyleCard({
				[getBlockDefaultKey('row-maxi', 'max-width-xl')]: '1280',
				[getBlockDefaultKey('row-maxi', 'max-width-unit-xl')]: 'px',
			}),
		});

		expect(result['max-width-xl']).toBe('1280');
		expect(result['max-width-unit-xl']).toBe('px');
		expect(result.__scBlockDefaults['max-width-xl']).toEqual({
			blockName: 'row-maxi',
			blockStyle: 'light',
			cssVar: '--maxi-light-block-default-row-maxi-max-width-xl',
			fallback: '1170px',
		});
	});

	it('keeps custom row max-width values', () => {
		const result = applySCBlockDefaultsToAttributes({
			response: {
				'max-width-xl': '900',
				'max-width-unit-xl': 'px',
			},
			attributes: {
				uniqueID: 'row-maxi-test-u',
				blockStyle: 'light',
				'max-width-xl': '900',
				'max-width-unit-xl': 'px',
			},
			defaultAttributes: sizeDefaults,
			styleCard: getStyleCard({
				[getBlockDefaultKey('row-maxi', 'max-width-xl')]: '1280',
				[getBlockDefaultKey('row-maxi', 'max-width-unit-xl')]: 'px',
			}),
		});

		expect(result['max-width-xl']).toBe('900');
		expect(result.__scBlockDefaults).toBeUndefined();
	});

	it('marks shipped defaults with CSS variable metadata before an override exists', () => {
		const result = applySCBlockDefaultsToAttributes({
			response: {
				'max-width-xl': '1170',
				'max-width-unit-xl': 'px',
			},
			attributes: {
				uniqueID: 'row-maxi-test-u',
				blockStyle: 'light',
				'max-width-xl': '1170',
				'max-width-unit-xl': 'px',
			},
			defaultAttributes: sizeDefaults,
			styleCard: getStyleCard({}),
		});

		expect(result['max-width-xl']).toBe('1170');
		expect(result.__scBlockDefaults['max-width-xl']).toEqual({
			blockName: 'row-maxi',
			blockStyle: 'light',
			cssVar: '--maxi-light-block-default-row-maxi-max-width-xl',
			fallback: '1170px',
		});
	});

	it('does not override full-width rows', () => {
		const result = applySCBlockDefaultsToAttributes({
			response: {
				'max-width-xl': '1170',
				'max-width-unit-xl': 'px',
				'full-width-xl': true,
			},
			attributes: {
				uniqueID: 'row-maxi-test-u',
				blockStyle: 'light',
				'max-width-xl': '1170',
				'max-width-unit-xl': 'px',
				'full-width-xl': true,
			},
			defaultAttributes: sizeDefaults,
			styleCard: getStyleCard({
				[getBlockDefaultKey('row-maxi', 'max-width-xl')]: '1280',
				[getBlockDefaultKey('row-maxi', 'max-width-unit-xl')]: 'px',
			}),
		});

		expect(result['max-width-xl']).toBe('1170');
		expect(result.__scBlockDefaults).toBeUndefined();
	});

	it('does not override fit-content width settings', () => {
		const result = applySCBlockDefaultsToAttributes({
			response: {
				'width-xl': '500',
				'width-unit-xl': 'px',
				'width-fit-content-xl': true,
			},
			attributes: {
				uniqueID: 'button-maxi-test-u',
				blockStyle: 'light',
				'width-xl': '500',
				'width-unit-xl': 'px',
				'width-fit-content-xl': true,
			},
			defaultAttributes: sizeDefaults,
			styleCard: getStyleCard({
				[getBlockDefaultKey('button-maxi', 'width-xl')]: '620',
				[getBlockDefaultKey('button-maxi', 'width-unit-xl')]: 'px',
			}),
		});

		expect(result['width-xl']).toBe('500');
		expect(result.__scBlockDefaults).toBeUndefined();
	});

	it('generates CSS variables for stored block defaults', () => {
		const result = getStyleCardBlockDefaultVariables(
			getStyleCard({
				[getBlockDefaultKey('row-maxi', 'max-width-xl')]: '1280',
				[getBlockDefaultKey('row-maxi', 'max-width-unit-xl')]: 'px',
			})
		);

		expect(result['--maxi-light-block-default-row-maxi-max-width-xl']).toBe(
			'1280px'
		);
		expect(
			result['--maxi-light-block-default-row-maxi-max-width-unit-xl']
		).toBeUndefined();
	});
});
