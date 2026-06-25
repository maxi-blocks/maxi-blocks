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

	it('Get correct skew and 3D transform styles', () => {
		const object = {
			'transform-perspective-general': {
				canvas: {
					normal: {
						value: 20,
						unit: 'px',
					},
				},
			},
			'transform-translate3d-general': {
				canvas: {
					normal: {
						x: 42,
						y: -62,
						z: -155,
						'x-unit': 'px',
						'y-unit': 'px',
						'z-unit': 'px',
					},
				},
			},
			'transform-scale3d-general': {
				canvas: {
					normal: {
						x: 1,
						y: 2,
						z: 5,
					},
				},
			},
			'transform-rotate3d-general': {
				canvas: {
					normal: {
						x: 0,
						y: 1,
						z: 1,
						angle: 45,
					},
				},
			},
			'transform-skew-general': {
				canvas: {
					normal: {
						x: 12,
						y: -6,
					},
				},
			},
		};

		const result = getTransformStyles(object, selectors);

		expect(result[''].transform.general.transform).toBe(
			'perspective(20px) translate3d(42px, -62px, -155px) scale3d(1, 2, 5) rotate3d(0, 1, 1, 45deg) skewX(12deg) skewY(-6deg) '
		);
	});
});
