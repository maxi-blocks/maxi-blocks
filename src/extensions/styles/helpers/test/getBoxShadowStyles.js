import getBoxShadowStyles from '../getBoxShadowStyles';

jest.mock('src/extensions/style-cards/getActiveStyleCard.js', () => {
	return jest.fn(() => {
		return {
			value: {
				name: 'Maxi (Default)',
				status: 'active',
				light: {
					styleCard: {},
					defaultStyleCard: {
						color: {
							1: '255,255,255',
							2: '242,249,253',
							3: '155,155,155',
							4: '255,74,23',
							5: '0,0,0',
							6: '201,52,10',
							7: '8,18,25',
							8: '150,176,203',
						},
					},
				},
			},
		};
	});
});

describe('getBoxShadowStyles', () => {
	it('Get a correct box shadow styles with values in all responsive and with custom color', () => {
		const object = {
			'box-shadow-palette-status-general': false,
			'box-shadow-color-general': 'rgb(255, 99, 71)',
			'box-shadow-horizontal-general': 1,
			'box-shadow-vertical-general': 2,
			'box-shadow-blur-general': 3,
			'box-shadow-spread-general': 4,
			'box-shadow-palette-status-xxl': false,
			'box-shadow-color-xxl': 'rgb(255, 99, 72)',
			'box-shadow-horizontal-xxl': 5,
			'box-shadow-vertical-xxl': 6,
			'box-shadow-blur-xxl': 7,
			'box-shadow-spread-xxl': 8,
			'box-shadow-palette-status-xl': false,
			'box-shadow-color-xl': 'rgb(255, 99, 73)',
			'box-shadow-horizontal-xl': 9,
			'box-shadow-vertical-xl': 10,
			'box-shadow-blur-xl': 11,
			'box-shadow-spread-xl': 12,
			'box-shadow-palette-status-l': false,
			'box-shadow-color-l': 'rgb(255, 99, 74)',
			'box-shadow-horizontal-l': 13,
			'box-shadow-vertical-l': 14,
			'box-shadow-blur-l': 15,
			'box-shadow-spread-l': 16,
			'box-shadow-palette-status-m': false,
			'box-shadow-color-m': 'rgb(255, 99, 75)',
			'box-shadow-horizontal-m': 17,
			'box-shadow-vertical-m': 18,
			'box-shadow-blur-m': 19,
			'box-shadow-spread-m': 20,
			'box-shadow-palette-status-s': false,
			'box-shadow-color-s': 'rgb(255, 99, 76)',
			'box-shadow-horizontal-s': 21,
			'box-shadow-vertical-s': 22,
			'box-shadow-blur-s': 23,
			'box-shadow-spread-s': 24,
			'box-shadow-palette-status-xs': false,
			'box-shadow-color-xs': 'rgb(255, 99, 77)',
			'box-shadow-horizontal-xs': 25,
			'box-shadow-vertical-xs': 26,
			'box-shadow-blur-xs': 27,
			'box-shadow-spread-xs': 28,
		};

		const result = getBoxShadowStyles({
			obj: object,
			parentBlockStyle: 'light',
		});
		expect(result).toMatchSnapshot();
	});

	it('Returns box-shadow object with different colors based on palette', () => {
		const object = {
			'box-shadow-palette-status-general': true,
			'box-shadow-palette-color-general': 4,
			'box-shadow-horizontal-general': 1,
			'box-shadow-vertical-general': 2,
			'box-shadow-blur-general': 3,
			'box-shadow-spread-general': 4,
			'box-shadow-palette-color-l': 2,
			'box-shadow-palette-opacity-l': 0.2,
		};

		const result = getBoxShadowStyles({
			obj: object,
			parentBlockStyle: 'light',
		});
		expect(result).toMatchSnapshot();
	});
});
