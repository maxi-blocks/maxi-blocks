import getOverflowStyles from '../getOverflowStyles';

/**
 * PHP snapshots
 */
import defaultValues from '../../../../../core/blocks/style-helpers/tests/__snapshots__/Get_Overflow_Styles_Test__test_get_correct_overflow_styles_with_default_values__1.json';
import allVisible from '../../../../../core/blocks/style-helpers/tests/__snapshots__/Get_Overflow_Styles_Test__test_get_correct_overflow_styles_when_all_values_visible__1.json';
import correctStyles from '../../../../../core/blocks/style-helpers/tests/__snapshots__/Get_Overflow_Styles_Test__test_get_correct_overflow_styles__1.json';

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

describe('getOverflowStyles', () => {
	it('Get a correct overflow styles with default values', () => {
		const object = {
			'overflow-x-general': 'visible',
			'overflow-y-general': 'visible',
		};

		const result = getOverflowStyles(object);
		expect(result).toMatchSnapshot();
		expect(result).toEqual(defaultValues);
	});

	it('Get a correct overflow styles when all values visible', () => {
		const object = {
			'overflow-x-general': 'visible',
			'overflow-y-general': 'visible',
			'overflow-x-xxl': 'visible',
			'overflow-y-xxl': 'visible',
			'overflow-x-xl': 'visible',
			'overflow-y-xl': 'visible',
			'overflow-x-l': 'visible',
			'overflow-y-l': 'visible',
			'overflow-x-m': 'visible',
			'overflow-y-m': 'visible',
			'overflow-x-s': 'visible',
			'overflow-y-s': 'visible',
			'overflow-x-xs': 'visible',
			'overflow-y-xs': 'visible',
		};

		const result = getOverflowStyles(object);
		expect(result).toMatchSnapshot();
		expect(result).toEqual(allVisible);
	});

	it('Get a correct overflow styles', () => {
		const object = {
			'overflow-x-general': 'visible',
			'overflow-y-general': 'hidden',
			'overflow-x-xxl': 'hidden',
			'overflow-y-xxl': 'visible',
			'overflow-x-xl': 'auto',
			'overflow-y-xl': 'clip',
			'overflow-x-l': 'clip',
			'overflow-y-l': 'auto',
			'overflow-x-m': 'scroll',
			'overflow-y-m': 'scroll',
			'overflow-x-s': 'auto',
			'overflow-y-s': 'auto',
			'overflow-x-xs': 'visible',
			'overflow-y-xs': 'visible',
		};

		const result = getOverflowStyles(object);
		expect(result).toMatchSnapshot();
		expect(result).toEqual(correctStyles);
	});
});
