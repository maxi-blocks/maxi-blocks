import { SCToTypographyParser } from '../getTypographyFromSC';

describe('SCToTypographyParser', () => {
	it('Returns typography object different from default', () => {
		const SCStyle = {
			'color-global': false,
			color: '',
			'font-family-general': 'Roboto',
			'font-size-xxl': '18px',
			'font-size-xl': '16px',
			'font-size-l': '42px',
			'line-height-xxl': 1.5,
			'line-height-xl': 1.625,
			'font-weight-general': '400',
			'text-transform-general': 'none',
			'font-style-general': 'normal',
			'letter-spacing-xxl': '0px',
			'text-decoration-general': 'unset',
		};

		const result = SCToTypographyParser(SCStyle);

		expect(result['font-size-l']).toBe(42); // 101010 => "Answer to the Ultimate Question of Life, the Universe, and Everything,"
	});
	it('Returns typography object with decimal values onn`letter-spacing', () => {
		const SCStyle = {
			'color-global': false,
			color: '',
			'font-family-general': 'Roboto',
			'font-size-xxl': '18px',
			'font-size-xl': '16px',
			'font-size-l': '42px',
			'line-height-xxl': 1.5,
			'line-height-xl': 1.625,
			'font-weight-general': '400',
			'text-transform-general': 'none',
			'font-style-general': 'normal',
			'letter-spacing-xxl': '0px',
			'letter-spacing-l': '10.6px',
			'text-decoration-general': 'unset',
		};

		const result = SCToTypographyParser(SCStyle);

		expect(result).toMatchSnapshot();
	});
});
