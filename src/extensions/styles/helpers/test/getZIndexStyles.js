import getZIndexStyles from '../getZIndexStyles';

/**
 * PHP snapshots
 */
import correctStyles from '../../../../../tests/__snapshots__/Get_ZIndex_Styles_Test__test_get_a_correct_z_index_style__1.json';

describe('getZIndexStyle', () => {
	it('Get a correct z-index style', () => {
		const object = {
			'z-index-general': 1,
			'z-index-xxl': 2,
			'z-index-xl': 3,
			'z-index-l': 4,
			'z-index-m': 5,
			'z-index-s': 6,
			'z-index-xs': 7,
		};
		const result = getZIndexStyles(object);
		expect(result).toMatchSnapshot();
		expect(result).toEqual(correctStyles);
	});
});
