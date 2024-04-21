import getIconSize from '../getIconSize';

/**
 * PHP snapshots
 */
import correctIconSize from '../../../../../tests/__snapshots__/Get_Icon_Size_Test__test_should_return_correct_icon_size__1.json';
import correctIconSizeHover from '../../../../../tests/__snapshots__/Get_Icon_Size_Test__test_should_return_correct_icon_size__2.json';
import widthIsnotSpecified from '../../../../../tests/__snapshots__/Get_Icon_Size_Test__test_should_use_height_when_width_is_not_specified__1.json';
import widthIsnotSpecifiedHover from '../../../../../tests/__snapshots__/Get_Icon_Size_Test__test_should_use_height_when_width_is_not_specified__2.json';
import worksWithPrefixes from '../../../../../tests/__snapshots__/Get_Icon_Size_Test__test_should_work_with_prefixes__1.json';
import worksWithPrefixesHover from '../../../../../tests/__snapshots__/Get_Icon_Size_Test__test_should_work_with_prefixes__2.json';
import worksOnResponsive from '../../../../../tests/__snapshots__/Get_Icon_Size_Test__test_should_work_on_responsive__1.json';
import worksOnResponsiveHover from '../../../../../tests/__snapshots__/Get_Icon_Size_Test__test_should_work_on_responsive__2.json';
import hoverStyles from '../../../../../tests/__snapshots__/Get_Icon_Size_Test__test_should_return_right_hover_styles_with_only_value_specified_on_hover__1.json';
import hoverStylesUnit from '../../../../../tests/__snapshots__/Get_Icon_Size_Test__test_should_return_right_hover_styles_with_only_unit_specified_on_hover__1.json';
import stylesWithOnlyUnitSpecifiedOnResponsive from '../../../../../tests/__snapshots__/Get_Icon_Size_Test__test_should_return_right_styles_with_only_unit_specified_on_responsive__1.json';
import heightFitContentWidthHeightRatioGreaterThan1 from '../../../../../tests/__snapshots__/Get_Icon_Size_Test__test_should_return_right_styles_with_height_fit_content_and_width_height_ratio_greater_than_1__1.json';
import heightFitContentWidthHeightRatioLessThan1 from '../../../../../tests/__snapshots__/Get_Icon_Size_Test__test_should_return_right_styles_with_height_fit_content_and_width_height_ratio_less_than_1__1.json';

describe('getIconSize', () => {
	it('Should return correct icon size', () => {
		const attributes = {
			'icon-height-general': '32',
			'icon-height-unit-general': 'px',
			'icon-width-fit-content-general': false,
			'icon-width-general': '71',
			'icon-width-general-hover': '123',
			'icon-width-unit-general': '%',
		};

		// Normal state
		const normalStateResult = getIconSize(attributes, false);
		expect(normalStateResult).toMatchSnapshot();
		expect(normalStateResult).toEqual(correctIconSize);

		// Hover state
		const hoverStateResult = getIconSize(attributes, true);
		expect(hoverStateResult).toMatchSnapshot();
		expect(hoverStateResult).toEqual(correctIconSizeHover);
	});

	it('Should use height when width is not specified', () => {
		const attributes = {
			'icon-height-general': '32',
			'icon-height-unit-general': 'px',
			'icon-height-general-hover': '50',
			'icon-height-unit-general-hover': '%',
		};

		// Normal state
		const normalStateResult = getIconSize(attributes, false);
		expect(normalStateResult).toMatchSnapshot();
		expect(normalStateResult).toEqual(widthIsnotSpecified);

		// Hover state
		const hoverStateResult = getIconSize(attributes, true);
		expect(hoverStateResult).toMatchSnapshot();
		expect(hoverStateResult).toEqual(widthIsnotSpecifiedHover);
	});

	it('Should work with prefixes', () => {
		const prefix = 'any-prefix-';

		const attributes = {
			[`${prefix}icon-height-general`]: '32',
			[`${prefix}icon-height-unit-general`]: 'px',
			[`${prefix}icon-height-general-hover`]: '50',
			[`${prefix}icon-height-unit-general-hover`]: '%',
		};

		// Normal state
		const normalStateResult = getIconSize(attributes, false, prefix);
		expect(normalStateResult).toMatchSnapshot();
		expect(normalStateResult).toEqual(worksWithPrefixes);

		// Hover state
		const hoverStateResult = getIconSize(attributes, true, prefix);
		expect(hoverStateResult).toMatchSnapshot();
		expect(hoverStateResult).toEqual(worksWithPrefixesHover);
	});

	it('Should work on responsive', () => {
		const prefix = 'any-prefix-';

		const attributes = {
			[`${prefix}icon-height-general`]: '32',
			[`${prefix}icon-height-unit-general`]: 'px',
			[`${prefix}icon-height-general-hover`]: '50',
			[`${prefix}icon-height-unit-general-hover`]: '%',
			[`${prefix}icon-height-m`]: '12',
			[`${prefix}icon-height-unit-m`]: 'em',
			[`${prefix}icon-height-m-hover`]: '15',
			[`${prefix}icon-height-unit-m-hover`]: 'px',
		};

		// Normal state
		const normalStateResult = getIconSize(attributes, false, prefix);
		expect(normalStateResult).toMatchSnapshot();
		expect(normalStateResult).toEqual(worksOnResponsive);

		// Hover state
		const hoverStateResult = getIconSize(attributes, true, prefix);
		expect(hoverStateResult).toMatchSnapshot();
		expect(hoverStateResult).toEqual(worksOnResponsiveHover);
	});

	it('Should return right hover styles with only value specified on hover (no unit)', () => {
		const attributes = {
			'icon-width-general': '32',
			'icon-width-unit-general': '%',
			'icon-width-general-hover': '64',
		};

		const result = getIconSize(attributes, true);
		expect(result).toMatchSnapshot();
		expect(result).toEqual(hoverStyles);
	});

	it('Should return right hover styles with only unit specified on hover', () => {
		const attributes = {
			'icon-width-general': '32',
			'icon-width-unit-general': '%',
			'icon-width-unit-general-hover': 'em',
		};

		const result = getIconSize(attributes, true);
		expect(result).toMatchSnapshot();
		expect(result).toEqual(hoverStylesUnit);
	});

	it('Should return right styles with only unit specified on responsive', () => {
		const attributes = {
			'icon-width-general': '32',
			'icon-width-unit-general': '%',
			'icon-width-unit-l': 'em',
		};

		const result = getIconSize(attributes, false);
		expect(result).toMatchSnapshot();
		expect(result).toEqual(stylesWithOnlyUnitSpecifiedOnResponsive);
	});

	it('Should return right styles with height fit-content, width/height ratio > 1', () => {
		const attributes = {
			'icon-width-general': '36',
			'icon-width-unit-general': '%',
			'icon-width-fit-content-general': true,
			'icon-width-l': '32',
			'icon-width-fit-content-l': false,
			'icon-width-m': '36',
			'icon-width-fit-content-m': true,
			'icon-stroke-general': '1',
			'icon-stroke-l': '3',
			'icon-stroke-m': '4',
		};

		const result = getIconSize(attributes, false, '', 3);
		expect(result).toMatchSnapshot();
		expect(result).toEqual(heightFitContentWidthHeightRatioGreaterThan1);
	});

	it('Should return right styles with height fit-content, width/height ratio < 1', () => {
		const attributes = {
			'icon-width-general': '36',
			'icon-width-unit-general': '%',
			'icon-width-fit-content-general': true,
			'icon-width-l': '32',
			'icon-width-fit-content-l': false,
			'icon-width-m': '36',
			'icon-width-fit-content-m': true,
			'icon-stroke-general': '1',
			'icon-stroke-l': '3',
			'icon-stroke-m': '4',
		};

		const result = getIconSize(attributes, false, '', 0.5);
		expect(result).toMatchSnapshot();
		expect(result).toEqual(heightFitContentWidthHeightRatioLessThan1);
	});
});
