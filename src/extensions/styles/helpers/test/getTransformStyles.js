import getTransformStyles from '../getTransformStyles';

describe('getTransformStyles', () => {
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

		const result = getTransformStyles(object, {
			canvas: {
				normal: {
					label: 'canvas',
					target: '',
				},
				hover: {
					label: 'canvas on hover',
					target: ':hover',
				},
			},
		});
		expect(result).toMatchSnapshot();
	});
});
