import { createSelectors } from '@extensions/styles/custom-css';
import getTransformStyles from '@extensions/styles/helpers/getTransformStyles';

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
	});
});
