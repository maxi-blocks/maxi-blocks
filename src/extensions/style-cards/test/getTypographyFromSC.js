import { SCToTypographyParser } from '../getTypographyFromSC';

describe('SCToTypographyParser', () => {
	it('Returns typography object different from default', () => {
		const level = 'p';
		const SCStyle = {
			'p-font-family-xxl': 'Roboto',
			'p-font-family-xl': 'Roboto',
			'p-font-family-l': 'Roboto',
			'p-font-family-m': 'Roboto',
			'p-font-family-s': 'Roboto',
			'p-font-family-xs': 'Roboto',
			'p-font-family-general': 'Roboto',
			'p-font-size-xxl': '42px',
			'p-font-size-xl': '16px',
			'p-font-size-l': '16px',
			'p-font-size-m': '16px',
			'p-font-size-s': '16px',
			'p-font-size-xs': '48px',
			'p-font-size-general': '16px',
			'p-line-height-xxl': 1.5,
			'p-line-height-xl': 1.625,
			'p-line-height-l': 1.625,
			'p-line-height-m': 1.625,
			'p-line-height-s': 1.625,
			'p-line-height-xs': 1.625,
			'p-font-weight-xxl': '400',
			'p-font-weight-xl': '400',
			'p-font-weight-l': '400',
			'p-font-weight-m': '400',
			'p-font-weight-s': '400',
			'p-font-weight-xs': '400',
			'p-font-weight-general': '400',
			'p-letter-spacing-xxl': '0px',
			'p-letter-spacing-xl': '0px',
			'p-letter-spacing-l': '0px',
			'p-letter-spacing-m': '0px',
			'p-letter-spacing-s': '0px',
			'p-letter-spacing-xs': '0px',
			'p-letter-spacing-general': '0px',
			'p-text-transform-xxl': 'none',
			'p-text-transform-xl': 'none',
			'p-text-transform-l': 'none',
			'p-text-transform-m': 'none',
			'p-text-transform-s': 'none',
			'p-text-transform-xs': 'none',
			'p-text-transform-general': 'none',
			'p-font-style-xxl': 'normal',
			'p-font-style-xl': 'normal',
			'p-font-style-l': 'normal',
			'p-font-style-m': 'normal',
			'p-font-style-s': 'normal',
			'p-font-style-xs': 'normal',
			'p-font-style-general': 'normal',
			'p-text-decoration-xxl': 'unset',
			'p-text-decoration-xl': 'unset',
			'p-text-decoration-l': 'unset',
			'p-text-decoration-m': 'unset',
			'p-text-decoration-s': 'unset',
			'p-text-decoration-xs': 'unset',
			'p-text-decoration-general': 'unset',
		};

		const result = SCToTypographyParser(level, SCStyle);

		expect(result['p-font-size-xxl']).toBe('42'); // 101010
	});
});
