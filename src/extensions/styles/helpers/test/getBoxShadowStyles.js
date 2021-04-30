import getBoxShadowStyles from '../getBoxShadowStyles';

describe('getBoxShadowStyles', () => {
	it('Get a correct BoxShadowStyles', () => {
		const object = {
			'box-shadow-color-general': 'red',
			'box-shadow-horizontal-general': 1,
			'box-shadow-vertical-general': 2,
			'box-shadow-blur-general': 3,
			'box-shadow-spread-general': 4,
			'box-shadow-color-xxl': 'red',
			'box-shadow-horizontal-xxl': 1,
			'box-shadow-vertical-xxl': 2,
			'box-shadow-blur-xxl': 3,
			'box-shadow-spread-xxl': 4,
			'box-shadow-color-xl': 'red',
			'box-shadow-horizontal-xl': 1,
			'box-shadow-vertical-xl': 2,
			'box-shadow-blur-xl': 3,
			'box-shadow-spread-xl': 4,
			'box-shadow-color-l': 'red',
			'box-shadow-horizontal-l': 1,
			'box-shadow-vertical-l': 2,
			'box-shadow-blur-l': 3,
			'box-shadow-spread-l': 4,
			'box-shadow-color-m': 'red',
			'box-shadow-horizontal-m': 1,
			'box-shadow-vertical-m': 2,
			'box-shadow-blur-m': 3,
			'box-shadow-spread-m': 4,
			'box-shadow-color-s': 'red',
			'box-shadow-horizontal-s': 1,
			'box-shadow-vertical-s': 2,
			'box-shadow-blur-s': 3,
			'box-shadow-spread-s': 4,
			'box-shadow-color-xs': 'red',
			'box-shadow-horizontal-xs': 1,
			'box-shadow-vertical-xs': 2,
			'box-shadow-blur-xs': 3,
			'box-shadow-spread-xs': 4,
		};

		const result = getBoxShadowStyles(object);
		expect(result).toMatchSnapshot();
	});
});
