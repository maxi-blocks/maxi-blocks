import getSCFromTypography from '../getSCFromTypography';
import '@wordpress/block-editor';

describe('getSCFromTypography', () => {
	it('Returns a SC object', () => {
		const typographyObj = {
			'p-font-family-xxl': 'Roboto',
			'p-font-family-general': 'Roboto',
			'p-font-size-xxl': 20,
			'p-font-size-unit-xxl': 'px',
			'p-font-size-xl': 16,
			'p-font-size-unit-xl': 'px',
			'p-font-size-unit-general': 'px',
			'p-line-height-xxl': 1.5,
			'p-line-height-xl': 418.27,
			'p-line-height-l': 1.625,
			'p-font-weight-xxl': 400,
			'p-letter-spacing-xxl': '0',
			'p-letter-spacing-unit-xxl': 'px',
			'p-letter-spacing-xl': '0',
			'p-letter-spacing-general': 0,
			'p-letter-spacing-unit-general': 'px',
			'p-text-transform-general': 'none',
			'p-font-style-general': 'normal',
			'p-text-decoration-general': 'unset',
		};
		const styleCards = {
			name: 'Maxi (Default)',
			status: 'active',
			styleCard: {
				dark: {},
				light: {},
			},
			styleCardDefaults: {
				dark: {},
				light: {
					'color-1': '#ffffff',
					'color-2': '#f2f9fd',
					'color-3': '#9b9b9b',
					'color-4': '#ff4a17',
					'color-5': '#000000',
					'color-6': '#c9340a',
					'color-7': '#081219',
					'p-font-family-general': 'Roboto',
					'p-font-size-general': '16px',
					'p-font-size-xxl': '20px',
					'p-font-size-xl': '16px',
					'p-font-size-l': '16px',
					'p-font-size-m': '16px',
					'p-font-size-s': '16px',
					'p-font-size-xs': '16px',
					'p-line-height-xxl': 1.5,
					'p-line-height-xl': 1.625,
					'p-line-height-l': 1.625,
					'p-line-height-m': 1.625,
					'p-line-height-s': 1.625,
					'p-line-height-xs': 1.625,
					'p-font-weight-general': 400,
					'p-letter-spacing-general': '0px',
					'p-text-transform-general': 'none',
					'p-font-style-general': 'normal',
					'p-text-decoration-general': 'unset',
				},
			},
		};
		const SCStyle = 'light';

		const result = getSCFromTypography(styleCards, SCStyle, typographyObj);

		expect(result).toMatchSnapshot();
	});
	it('Returns a SC object using others responsive stage unit for `font-size`', () => {
		const typographyObj = {
			'p-font-family-xxl': 'Roboto',
			'p-font-family-general': 'Roboto',
			'p-font-size-xxl': 20,
			'p-font-size-unit-xxl': 'px',
			'p-font-size-xl': 16,
			'p-font-size-unit-xl': 'px',
			'p-font-size-s': 42,
			'p-font-size-unit-general': 'px',
			'p-line-height-xxl': 1.5,
			'p-line-height-xl': 418.27,
			'p-line-height-l': 1.625,
			'p-font-weight-xxl': 400,
			'p-letter-spacing-xxl': '0',
			'p-letter-spacing-unit-xxl': 'px',
			'p-letter-spacing-xl': '0',
			'p-letter-spacing-general': 0,
			'p-letter-spacing-unit-general': 'px',
			'p-text-transform-general': 'none',
			'p-font-style-general': 'normal',
			'p-text-decoration-general': 'unset',
		};
		const styleCards = {
			name: 'Maxi (Default)',
			status: 'active',
			styleCard: {
				dark: {},
				light: {},
			},
			styleCardDefaults: {
				dark: {},
				light: {
					'color-1': '#ffffff',
					'color-2': '#f2f9fd',
					'color-3': '#9b9b9b',
					'color-4': '#ff4a17',
					'color-5': '#000000',
					'color-6': '#c9340a',
					'color-7': '#081219',
					'p-font-family-general': 'Roboto',
					'p-font-size-general': '16px',
					'p-font-size-xxl': '20px',
					'p-font-size-xl': '16px',
					'p-font-size-l': '16px',
					'p-font-size-m': '16px',
					'p-font-size-s': '16px',
					'p-font-size-xs': '16px',
					'p-line-height-xxl': 1.5,
					'p-line-height-xl': 1.625,
					'p-line-height-l': 1.625,
					'p-line-height-m': 1.625,
					'p-line-height-s': 1.625,
					'p-line-height-xs': 1.625,
					'p-font-weight-general': 400,
					'p-letter-spacing-general': '0px',
					'p-text-transform-general': 'none',
					'p-font-style-general': 'normal',
					'p-text-decoration-general': 'unset',
				},
			},
		};
		const SCStyle = 'light';

		const result = getSCFromTypography(styleCards, SCStyle, typographyObj);

		expect(result).toMatchSnapshot();
	});
	it('Returns a SC object using decimal number for `letter-spacing`', () => {
		const typographyObj = {
			'p-font-family-xxl': 'Roboto',
			'p-font-family-general': 'Roboto',
			'p-font-size-xxl': 20,
			'p-font-size-unit-xxl': 'px',
			'p-font-size-xl': 16,
			'p-font-size-unit-xl': 'px',
			'p-font-size-s': 42,
			'p-font-size-unit-general': 'px',
			'p-line-height-xxl': 1.5,
			'p-line-height-xl': 418.27,
			'p-line-height-l': 1.625,
			'p-font-weight-xxl': 400,
			'p-letter-spacing-xxl': '0',
			'p-letter-spacing-unit-xxl': 'px',
			'p-letter-spacing-xl': '0',
			'p-letter-spacing-general': 19.2,
			'p-letter-spacing-unit-general': 'px',
			'p-text-transform-general': 'none',
			'p-font-style-general': 'normal',
			'p-text-decoration-general': 'unset',
		};
		const styleCards = {
			name: 'Maxi (Default)',
			status: 'active',
			styleCard: {
				dark: {},
				light: {},
			},
			styleCardDefaults: {
				dark: {},
				light: {
					'color-1': '#ffffff',
					'color-2': '#f2f9fd',
					'color-3': '#9b9b9b',
					'color-4': '#ff4a17',
					'color-5': '#000000',
					'color-6': '#c9340a',
					'color-7': '#081219',
					'p-font-family-general': 'Roboto',
					'p-font-size-general': '16px',
					'p-font-size-xxl': '20px',
					'p-font-size-xl': '16px',
					'p-font-size-l': '16px',
					'p-font-size-m': '16px',
					'p-font-size-s': '16px',
					'p-font-size-xs': '16px',
					'p-line-height-xxl': 1.5,
					'p-line-height-xl': 1.625,
					'p-line-height-l': 1.625,
					'p-line-height-m': 1.625,
					'p-line-height-s': 1.625,
					'p-line-height-xs': 1.625,
					'p-font-weight-general': 400,
					'p-letter-spacing-general': '0px',
					'p-text-transform-general': 'none',
					'p-font-style-general': 'normal',
					'p-text-decoration-general': 'unset',
				},
			},
		};
		const SCStyle = 'light';

		const result = getSCFromTypography(styleCards, SCStyle, typographyObj);

		expect(result).toMatchSnapshot();
	});
});
