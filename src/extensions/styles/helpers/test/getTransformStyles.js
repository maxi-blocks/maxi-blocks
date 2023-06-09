import { createSelectors } from '../../../attributes/custom-css';
import getTransformStyles from '../getTransformStyles';

describe('getTransformStyles', () => {
	const selectors = createSelectors({
		c: '',
	});

	it('Get a correct transform styles', () => {
		const object = {
			'tr_ori-g': {
				c: {
					n: {
						x: 'left',
						y: 'top',
						'x.u': '%',
						'y.u': '%',
					},
				},
			},
			'tr_rot-g': {
				c: {
					hs: true,
					h: {
						z: 90,
					},
				},
			},
			'tr_sc-g': {
				c: {
					n: {
						y: 200,
					},
					hs: true,
					h: {
						x: 200,
					},
				},
			},
			'tr_tr-g': {
				c: {
					n: {
						x: -20,
						y: -10,
						'x.u': '%',
						'y.u': '%',
					},
					hs: true,
					h: {
						x: 20,
						y: 10,
						'x.u': '%',
						'y.u': '%',
					},
				},
			},
		};

		const result = getTransformStyles(object, selectors);
		expect(result).toMatchSnapshot();
	});

	it('Get a correct default hover transform styles', () => {
		const object = {
			'tr_ori-g': {
				c: {
					hs: true,
					n: {
						x: 'left',
						y: 'top',
						'x.u': '%',
						'y.u': '%',
					},
				},
			},
			'tr_rot-g': {
				c: {
					hs: true,
					n: {
						x: 30,
						y: 60,
						z: 90,
					},
				},
			},
			'tr_sc-g': {
				c: {
					hs: true,
					n: {
						y: 200,
					},
				},
			},
			'tr_tr-g': {
				c: {
					hs: true,
					n: {
						x: -20,
						y: -10,
						'x.u': '%',
						'y.u': '%',
					},
				},
			},
		};

		const result = getTransformStyles(object, selectors);
		expect(result).toMatchSnapshot();
	});
});
