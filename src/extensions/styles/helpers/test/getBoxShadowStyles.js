import getBoxShadowStyles from '@extensions/styles/helpers/getBoxShadowStyles';

jest.mock('src/extensions/styles/getDefaultAttribute.js', () =>
	jest.fn(() => 4)
);

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
			'box-shadow-inset-general': true,
			'box-shadow-blur-unit-general': 'px',
			'box-shadow-horizontal-unit-general': 'px',
			'box-shadow-vertical-unit-general': 'px',
			'box-shadow-spread-unit-general': 'px',
			'box-shadow-palette-status-xxl': false,
			'box-shadow-color-xxl': 'rgb(255, 99, 72)',
			'box-shadow-horizontal-xxl': 5,
			'box-shadow-vertical-xxl': 6,
			'box-shadow-blur-xxl': 7,
			'box-shadow-spread-xxl': 8,
			'box-shadow-blur-unit-xxl': 'px',
			'box-shadow-horizontal-unit-xxl': 'px',
			'box-shadow-vertical-unit-xxl': 'px',
			'box-shadow-spread-unit-xxl': 'px',
			'box-shadow-palette-status-xl': false,
			'box-shadow-color-xl': 'rgb(255, 99, 73)',
			'box-shadow-horizontal-xl': 9,
			'box-shadow-vertical-xl': 10,
			'box-shadow-blur-xl': 11,
			'box-shadow-spread-xl': 12,
			'box-shadow-blur-unit-xl': 'px',
			'box-shadow-horizontal-unit-xl': 'px',
			'box-shadow-vertical-unit-xl': 'px',
			'box-shadow-spread-unit-xl': 'px',
			'box-shadow-palette-status-l': false,
			'box-shadow-color-l': 'rgb(255, 99, 74)',
			'box-shadow-horizontal-l': 13,
			'box-shadow-vertical-l': 14,
			'box-shadow-blur-l': 15,
			'box-shadow-spread-l': 16,
			'box-shadow-blur-unit-l': 'px',
			'box-shadow-horizontal-unit-l': 'px',
			'box-shadow-vertical-unit-l': 'px',
			'box-shadow-spread-unit-l': 'px',
			'box-shadow-palette-status-m': false,
			'box-shadow-color-m': 'rgb(255, 99, 75)',
			'box-shadow-horizontal-m': 17,
			'box-shadow-vertical-m': 18,
			'box-shadow-blur-m': 19,
			'box-shadow-spread-m': 20,
			'box-shadow-inset-m': false,
			'box-shadow-blur-unit-m': 'px',
			'box-shadow-horizontal-unit-m': 'px',
			'box-shadow-vertical-unit-m': 'px',
			'box-shadow-spread-unit-m': 'px',
			'box-shadow-palette-status-s': false,
			'box-shadow-color-s': 'rgb(255, 99, 76)',
			'box-shadow-horizontal-s': 21,
			'box-shadow-vertical-s': 22,
			'box-shadow-blur-s': 23,
			'box-shadow-spread-s': 24,
			'box-shadow-blur-unit-s': 'px',
			'box-shadow-horizontal-unit-s': 'px',
			'box-shadow-vertical-unit-s': 'px',
			'box-shadow-spread-unit-s': 'px',
			'box-shadow-palette-status-xs': false,
			'box-shadow-color-xs': 'rgb(255, 99, 77)',
			'box-shadow-horizontal-xs': 25,
			'box-shadow-vertical-xs': 26,
			'box-shadow-blur-xs': 27,
			'box-shadow-spread-xs': 28,
			'box-shadow-inset-xs': true,
			'box-shadow-blur-unit-xs': 'px',
			'box-shadow-horizontal-unit-xs': 'px',
			'box-shadow-vertical-unit-xs': 'px',
			'box-shadow-spread-unit-xs': 'px',
		};

		const result = getBoxShadowStyles({
			obj: object,
			blockStyle: 'light',
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
			'box-shadow-blur-unit-general': 'px',
			'box-shadow-horizontal-unit-general': 'px',
			'box-shadow-vertical-unit-general': 'px',
			'box-shadow-spread-unit-general': 'px',
		};

		const result = getBoxShadowStyles({
			obj: object,
			blockStyle: 'light',
		});
		expect(result).toMatchSnapshot();
	});

	it('Returns box-shadow default styles for IB', () => {
		const object = {
			'box-shadow-palette-status-general': true,
			'box-shadow-palette-color-general': 8,
			'box-shadow-palette-color-l': 8,
			'box-shadow-palette-opacity-general': 1,
			'box-shadow-palette-opacity-l': 1,
			'box-shadow-inset-general': false,
			'box-shadow-horizontal-general': 0,
			'box-shadow-horizontal-l': 0,
			'box-shadow-horizontal-unit-general': 'px',
			'box-shadow-horizontal-unit-l': 'px',
			'box-shadow-vertical-general': 0,
			'box-shadow-vertical-l': 0,
			'box-shadow-vertical-unit-general': 'px',
			'box-shadow-vertical-unit-l': 'px',
			'box-shadow-blur-general': 0,
			'box-shadow-blur-l': 0,
			'box-shadow-blur-unit-general': 'px',
			'box-shadow-blur-unit-l': 'px',
			'box-shadow-spread-general': 0,
			'box-shadow-spread-l': 0,
			'box-shadow-spread-unit-general': 'px',
			'box-shadow-spread-unit-l': 'px',
		};

		const result = getBoxShadowStyles({
			obj: object,
			blockStyle: 'light',
			isIB: true,
		});
		expect(result).toMatchSnapshot();
	});
});
