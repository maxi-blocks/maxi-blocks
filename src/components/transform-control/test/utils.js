jest.mock('@components/custom-css-control/utils', () => ({
	getBgLayersSelectorsCss: jest.fn(() => ({
		background: {},
		'background hover': {},
	})),
}));

jest.mock('@blocks/search-maxi/data', () => ({
	prefixes: {
		closeIconPrefix: 'close-',
	},
}));

import { getUpdatedTransformOptions } from '../utils';

describe('transform control utils', () => {
	it('updates rotate values immutably so save payloads contain the latest angle', () => {
		const transformOptions = {
			'transform-rotate-general': {
				canvas: {
					normal: {
						x: 0,
						y: 0,
						z: 0,
					},
				},
			},
		};

		const nextTransformOptions = getUpdatedTransformOptions({
			transformOptions,
			updates: {
				'transform-rotate': {
					canvas: {
						normal: {
							x: 0,
							y: 0,
							z: 45,
						},
					},
				},
			},
			breakpoint: 'general',
			baseBreakpoint: 'xxl',
		});

		expect(nextTransformOptions).not.toBe(transformOptions);
		expect(nextTransformOptions['transform-rotate-general']).not.toBe(
			transformOptions['transform-rotate-general']
		);
		expect(
			nextTransformOptions['transform-rotate-general'].canvas.normal.z
		).toBe(45);
		expect(
			transformOptions['transform-rotate-general'].canvas.normal.z
		).toBe(0);
		expect(
			nextTransformOptions['transform-rotate-xxl'].canvas.normal.z
		).toBe(45);
	});
});
