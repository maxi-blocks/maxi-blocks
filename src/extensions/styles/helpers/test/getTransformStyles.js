import { createSelectors } from '../../custom-css';
import getTransformStyles from '../getTransformStyles';

/**
 * PHP snapshots
 */
import correctStyles from '../../../../../core/blocks/style-helpers/tests/__snapshots__/Get_Transform_Styles_Test__test_get_correct_transform_styles__1.json';
import correctStylesWithDefaultHover from '../../../../../core/blocks/style-helpers/tests/__snapshots__/Get_Transform_Styles_Test__test_get_correct_default_hover_transform_styles__1.json';

describe('getTransformStyles', () => {
	const selectors = createSelectors({
		canvas: '',
	});

	it('Get a correct transform styles', () => {
		const object = {
			'transform-origin-general': {
				canvas: {
					normal: {
						x: 'left',
						y: 'top',
						'x-unit': '%',
						'y-unit': '%',
					},
				},
			},
			'transform-rotate-general': {
				canvas: {
					'hover-status': true,
					hover: {
						z: 90,
					},
				},
			},
			'transform-scale-general': {
				canvas: {
					normal: {
						y: 200,
					},
					'hover-status': true,
					hover: {
						x: 200,
					},
				},
			},
			'transform-translate-general': {
				canvas: {
					normal: {
						x: -20,
						y: -10,
						'x-unit': '%',
						'y-unit': '%',
					},
					'hover-status': true,
					hover: {
						x: 20,
						y: 10,
						'x-unit': '%',
						'y-unit': '%',
					},
				},
			},
		};

		const result = getTransformStyles(object, selectors);
		expect(result).toMatchSnapshot();
		expect(result).toEqual(correctStyles);
	});

	it('Get a correct default hover transform styles', () => {
		const object = {
			'transform-origin-general': {
				canvas: {
					'hover-status': true,
					normal: {
						x: 'left',
						y: 'top',
						'x-unit': '%',
						'y-unit': '%',
					},
				},
			},
			'transform-rotate-general': {
				canvas: {
					'hover-status': true,
					normal: {
						x: 30,
						y: 60,
						z: 90,
					},
				},
			},
			'transform-scale-general': {
				canvas: {
					'hover-status': true,
					normal: {
						y: 200,
					},
				},
			},
			'transform-translate-general': {
				canvas: {
					'hover-status': true,
					normal: {
						x: -20,
						y: -10,
						'x-unit': '%',
						'y-unit': '%',
					},
				},
			},
		};

		const result = getTransformStyles(object, selectors);
		expect(result).toMatchSnapshot();
		expect(result).toEqual(correctStylesWithDefaultHover);
	});
});
