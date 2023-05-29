import { createSelectors } from '../../../attributes/custom-css';
import getTransformStyles from '../getTransformStyles';

describe('getTransformStyles', () => {
	const selectors = createSelectors({
		canvas: '',
	});

	it('Get a correct transform styles', () => {
		const object = {
			'transform-origin-g': {
				canvas: {
					normal: {
						x: 'left',
						y: 'top',
						'x-unit': '%',
						'y-unit': '%',
					},
				},
			},
			'transform-rotate-g': {
				canvas: {
					'hover-status': true,
					hover: {
						z: 90,
					},
				},
			},
			'transform-scale-g': {
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
			'transform-translate-g': {
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
			'transform-origin-g': {
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
			'transform-rotate-g': {
				canvas: {
					'hover-status': true,
					normal: {
						x: 30,
						y: 60,
						z: 90,
					},
				},
			},
			'transform-scale-g': {
				canvas: {
					'hover-status': true,
					normal: {
						y: 200,
					},
				},
			},
			'transform-translate-g': {
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
