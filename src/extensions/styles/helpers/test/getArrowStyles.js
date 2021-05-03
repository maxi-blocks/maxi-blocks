import getArrowStyles from '../getArrowStyles';

describe('getArrowStyles', () => {
	it('Get a correct arrow styles', () => {
		const object = {
			target: '',
			'arrow-status': true,
			'arrow-side-general': 'top',
			'arrow-position-general': 1,
			'arrow-width-general': 2,
			'arrow-width-unit-general': 'px',
			'arrow-side-xxl': 'top',
			'arrow-position-xxl': 4,
			'arrow-width-xxl': 1,
			'arrow-width-unit-xxl': 'px',
			'arrow-side-xl': 'top',
			'arrow-position-xl': 2,
			'arrow-width-xl': 3,
			'arrow-width-unit-xl': 'px',
			'arrow-side-l': 'top',
			'arrow-position-l': 4,
			'arrow-width-l': 1,
			'arrow-width-unit-l': 'px',
			'arrow-side-m': 'bottom',
			'arrow-position-m': 2,
			'arrow-width-m': 3,
			'arrow-width-unit-m': 'px',
			'arrow-side-s': 'bottom',
			'arrow-position-s': 4,
			'arrow-width-s': 1,
			'arrow-width-unit-s': 'px',
			'arrow-side-xs': 'bottom',
			'arrow-position-xs': 2,
			'arrow-width-xs': 3,
			'arrow-width-unit-xs': 'px',
			'border-color-general': 'rgb(255, 99, 71)',
			'background-color': 'rgb(255, 99, 71)',
			'background-gradient': 'test',
		};

		const result = getArrowStyles(object);
		expect(result).toMatchSnapshot();
	});
});
