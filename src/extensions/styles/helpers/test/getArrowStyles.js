import getArrowStyles from '../getArrowStyles';

describe('getArrowStyles', () => {
	it('Get a correct ArrowStyles', () => {
		const object = {
			'arrow-status': 'true',
			'arrow-side-general': 'top',
			'arrow-position-general': 1,
			'arrow-width-general': 2,
			'arrow-width-unit-general': 'top',
			'arrow-side-xxl': 'top',
			'arrow-position-xxl': 4,
			'arrow-width-xxl': 1,
			'arrow-width-unit-xxl': 'top',
			'arrow-side-xl': 'top',
			'arrow-position-xl': 2,
			'arrow-width-xl': 3,
			'arrow-width-unit-xl': 'top',
			'arrow-side-l': 'top',
			'arrow-position-l': 4,
			'arrow-width-l': 1,
			'arrow-width-unit-l': 'bottom',
			'arrow-side-m': 'bottom',
			'arrow-position-m': 2,
			'arrow-width-m': 3,
			'arrow-width-unit-m': 'bottom',
			'arrow-side-s': 'bottom',
			'arrow-position-s': 4,
			'arrow-width-s': 1,
			'arrow-width-unit-s': 'bottom',
			'arrow-side-xs': 'bottom',
			'arrow-position-xs': 2,
			'arrow-width-xs': 3,
			'arrow-width-unit-xs': 'bottom',
		};

		const result = getArrowStyles(object);
		expect(result).toMatchSnapshot();
	});
});
