import getOpacityStyles from '../getOpacityStyles';

/**
 * PHP snapshots
 */
import correctStyles from '../../../../../tests/__snapshots__/Get_Opacity_Styles_Test__test_get_a_correct_opacity_styles__1.json';

describe('getOpacityStyles', () => {
	it('Get a correct opacity styles', () => {
		const object = {
			'opacity-general': 1,
			'opacity-xxl': 0.56,
			'opacity-xl': 0.77,
			'opacity-l': 0.95,
			'opacity-m': 0.85,
			'opacity-s': 0.66,
			'opacity-xs': 0.99,
		};

		const result = getOpacityStyles(object);
		expect(result).toMatchSnapshot();
		expect(result).toEqual(correctStyles);
	});
});
