import getTransformStyles from '../getTransformStyles';

jest.mock('@wordpress/data', () => {
	return {
		select: jest.fn(() => {
			return {
				getSelectedBlockCount: jest.fn(() => 1),
			};
		}),
	};
});

describe('getTransformStyles', () => {
	it('Get a correct transform styles', () => {
		const object = {
			'transform-scale-x-general': 1,
			'transform-scale-y-general': 2,
			'transform-translate-x-unit-general': 'px',
			'transform-translate-x-general': 3,
			'transform-translate-y-unit-general': 'px',
			'transform-translate-y-general': 4,
			'transform-rotate-x-general': 1,
			'transform-rotate-y-general': 2,
			'transform-rotate-z-general': 3,
			'transform-origin-x-general': 'bottom',
			'transform-origin-y-general': 'top',
			'transform-scale-x-xxl': 4,
			'transform-scale-y-xxl': 1,
			'transform-translate-x-unit-xxl': 'px',
			'transform-translate-x-xxl': 2,
			'transform-translate-y-unit-xxl': 'px',
			'transform-translate-y-xxl': 3,
			'transform-rotate-x-xxl': 4,
			'transform-rotate-y-xxl': 1,
			'transform-rotate-z-xxl': 2,
			'transform-origin-x-xxl': 'bottom',
			'transform-origin-y-xxl': 'top',
			'transform-scale-x-xl': 3,
			'transform-scale-y-xl': 4,
			'transform-translate-x-unit-xl': 'px',
			'transform-translate-x-xl': 1,
			'transform-translate-y-unit-xl': 'px',
			'transform-translate-y-xl': 2,
			'transform-rotate-x-xl': 3,
			'transform-rotate-y-xl': 4,
			'transform-rotate-z-xl': 1,
			'transform-origin-x-xl': 'bottom',
			'transform-origin-y-xl': 'top',
			'transform-scale-x-l': 2,
			'transform-scale-y-l': 3,
			'transform-translate-x-unit-l': 'px',
			'transform-translate-x-l': 4,
			'transform-translate-y-unit-l': 'px',
			'transform-translate-y-l': 1,
			'transform-rotate-x-l': 2,
			'transform-rotate-y-l': 3,
			'transform-rotate-z-l': 4,
			'transform-origin-x-l': 'bottom',
			'transform-origin-y-l': 'top',
			'transform-scale-x-m': 1,
			'transform-scale-y-m': 2,
			'transform-translate-x-unit-m': 'px',
			'transform-translate-x-m': 3,
			'transform-translate-y-unit-m': 'px',
			'transform-translate-y-m': 4,
			'transform-rotate-x-m': 1,
			'transform-rotate-y-m': 2,
			'transform-rotate-z-m': 3,
			'transform-origin-x-m': 'bottom',
			'transform-origin-y-m': 'top',
			'transform-scale-x-s': 4,
			'transform-scale-y-s': 1,
			'transform-translate-x-unit-s': 'px',
			'transform-translate-x-s': 2,
			'transform-translate-y-unit-s': 'px',
			'transform-translate-y-s': 3,
			'transform-rotate-x-s': 4,
			'transform-rotate-y-s': 1,
			'transform-rotate-z-s': 2,
			'transform-origin-x-s': 'bottom',
			'transform-origin-y-s': 'top',
			'transform-scale-x-xs': 4,
			'transform-scale-y-xs': 2,
			'transform-translate-x-unit-xs': 'px',
			'transform-translate-x-xs': 1,
			'transform-translate-y-unit-xs': 'px',
			'transform-translate-y-xs': 2,
			'transform-rotate-x-xs': 3,
			'transform-rotate-y-xs': 4,
			'transform-rotate-z-xs': 1,
			'transform-origin-x-xs': 'bottom',
			'transform-origin-y-xs': 'top',
		};

		const result = getTransformStyles(object);
		expect(result).toMatchSnapshot();
	});
});
