import { getSVGStyles, getSVGWidthStyles } from '../getSVGStyles';

/**
 * PHP snapshots
 */
import correctStyles from '../../../../../core/blocks/style-helpers/tests/__snapshots__/Get_SVG_Styles_Test__test_returns_correct_styles__1.json';
import correctIconSize from '../../../../../core/blocks/style-helpers/tests/__snapshots__/Get_SVG_Styles_Test__test_should_return_correct_icon_size__1.json';
import correctStylesWithDisabledHeightFalse from '../../../../../core/blocks/style-helpers/tests/__snapshots__/Get_SVG_Styles_Test__test_should_return_correct_icon_size_with_disable_height_false__1.json';
import correctStylesOnResponsive from '../../../../../core/blocks/style-helpers/tests/__snapshots__/Get_SVG_Styles_Test__test_should_work_on_responsive__1.json';
import correctStylesWithHeightFitContentAndHeightRationLessThanOne from '../../../../../core/blocks/style-helpers/tests/__snapshots__/Get_SVG_Styles_Test__test_should_return_right_styles_with_height_fit_content_width_height_ratio_less_than_1_with_disable_height_true__1.json';
import correctStylesWithHeightFitContentAndHeightRatioGreaterThanOne from '../../../../../core/blocks/style-helpers/tests/__snapshots__/Get_SVG_Styles_Test__test_should_return_right_styles_with_height_fit_content_width_height_ratio_greater_than_1_with_disable_height_true__1.json';

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

describe('getSVGStyles', () => {
	it('Returns correct styles', () => {
		const obj = {
			'svg-fill-palette-status': true,
			'svg-fill-palette-color': 4,
			'svg-line-palette-status': true,
			'svg-line-palette-color': 7,
			'svg-stroke-general': 2,
			'svg-width-general': '64',
			'svg-width-unit-general': 'px',
			'svg-stroke-m': 20,
			'svg-width-m': '640',
			'svg-width-unit-m': 'vw',
		};
		const target = ' .maxi-svg-icon-block__icon';
		const blockStyle = 'light';

		const result = getSVGStyles({ obj, target, blockStyle });

		expect(result).toMatchSnapshot();
		expect(result).toEqual(correctStyles);
	});

	it('Should return correct icon size', () => {
		const attributes = {
			'svg-width-general': '32',
			'svg-width-unit-general': 'px',
			'svg-width-fit-content-general': false,
			'svg-icon-width-general': '71',
			'svg-icon-width-unit-general': '%',
		};

		const result = getSVGWidthStyles({ obj: attributes, prefix: 'svg-' });
		expect(result).toMatchSnapshot();
		expect(result).toEqual(correctIconSize);
	});

	it('Should return correct icon size with disableHeight: false', () => {
		const attributes = {
			'svg-width-general': '32',
			'svg-width-unit-general': 'px',
			'svg-width-fit-content-general': false,
			'svg-icon-width-general': '71',
			'svg-icon-width-unit-general': '%',
		};

		const result = getSVGWidthStyles({
			obj: attributes,
			prefix: 'svg-',
			disableHeight: false,
		});

		expect(result).toMatchSnapshot();
		expect(result).toEqual(correctStylesWithDisabledHeightFalse);
	});

	it('Should work on responsive', () => {
		const prefix = 'any-prefix-';

		const attributes = {
			[`${prefix}icon-height-general`]: '32',
			[`${prefix}icon-height-unit-general`]: 'px',
			[`${prefix}icon-height-m`]: '12',
			[`${prefix}icon-height-unit-m`]: 'em',
		};

		const result = getSVGWidthStyles({ obj: attributes, prefix });

		expect(result).toMatchSnapshot();
		expect(result).toEqual(correctStylesOnResponsive);
	});

	it('Should return right styles with height fit-content, width/height ratio > 1 with disableHeight true', () => {
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

		const result = getSVGWidthStyles({
			obj: attributes,
			iconWidthHeightRatio: 3,
			disableHeight: true,
		});
		expect(result).toMatchSnapshot();
		expect(result).toEqual(
			correctStylesWithHeightFitContentAndHeightRatioGreaterThanOne
		);
	});

	it('Should return right styles with height fit-content, width/height ratio < 1 with disableHeight: true', () => {
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

		const result = getSVGWidthStyles({
			obj: attributes,
			iconWidthHeightRatio: 0.5,
			disableHeight: true,
		});
		expect(result).toMatchSnapshot();
		expect(result).toEqual(
			correctStylesWithHeightFitContentAndHeightRationLessThanOne
		);
	});
});
