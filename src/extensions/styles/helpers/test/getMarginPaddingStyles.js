import getMarginPaddingStyles from '../getMarginPaddingStyles';

/**
 * PHP snapshots
 */
import simpleCorrectMarginPadding from '../../../../../core/blocks/style-helpers/tests/__snapshots__/Get_Margin_Padding_Styles_Test__test_get_a_correct_margin_and_padding_simple_styles__1.json';
import correctMarginPadding from '../../../../../core/blocks/style-helpers/tests/__snapshots__/Get_Margin_Padding_Styles_Test__test_get_a_correct_margin_and_padding__1.json';
import valuesDependsOnResponsive from '../../../../../core/blocks/style-helpers/tests/__snapshots__/Get_Margin_Padding_Styles_Test__test_different_values_depends_on_the_responsive__1.json';
import withOnlyUnitChanged from '../../../../../core/blocks/style-helpers/tests/__snapshots__/Get_Margin_Padding_Styles_Test__test_get_a_correct_margin_and_padding_styles_when_only_unit_on_some_breakpoint_was_changed__1.json';
import valueUndefinedUnitDefined from '../../../../../core/blocks/style-helpers/tests/__snapshots__/Get_Margin_Padding_Styles_Test__test_get_a_correct_margin_and_padding_styles_when_value_is_undefined_but_unit_is_defined__1.json';

jest.mock('@wordpress/data', () => {
	return {
		select: jest.fn(() => {
			return {
				receiveBaseBreakpoint: jest.fn(() => 'xl'),
				receiveMaxiDeviceType: jest.fn(() => 'general'),
				getPrevSavedAttrs: jest.fn(() => ({ prevSavedAttrs: [] })),
				getSelectedBlockCount: jest.fn(() => 1),
			};
		}),
		createReduxStore: jest.fn(),
		register: jest.fn(),
		dispatch: jest.fn(() => {
			return { savePrevSavedAttrs: jest.fn() };
		}),
	};
});

describe('getMarginPaddingStyles', () => {
	it('Get a correct margin and padding simple styles', () => {
		const obj = {
			'margin-top-general': '1',
			'margin-top-unit-general': 'px',
			'margin-right-general': '2',
			'margin-right-unit-general': 'px',
			'margin-bottom-general': '3',
			'margin-bottom-unit-general': 'px',
			'margin-left-general': '4',
			'margin-left-unit-general': 'px',
			'margin-top-xl': '1',
			'margin-top-unit-xl': 'px',
			'margin-right-xl': '2',
			'margin-right-unit-xl': 'px',
			'margin-bottom-xl': '3',
			'margin-bottom-unit-xl': 'px',
			'margin-left-xl': '4',
			'margin-left-unit-xl': 'px',
			'padding-top-general': '1',
			'padding-top-unit-general': 'px',
			'padding-right-general': '2',
			'padding-right-unit-general': 'px',
			'padding-bottom-general': '3',
			'padding-bottom-unit-general': 'px',
			'padding-left-general': '4',
			'padding-left-unit-general': 'px',
			'padding-top-xl': '1',
			'padding-top-unit-xl': 'px',
			'padding-right-xl': '2',
			'padding-right-unit-xl': 'px',
			'padding-bottom-xl': '3',
			'padding-bottom-unit-xl': 'px',
			'padding-left-xl': '4',
			'padding-left-unit-xl': 'px',
		};

		const result = getMarginPaddingStyles({ obj });
		expect(result).toMatchSnapshot();
		expect(result).toEqual(simpleCorrectMarginPadding);
	});

	it('Get a correct margin and padding', () => {
		const obj = {
			'margin-top-general': '1',
			'margin-right-general': '2',
			'margin-bottom-general': '3',
			'margin-left-general': '4',
			'margin-sync-general': true,
			'margin-top-unit-general': 'px',
			'margin-right-unit-general': 'px',
			'margin-bottom-unit-general': 'px',
			'margin-left-unit-general': 'px',
			'margin-top-xxl': '1',
			'margin-right-xxl': '2',
			'margin-bottom-xxl': '3',
			'margin-left-xxl': '4',
			'margin-sync-xxl': true,
			'margin-top-unit-xxl': '%',
			'margin-right-unit-xxl': '%',
			'margin-bottom-unit-xxl': '%',
			'margin-left-unit-xxl': '%',
			'margin-top-xl': '1',
			'margin-right-xl': '2',
			'margin-bottom-xl': '3',
			'margin-left-xl': '4',
			'margin-sync-xl': true,
			'margin-top-unit-xl': '%',
			'margin-right-unit-xl': '%',
			'margin-bottom-unit-xl': '%',
			'margin-left-unit-xl': '%',
			'margin-top-l': '1',
			'margin-right-l': '2',
			'margin-bottom-l': '3',
			'margin-left-l': '4',
			'margin-sync-l': true,
			'margin-top-unit-l': 'px',
			'margin-right-unit-l': 'px',
			'margin-bottom-unit-l': 'px',
			'margin-left-unit-l': 'px',
			'margin-top-m': '1',
			'margin-right-m': '2',
			'margin-bottom-m': '3',
			'margin-left-m': '4',
			'margin-sync-m': true,
			'margin-top-unit-m': 'px',
			'margin-right-unit-m': 'px',
			'margin-bottom-unit-m': 'px',
			'margin-left-unit-m': 'px',
			'margin-top-s': '1',
			'margin-right-s': '2',
			'margin-bottom-s': '3',
			'margin-left-s': '4',
			'margin-sync-s': true,
			'margin-top-unit-s': '%',
			'margin-right-unit-s': '%',
			'margin-bottom-unit-s': '%',
			'margin-left-unit-s': '%',
			'margin-top-xs': '1',
			'margin-right-xs': '2',
			'margin-bottom-xs': '3',
			'margin-left-xs': '4',
			'margin-sync-xs': true,
			'margin-top-unit-xs': 'px',
			'margin-right-unit-xs': 'px',
			'margin-bottom-unit-xs': 'px',
			'margin-left-unit-xs': 'px',
		};

		const result = getMarginPaddingStyles({
			obj,
		});
		expect(result).toMatchSnapshot();
		expect(result).toEqual(correctMarginPadding);
	});

	it('Different values ​​depends on the responsive', () => {
		const obj = {
			'margin-top-general': '11',
			'margin-right-general': '11',
			'margin-bottom-general': '11',
			'margin-left-general': '11',
			'margin-sync-general': true,
			'margin-top-unit-general': 'px',
			'margin-right-unit-general': 'px',
			'margin-bottom-unit-general': 'px',
			'margin-left-unit-general': 'px',
			'margin-top-xxl': '12',
			'margin-right-xxl': '12',
			'margin-bottom-xxl': '12',
			'margin-left-xxl': '12',
			'margin-sync-xxl': true,
			'margin-top-unit-xxl': '%',
			'margin-right-unit-xxl': '%',
			'margin-bottom-unit-xxl': '%',
			'margin-left-unit-xxl': '%',
			'margin-top-xl': '45',
			'margin-right-xl': '45',
			'margin-bottom-xl': '45',
			'margin-left-xl': '45',
			'margin-sync-xl': true,
			'margin-top-unit-xl': '%',
			'margin-right-unit-xl': '%',
			'margin-bottom-unit-xl': '%',
			'margin-left-unit-xl': '%',
			'margin-top-l': '5',
			'margin-right-l': '5',
			'margin-bottom-l': '5',
			'margin-left-l': '5',
			'margin-sync-l': true,
			'margin-top-unit-l': 'px',
			'margin-right-unit-l': 'px',
			'margin-bottom-unit-l': 'px',
			'margin-left-unit-l': 'px',
			'margin-top-m': '0',
			'margin-right-m': '2',
			'margin-bottom-m': '6',
			'margin-left-m': '4',
			'margin-sync-m': true,
			'margin-top-unit-m': 'px',
			'margin-right-unit-m': 'px',
			'margin-bottom-unit-m': 'px',
			'margin-left-unit-m': 'px',
			'margin-top-s': '0',
			'margin-right-s': '0',
			'margin-bottom-s': '0',
			'margin-left-s': '0',
			'margin-sync-s': true,
			'margin-top-unit-s': '%',
			'margin-right-unit-s': '%',
			'margin-bottom-unit-s': '%',
			'margin-left-unit-s': '%',
			'margin-top-xs': '1',
			'margin-right-xs': '1',
			'margin-bottom-xs': '1',
			'margin-left-xs': '1',
			'margin-sync-xs': true,
			'margin-top-unit-xs': 'px',
			'margin-right-unit-xs': 'px',
			'margin-bottom-unit-xs': 'px',
			'margin-left-unit-xs': 'px',
		};

		const result = getMarginPaddingStyles({
			obj,
		});
		expect(result).toMatchSnapshot();
		expect(result).toEqual(valuesDependsOnResponsive);
	});

	it('Get a correct margin and padding styles, when only unit on some breakpoint was changed', () => {
		const obj = {
			'margin-top-general': '11',
			'margin-top-unit-general': 'em',
			'margin-top-xl': '11',
			'margin-top-unit-xl': 'em',
			'margin-top-unit-xxl': 'px',
			'margin-top-unit-m': '%',
		};
		const result = getMarginPaddingStyles({
			obj,
		});
		expect(result).toMatchSnapshot();
		expect(result).toEqual(withOnlyUnitChanged);
	});

	it('Get a correct margin and padding styles, when value is undefined but unit is defined', () => {
		const obj = {
			'margin-top-general': '',
			'margin-right-general': '',
			'margin-bottom-general': '',
			'margin-left-general': '',
			'margin-sync-general': 'all',
			'margin-top-unit-general': 'px',
			'margin-right-unit-general': 'px',
			'margin-bottom-unit-general': 'px',
			'margin-left-unit-general': 'px',
		};

		const result = getMarginPaddingStyles({
			obj,
		});
		expect(result).toMatchSnapshot();
		expect(result).toEqual(valueUndefinedUnitDefined);
	});
});
