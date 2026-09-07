import { getLayerTransformCleanupAttributes } from '@components/background-control/transformCleanup';

describe('background-control utils', () => {
	describe('getLayerTransformCleanupAttributes', () => {
		it('removes the deleted background layer target from transform attributes', () => {
			const result = getLayerTransformCleanupAttributes(
				{
					'transform-scale-general': {
						_1: { normal: { x: 120, y: 120 } },
						_2: { normal: { x: 80, y: 80 } },
					},
					'transform-translate-m': {
						_1: { hover: { x: 20, y: 10 } },
					},
					'transform-rotate-xs': {
						_3: { normal: { z: 45 } },
					},
					'transform-skew-general': {
						_1: { normal: { x: 12, y: -6 } },
					},
					'transform-perspective-general': {
						_1: { normal: { value: 20, unit: 'px' } },
					},
					'transform-translate3d-general': {
						_1: { normal: { x: 42, y: -62, z: -155 } },
					},
					'transform-scale3d-general': {
						_1: { normal: { x: 1, y: 2, z: 5 } },
					},
					'transform-rotate3d-general': {
						_1: { normal: { x: 0, y: 1, z: 1, angle: 45 } },
					},
					'transform-target': '_1',
				},
				1
			);

			expect(result).toEqual({
				'transform-target': undefined,
				'transform-scale-general': {
					_2: { normal: { x: 80, y: 80 } },
				},
				'transform-translate-m': undefined,
				'transform-skew-general': undefined,
				'transform-perspective-general': undefined,
				'transform-translate3d-general': undefined,
				'transform-scale3d-general': undefined,
				'transform-rotate3d-general': undefined,
			});
		});
	});
});
