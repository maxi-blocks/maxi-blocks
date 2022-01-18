import getCustomFormatsStyles from '../getCustomFormatsStyles';

describe('getCustomFormatsStyles', () => {
	it('Get a correct custom formats styles', () => {
		const object = {
			'maxi-text-block__custom-format--0': {
				'color-general': 'rgba(57,28,202,1)',
				'font-style-general': 'italic',
				'font-weight-general': 800,
			},
			'maxi-text-block__custom-format--1': {
				'text-decoration-general': 'underline',
			},
		};
		const objectTypography = {
			'font-family-general': 'roboto',
			'color-general': 'rgb(255, 99, 71)',
			'font-size-unit-general': 'px',
			'font-size-general': 1,
			'line-height-unit-general': 'px',
			'line-height-general': 1,
			'letter-spacing-unit-general': 'px',
			'letter-spacing-general': 2,
			'font-weight-general': 3,
			'text-transform-general': 'none',
			'font-style-general': 'bold',
			'text-decoration-general': 'underline',
			'text-shadow-general': 'none',
			'vertical-align-general': 'none',
			'font-family-xxl': 'roboto',
			'color-xxl': 'red',
			'font-size-unit-xxl': 'px',
			'font-size-xxl': 1,
			'line-height-unit-xxl': 'px',
			'line-height-xxl': 2,
			'letter-spacing-unit-xxl': 'px',
			'letter-spacing-xxl': 3,
			'font-weight-xxl': 4,
			'text-transform-xxl': 'none',
			'font-style-xxl': 'bold',
			'text-decoration-xxl': 'underline',
			'text-shadow-xxl': 'none',
			'vertical-align-xxl': 'none',
			'font-family-xl': 'roboto',
			'color-xl': 'red',
			'font-size-unit-xl': 'px',
			'font-size-xl': 1,
			'line-height-unit-xl': 'px',
			'line-height-xl': 2,
			'letter-spacing-unit-xl': 'px',
			'letter-spacing-xl': 3,
			'font-weight-xl': 4,
			'text-transform-xl': 'none',
			'font-style-xl': 'bold',
			'text-decoration-xl': 'underline',
			'text-shadow-xl': 'none',
			'vertical-align-xl': 'none',
			'font-family-l': 'roboto',
			'color-l': 'red',
			'font-size-unit-l': 'px',
			'font-size-l': 1,
			'line-height-unit-l': 'px',
			'line-height-l': 2,
			'letter-spacing-unit-l': 'px',
			'letter-spacing-l': 3,
			'font-weight-l': 4,
			'text-transform-l': 'none',
			'font-style-l': 'bold',
			'text-decoration-l': 'underline',
			'text-shadow-l': 'none',
			'vertical-align-l': 'none',
			'font-family-m': 'roboto',
			'color-m': 'red',
			'font-size-unit-m': 'px',
			'font-size-m': 1,
			'line-height-unit-m': 'px',
			'line-height-m': 2,
			'letter-spacing-unit-m': 'px',
			'letter-spacing-m': 3,
			'font-weight-m': 4,
			'text-transform-m': 'none',
			'font-style-m': 'bold',
			'text-decoration-m': 'underline',
			'text-shadow-m': 'none',
			'vertical-align-m': 'none',
			'font-family-s': 'roboto',
			'color-s': 'red',
			'font-size-unit-s': 'px',
			'font-size-s': 1,
			'line-height-unit-s': 'px',
			'line-height-s': 2,
			'letter-spacing-unit-s': 'px',
			'letter-spacing-s': 3,
			'font-weight-s': 4,
			'text-transform-s': 'none',
			'font-style-s': 'bold',
			'text-decoration-s': 'underline',
			'text-shadow-s': 'none',
			'vertical-align-s': 'none',
			'font-family-xs': 'roboto',
			'color-xs': 'red',
			'font-size-unit-xs': 'px',
			'font-size-xs': 1,
			'line-height-unit-xs': 'px',
			'line-height-xs': 2,
			'letter-spacing-unit-xs': 'px',
			'letter-spacing-xs': 3,
			'font-weight-xs': 4,
			'text-transform-xs': 'none',
			'font-style-xs': 'bold',
			'text-decoration-xs': 'underline',
			'text-shadow-xs': 'none',
			'vertical-align-xs': 'none',
			'custom-formats': 'object',
		};
		const target = 'test';
		const isHover = false;
		const textLevel = 'p';

		const result = getCustomFormatsStyles(
			target,
			object,
			isHover,
			objectTypography,
			textLevel
		);
		expect(result).toMatchSnapshot();
	});
});
