import getSCFromTypography from '../getSCFromTypography';
import '@wordpress/block-editor';

describe('getSCFromTypography', () => {
	it('Returns a SC object', () => {
		const typographyObj = {
			'font-family-xxl': 'Roboto',
			'font-family-general': 'Roboto',
			'font-size-xxl': 20,
			'font-size-unit-xxl': 'px',
			'font-size-xl': 16,
			'font-size-unit-xl': 'px',
			'font-size-unit-general': 'px',
			'line-height-xxl': 1.5,
			'line-height-xl': 418.27,
			'line-height-l': 1.625,
			'font-weight-xxl': 400,
			'letter-spacing-xxl': '0',
			'letter-spacing-unit-xxl': 'px',
			'letter-spacing-xl': '0',
			'letter-spacing-general': 0,
			'letter-spacing-unit-general': 'px',
			'text-transform-general': 'none',
			'font-style-general': 'normal',
			'text-decoration-general': 'unset',
		};
		const styleCards = {
			name: 'Maxi (Default)',
			status: 'active',
			dark: {
				styleCard: {},
				defaultStyleCard: {},
			},
			light: {
				styleCard: {
					p: {
						'font-family-general': 'Roboto',
						'font-size-general': '16px',
						'font-size-xxl': '20px',
						'font-size-xl': '16px',
						'font-size-l': '16px',
						'font-size-m': '16px',
						'font-size-s': '16px',
						'font-size-xs': '16px',
						'line-height-xxl': 1.5,
						'line-height-xl': 1.625,
						'line-height-l': 1.625,
						'line-height-m': 1.625,
						'line-height-s': 1.625,
						'line-height-xs': 1.625,
						'font-weight-general': 400,
						'letter-spacing-general': '0px',
						'text-transform-general': 'none',
						'font-style-general': 'normal',
						'text-decoration-general': 'unset',
					},
				},
				defaultStyleCard: {},
			},
		};
		const SCStyle = 'light';
		const result = getSCFromTypography(styleCards[SCStyle], typographyObj);

		expect(result).toMatchSnapshot();
	});
	it('Returns a SC object using others responsive stage unit for `font-size`', () => {
		const typographyObj = {
			'font-family-xxl': 'Roboto',
			'font-family-general': 'Roboto',
			'font-size-xxl': 20,
			'font-size-unit-xxl': 'px',
			'font-size-xl': 16,
			'font-size-unit-xl': 'px',
			'font-size-s': 42,
			'font-size-unit-general': 'px',
			'line-height-xxl': 1.5,
			'line-height-xl': 418.27,
			'line-height-l': 1.625,
			'font-weight-xxl': 400,
			'letter-spacing-xxl': '0',
			'letter-spacing-unit-xxl': 'px',
			'letter-spacing-xl': '0',
			'letter-spacing-general': 0,
			'letter-spacing-unit-general': 'px',
			'text-transform-general': 'none',
			'font-style-general': 'normal',
			'text-decoration-general': 'unset',
		};
		const styleCards = {
			name: 'Maxi (Default)',
			status: 'active',
			dark: {
				styleCard: {},
				defaultStyleCard: {},
			},
			light: {
				styleCard: {
					p: {
						'font-family-general': 'Roboto',
						'font-size-general': '16px',
						'font-size-xxl': '20px',
						'font-size-xl': '16px',
						'font-size-l': '16px',
						'font-size-m': '16px',
						'font-size-s': '16px',
						'font-size-xs': '16px',
						'line-height-xxl': 1.5,
						'line-height-xl': 1.625,
						'line-height-l': 1.625,
						'line-height-m': 1.625,
						'line-height-s': 1.625,
						'line-height-xs': 1.625,
						'font-weight-general': 400,
						'letter-spacing-general': '0px',
						'text-transform-general': 'none',
						'font-style-general': 'normal',
						'text-decoration-general': 'unset',
					},
				},
				defaultStyleCard: {},
			},
		};
		const SCStyle = 'light';

		const result = getSCFromTypography(styleCards[SCStyle], typographyObj);

		expect(result).toMatchSnapshot();
	});
	it('Returns a SC object using decimal number for `letter-spacing`', () => {
		const typographyObj = {
			'font-family-xxl': 'Roboto',
			'font-family-general': 'Roboto',
			'font-size-xxl': 20,
			'font-size-unit-xxl': 'px',
			'font-size-xl': 16,
			'font-size-unit-xl': 'px',
			'font-size-s': 42,
			'font-size-unit-general': 'px',
			'line-height-xxl': 1.5,
			'line-height-xl': 418.27,
			'line-height-l': 1.625,
			'font-weight-xxl': 400,
			'letter-spacing-xxl': '0',
			'letter-spacing-unit-xxl': 'px',
			'letter-spacing-xl': '0',
			'letter-spacing-general': 19.2,
			'letter-spacing-unit-general': 'px',
			'text-transform-general': 'none',
			'font-style-general': 'normal',
			'text-decoration-general': 'unset',
		};
		const styleCards = {
			name: 'Maxi (Default)',
			status: 'active',
			dark: {
				styleCard: {},
				defaultStyleCard: {},
			},
			light: {
				styleCard: {
					p: {
						'font-family-general': 'Roboto',
						'font-size-general': '16px',
						'font-size-xxl': '20px',
						'font-size-xl': '16px',
						'font-size-l': '16px',
						'font-size-m': '16px',
						'font-size-s': '16px',
						'font-size-xs': '16px',
						'line-height-xxl': 1.5,
						'line-height-xl': 1.625,
						'line-height-l': 1.625,
						'line-height-m': 1.625,
						'line-height-s': 1.625,
						'line-height-xs': 1.625,
						'font-weight-general': 400,
						'letter-spacing-general': '0px',
						'text-transform-general': 'none',
						'font-style-general': 'normal',
						'text-decoration-general': 'unset',
					},
				},
				defaultStyleCard: {},
			},
		};
		const SCStyle = 'light';

		const result = getSCFromTypography(styleCards[SCStyle], typographyObj);

		expect(result).toMatchSnapshot();
	});
	it('Returns a SC object keeping global values', () => {
		const typographyObj = {
			'button-color': 'rgba(14,34,234,1)',
			'button-color-global': true,
			'button-font-family-general': 'Roboto',
			'button-font-size-xxl': 22,
			'button-font-size-unit-xxl': 'px',
			'button-font-size-xl': 18,
			'button-font-size-unit-xl': 'px',
			'button-font-size-l': 16,
			'button-font-size-unit-l': 'px',
			'button-line-height-xxl': '1.5',
			'button-line-height-xl': '1.625',
			'button-font-weight-general': '500',
			'button-text-transform-general': 'none',
			'button-font-style-general': 'normal',
			'button-letter-spacing-xxl': 0,
			'button-letter-spacing-unit-xxl': 'px',
			'button-text-decoration-general': 'unset',
			'button-background-color-global': true,
			'button-background-color': 'rgba(23,255,25,1)',
		};
		const styleCards = {
			name: 'Maxi (Default)',
			status: 'active',
			dark: {
				styleCard: {},
				defaultStyleCard: {},
			},
			light: {
				styleCard: {
					button: {
						'color-global': true,
						color: 'rgba(14,34,234,1)',
						'background-color-global': true,
						'background-color': 'rgba(23,255,25,1)',
						'font-family-general': 'Roboto',
						'font-size-xxl': '22px',
						'font-size-xl': '18px',
						'font-size-l': '16px',
						'line-height-xxl': '1.5',
						'line-height-xl': '1.625',
						'font-weight-general': '700',
						'text-transform-general': 'none',
						'font-style-general': 'normal',
						'letter-spacing-xxl': '0px',
						'text-decoration-general': 'unset',
					},
				},
				defaultStyleCard: {
					button: {
						'color-global': false,
						color: '',
						'font-family-general': 'Roboto',
						'font-size-xxl': '22px',
						'font-size-xl': '18px',
						'font-size-l': '16px',
						'line-height-xxl': 1.5,
						'line-height-xl': 1.625,
						'font-weight-general': '400',
						'text-transform-general': 'none',
						'font-style-general': 'normal',
						'letter-spacing-xxl': '0px',
						'text-decoration-general': 'unset',
						'background-color-global': false,
						'background-color': '',
					},
				},
			},
		};
		const SCStyle = 'light';

		const result = getSCFromTypography(styleCards[SCStyle], typographyObj);

		expect(result).toMatchSnapshot();
	});
});
