import getPositionStyles from '../getPositionStyles';

/**
 * PHP snapshots
 */
import correctPositionStyles from '../../../../../core/blocks/style-helpers/tests/__snapshots__/Get_Position_Styles_Test__test_get_correct_position_styles__1.json';
import unnecessaryPositionStylesNotAdded from '../../../../../core/blocks/style-helpers/tests/__snapshots__/Get_Position_Styles_Test__test_ensure_unnecessary_position_styles_are_not_added__1.json';
import unnecessaryPositionStylesNotAdded2 from '../../../../../core/blocks/style-helpers/tests/__snapshots__/Get_Position_Styles_Test__test_ensure_unnecessary_position_styles_are_not_added__2.json';

describe('getPositionStyles', () => {
	it('Get a correct position styles', () => {
		const object = {
			'position-general': 'relative',
			'position-xxl': 'absolute',
			'position-xl': 'relative',
			'position-l': 'absolute',
			'position-m': 'relative',
			'position-s': 'absolute',
			'position-xs': 'relative',
			'position-top-general': 1,
			'position-right-general': 2,
			'position-bottom-general': 3,
			'position-left-general': 4,
			'position-sync-general': true,
			'position-top-unit-general': 'px',
			'position-right-unit-general': 'em',
			'position-bottom-unit-general': 'vw',
			'position-left-unit-general': '%',
			'position-top-xxl': 1,
			'position-right-xxl': 2,
			'position-bottom-xxl': 3,
			'position-left-xxl': 4,
			'position-sync-xxl': true,
			'position-unit-xxl': 'px',
			'position-top-xl': 1,
			'position-right-xl': 2,
			'position-bottom-xl': 3,
			'position-left-xl': 4,
			'position-sync-xl': true,
			'position-top-unit-xl': 'px',
			'position-right-unit-xl': 'em',
			'position-bottom-unit-xl': 'vw',
			'position-left-unit-xl': '%',
			'position-top-l': 1,
			'position-right-l': 2,
			'position-bottom-l': 3,
			'position-left-l': 4,
			'position-sync-l': true,
			'position-top-unit-l': 'px',
			'position-right-unit-l': 'em',
			'position-bottom-unit-l': 'vw',
			'position-left-unit-l': '%',
			'position-top-m': 1,
			'position-right-m': 2,
			'position-bottom-m': 3,
			'position-left-m': 4,
			'position-sync-m': true,
			'position-unit-top-m': 'px',
			'position-unit-right-m': 'em',
			'position-unit-bottom-m': 'vw',
			'position-unit-left-m': '%',
			'position-top-s': 1,
			'position-right-s': 2,
			'position-bottom-s': 3,
			'position-left-s': 4,
			'position-sync-s': true,
			'position-top-unit-s': 'px',
			'position-right-unit-s': 'em',
			'position-bottom-unit-s': 'vw',
			'position-left-unit-s': '%',
			'position-top-xs': 1,
			'position-right-xs': 2,
			'position-bottom-xs': 3,
			'position-left-xs': 4,
			'position-sync-xs': true,
			'position-top-unit-xs': 'px',
			'position-right-unit-xs': 'em',
			'position-bottom-unit-xs': 'vw',
			'position-left-unit-xs': '%',
		};
		const result = getPositionStyles(object);
		expect(result).toMatchSnapshot();
		expect(result).toEqual(correctPositionStyles);
	});

	it('Ensure unnecessary position styles are not added', () => {
		const object = {
			'position-general': 'inherit',
			'position-top-unit-xl': 'px',
			'position-right-unit-xl': 'em',
			'position-bottom-unit-xl': 'vw',
			'position-left-unit-xl': '%',
			'position-top-l': 1,
			'position-right-l': 2,
			'position-bottom-l': 3,
			'position-left-l': 4,
			'position-sync-l': true,
			'position-m': 'relative',
			'position-left-unit-s': '%',
			'position-top-xs': 1,
			'position-right-xs': 2,
			'position-bottom-xs': 3,
			'position-left-xs': 4,
			'position-sync-xs': true,
		};
		const result = getPositionStyles(object);
		expect(result).toMatchSnapshot();
		expect(result).toEqual(unnecessaryPositionStylesNotAdded);

		const object2 = {
			'position-general': 'relative',
			'position-top-general': 1,
			'position-right-general': 2,
			'position-bottom-general': 3,
			'position-left-general': 4,
			'position-sync-general': true,
			'position-top-unit-general': 'px',
			'position-right-unit-general': 'em',
			'position-bottom-unit-general': 'vw',
			'position-left-unit-general': '%',
			'position-top-unit-xl': 'px',
			'position-right-unit-xl': 'em',
			'position-bottom-unit-xl': 'vw',
			'position-left-unit-xl': '%',
			'position-top-l': 1,
			'position-right-l': 2,
			'position-bottom-l': 3,
			'position-left-l': 4,
			'position-sync-l': true,
			'position-m': 'inherit',
			'position-left-unit-s': '%',
			'position-top-xs': 1,
			'position-right-xs': 2,
			'position-bottom-xs': 3,
			'position-left-xs': 4,
			'position-sync-xs': true,
		};

		const result2 = getPositionStyles(object2);
		expect(result2).toMatchSnapshot();
		expect(result2).toEqual(unnecessaryPositionStylesNotAdded2);
	});
});
