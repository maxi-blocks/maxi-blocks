import getDisplayStyles from '../getDisplayStyles';

/**
 * PHP snapshots
 */
import correctDisplayStyles from '../../../../../tests/__snapshots__/Get_Display_Styles_Test__test_get_a_correct_display_styles__1.json';

describe('getDisplayStyles', () => {
	it('Get a correct display styles', () => {
		const object = {
			'display-general': 'block',
			'display-xxl': 'block',
			'display-xl': 'block',
			'display-l': 'block',
			'display-m': 'flex',
			'display-s': 'flex',
			'display-xs': 'flex',
		};

		const result = getDisplayStyles(object);
		expect(result).toMatchSnapshot();
		expect(result).toEqual(correctDisplayStyles);
	});
});
