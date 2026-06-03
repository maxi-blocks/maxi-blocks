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
			});
		});
	});
});
