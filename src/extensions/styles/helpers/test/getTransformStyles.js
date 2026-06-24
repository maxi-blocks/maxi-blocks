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

	it('keeps zero scale values for IB transform settings', () => {
		const object = {
			'transform-scale-general': {
				canvas: {
					normal: {
						x: 0,
						y: 0,
					},
				},
			},
		};

		const result = getTransformStyles(object, selectors);

		expect(result[''].transform.general.transform).toBe(
			'scaleX(0) scaleY(0) '
		);
	});

	it('keeps zero translate, rotate, and origin values for IB transform settings', () => {
		const object = {
			'transform-translate-general': {
				canvas: {
					normal: {
						x: 0,
						y: 0,
						'x-unit': 'px',
						'y-unit': '%',
					},
				},
			},
			'transform-rotate-general': {
				canvas: {
					normal: {
						x: 0,
						y: 0,
						z: 0,
					},
				},
			},
			'transform-origin-general': {
				canvas: {
					normal: {
						x: '0',
						y: '0',
						'x-unit': 'px',
						'y-unit': '%',
					},
				},
			},
		};

		const result = getTransformStyles(object, selectors);

		expect(result[''].transform.general.transform).toBe(
			'translateX(0px) translateY(0%) rotateX(0deg) rotateY(0deg) rotateZ(0deg) '
		);
		expect(result[''].transform.general['transform-origin']).toBe(
			'0px 0% '
		);
	});
});
