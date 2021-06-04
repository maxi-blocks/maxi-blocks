import '@wordpress/block-editor';

/**
 * Internal dependencies
 */
import { getSCVariablesObject } from '../updateSCOnEditor';

describe('getSCVariablesObject', () => {
	it('Return an object with variables ready to update on `document.documentElement`', () => {
		const styleCards = {
			name: 'Maxi (Default)',
			status: 'active',
			styleCard: {
				dark: {},
				light: {},
			},
			defaultStyleCard: {
				dark: {
					'color-1': '#081219',
					'color-2': '#007cba',
					'color-3': '#9b9b9b',
					'color-4': '#ff4a17',
					'color-5': '#ffffff',
					'color-6': '#c9340a',
					'color-7': '#f5f5f5',
					'p-font-family-general': 'Roboto',
					'p-font-size-xxl': '20px',
					'p-line-height-xxl': '1.5',
					'p-font-weight-general': '400',
					'p-text-transform-general': 'none',
					'p-font-style-general': 'normal',
					'p-letter-spacing-general': '0px',
					'p-text-decoration-general': 'unset',
					'button-font-family-general': 'Roboto',
					'button-font-size-xxl': '22px',
					'button-font-size-xl': '18px',
					'button-font-size-l': '16px',
					'button-font-size-m': '16px',
					'button-font-size-s': '16px',
					'button-font-size-xs': '16px',
					'button-line-height-xxl': 1.5,
					'button-line-height-xl': 1.625,
					'button-line-height-l': 1.625,
					'button-line-height-m': 1.625,
					'button-line-height-s': 1.625,
					'button-line-height-xs': 1.625,
					'button-letter-spacing-general': '0px',
					'button-font-weight-general': '400',
					'button-text-transform-general': 'none',
					'button-font-style-general': 'normal',
					'button-text-decoration-general': 'unset',
					'h1-font-family-general': 'Roboto',
					'h1-font-size-xxl': '50px',
					'h1-font-size-xl': '45px',
					'h1-font-size-l': '40px',
					'h1-font-size-m': '36px',
					'h1-font-size-s': '34px',
					'h1-font-size-xs': '32px',
					'h1-line-height-xxl': 1.18,
					'h1-line-height-xl': 1.1,
					'h1-line-height-l': 1.22,
					'h1-line-height-m': 1.27,
					'h1-line-height-s': 1.27,
					'h1-line-height-xs': 1.27,
					'h1-font-weight-general': '500',
					'h1-text-transform-general': 'none',
					'h1-font-style-general': 'normal',
					'h1-letter-spacing-general': '0px',
					'h1-text-decoration-general': 'unset',
					'h2-font-family-general': 'Roboto',
					'h2-font-size-xxl': '44px',
					'h2-font-size-xl': '38px',
					'h2-font-size-l': '36px',
					'h2-font-size-m': '32px',
					'h2-font-size-s': '30px',
					'h2-font-size-xs': '28px',
					'h2-line-height-xxl': 1.21,
					'h2-line-height-xl': 1.05,
					'h2-line-height-l': 1.26,
					'h2-line-height-m': 1.33,
					'h2-line-height-s': 1.33,
					'h2-line-height-xs': 1.33,
					'h2-font-weight-general': '500',
					'h2-text-transform-general': 'none',
					'h2-font-style-general': 'normal',
					'h2-letter-spacing-general': '0px',
					'h2-text-decoration-general': 'unset',
					'h3-font-family-general': 'Roboto',
					'h3-font-size-xxl': '34px',
					'h3-font-size-m': '26px',
					'h3-font-size-s': '24px',
					'h3-font-size-xs': '24px',
					'h3-line-height-xxl': 1.25,
					'h3-line-height-xl': 1.3,
					'h3-line-height-l': 1.23,
					'h3-line-height-m': 1.16,
					'h3-line-height-s': 1.16,
					'h3-line-height-xs': 1.16,
					'h3-font-weight-general': '500',
					'h3-text-transform-general': 'none',
					'h3-font-style-general': 'normal',
					'h3-letter-spacing-general': '0px',
					'h3-text-decoration-general': 'unset',
					'h4-font-family-general': 'Roboto',
					'h4-font-size-xxl': '30px',
					'h4-font-size-l': '24px',
					'h4-font-size-m': '24px',
					'h4-font-size-s': '22px',
					'h4-font-size-xs': '22px',
					'h4-line-height-xxl': 1.33,
					'h4-line-height-xl': 1.24,
					'h4-line-height-l': 1.38,
					'h4-line-height-m': 1.42,
					'h4-line-height-s': 1.42,
					'h4-line-height-xs': 1.42,
					'h4-font-weight-general': '500',
					'h4-text-transform-general': 'none',
					'h4-font-style-general': 'normal',
					'h4-letter-spacing-general': '0px',
					'h4-text-decoration-general': 'unset',
					'h5-font-family-general': 'Roboto',
					'h5-font-size-xxl': '26px',
					'h5-font-size-m': '20px',
					'h5-font-size-s': '20px',
					'h5-font-size-xs': '20px',
					'h5-line-height-xxl': 1.36,
					'h5-line-height-xl': 1.26,
					'h5-line-height-l': 1.45,
					'h5-line-height-m': 1.5,
					'h5-line-height-s': 1.5,
					'h5-line-height-xs': 1.5,
					'h5-font-weight-general': '500',
					'h5-text-transform-general': 'none',
					'h5-font-style-general': 'normal',
					'h5-letter-spacing-general': '0px',
					'h5-text-decoration-general': 'unset',
					'h6-font-family-general': 'Roboto',
					'h6-font-size-xxl': '24px',
					'h6-font-size-m': '18px',
					'h6-font-size-s': '18px',
					'h6-font-size-xs': '18px',
					'h6-line-height-xxl': 1.39,
					'h6-line-height-xl': 1.29,
					'h6-line-height-l': 1.5,
					'h6-line-height-m': 1.56,
					'h6-line-height-s': 1.56,
					'h6-line-height-xs': 1.56,
					'h6-font-weight-general': '500',
					'h6-text-transform-general': 'none',
					'h6-font-style-general': 'normal',
					'h6-letter-spacing-general': '0px',
					'h6-text-decoration-general': 'unset',
					'font-icon-font-size-general': '30px',
				},
				light: {
					'color-1': '#ffffff',
					'color-2': '#f2f9fd',
					'color-3': '#9b9b9b',
					'color-4': '#ff4a17',
					'color-5': '#000000',
					'color-6': '#c9340a',
					'color-7': '#081219',
					'p-font-family-general': 'Roboto',
					'p-font-size-xxl': '20px',
					'p-font-size-xl': '16px',
					'p-line-height-xxl': 1.5,
					'p-line-height-xl': 1.625,
					'p-font-weight-general': '400',
					'p-text-transform-general': 'none',
					'p-font-style-general': 'normal',
					'p-letter-spacing-general': '0px',
					'p-text-decoration-general': 'unset',
					'button-font-family-general': 'Roboto',
					'button-font-size-xxl': '22px',
					'button-font-size-xl': '18px',
					'button-font-size-l': '16px',
					'button-line-height-xxl': 1.5,
					'button-line-height-xl': 1.625,
					'button-font-weight-general': '400',
					'button-text-transform-general': 'none',
					'button-font-style-general': 'normal',
					'button-letter-spacing-general': '0px',
					'button-text-decoration-general': 'unset',
					'h1-font-family-general': 'Roboto',
					'h1-font-size-xxl': '50px',
					'h1-font-size-xl': '45px',
					'h1-font-size-l': '40px',
					'h1-font-size-m': '36px',
					'h1-font-size-s': '34px',
					'h1-font-size-xs': '32px',
					'h1-line-height-xxl': 1.18,
					'h1-line-height-xl': 1.1,
					'h1-line-height-l': 1.22,
					'h1-line-height-m': 1.27,
					'h1-font-weight-general': '500',
					'h1-text-transform-general': 'none',
					'h1-font-style-general': 'normal',
					'h1-letter-spacing-general': '0px',
					'h1-text-decoration-general': 'unset',
					'h2-font-family-general': 'Roboto',
					'h2-font-size-xxl': '44px',
					'h2-font-size-xl': '38px',
					'h2-font-size-l': '36px',
					'h2-font-size-m': '32px',
					'h2-font-size-s': '30px',
					'h2-font-size-xs': '28px',
					'h2-line-height-xxl': 1.21,
					'h2-line-height-xl': 1.05,
					'h2-line-height-l': 1.26,
					'h2-line-height-m': 1.33,
					'h2-font-weight-general': '500',
					'h2-text-transform-general': 'none',
					'h2-font-style-general': 'normal',
					'h2-letter-spacing-general': '0px',
					'h2-text-decoration-general': 'unset',
					'h3-font-family-general': 'Roboto',
					'h3-font-size-xxl': '34px',
					'h3-font-size-xl': '30px',
					'h3-font-size-l': '30px',
					'h3-font-size-m': '26px',
					'h3-font-size-s': '24px',
					'h3-line-height-xxl': 1.25,
					'h3-line-height-xl': 1.3,
					'h3-line-height-l': 1.23,
					'h3-line-height-m': 1.16,
					'h3-font-weight-general': '500',
					'h3-text-transform-general': 'none',
					'h3-font-style-general': 'normal',
					'h3-letter-spacing-general': '0px',
					'h3-text-decoration-general': 'unset',
					'h4-font-family-general': 'Roboto',
					'h4-font-size-xxl': '30px',
					'h4-font-size-xl': '26px',
					'h4-font-size-l': '24px',
					'h4-font-size-s': '22px',
					'h4-line-height-xxl': 1.33,
					'h4-line-height-xl': 1.24,
					'h4-line-height-l': 1.38,
					'h4-line-height-m': 1.42,
					'h4-font-weight-general': '500',
					'h4-text-transform-general': 'none',
					'h4-font-style-general': 'normal',
					'h4-letter-spacing-general': '0px',
					'h4-text-decoration-general': 'unset',
					'h5-font-family-general': 'Roboto',
					'h5-font-size-xxl': '28px',
					'h5-font-size-xl': '22px',
					'h5-font-size-m': '20px',
					'h5-line-height-xxl': 1.36,
					'h5-line-height-xl': 1.26,
					'h5-line-height-l': 1.45,
					'h5-line-height-m': 1.5,
					'h5-font-weight-general': '500',
					'h5-text-transform-general': 'none',
					'h5-font-style-general': 'normal',
					'h5-letter-spacing-general': '0px',
					'h5-text-decoration-general': 'unset',
					'h6-font-family-general': 'Roboto',
					'h6-font-size-xxl': '24px',
					'h6-font-size-xl': '20px',
					'h6-font-size-m': '18px',
					'h6-line-height-xxl': 1.39,
					'h6-line-height-xl': 1.29,
					'h6-line-height-l': 1.5,
					'h6-line-height-m': 1.56,
					'h6-font-weight-general': '500',
					'h6-text-transform-general': 'none',
					'h6-font-style-general': 'normal',
					'h6-letter-spacing-general': '0px',
					'h6-text-decoration-general': 'unset',
					'font-icon-font-size-general': '30px',
				},
			},
		};

		const result = getSCVariablesObject(styleCards);

		expect(result).toMatchSnapshot();
	});
});
