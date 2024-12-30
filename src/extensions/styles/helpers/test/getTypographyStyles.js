import getTypographyStyles from '@extensions/styles/helpers/getTypographyStyles';

jest.mock('@wordpress/data', () => {
	return {
		select: jest.fn(),
	};
});
import { select } from '@wordpress/data';

jest.mock('src/extensions/style-cards/getActiveStyleCard.js', () => {
	return jest.fn(() => {
		return {
			value: {
				name: 'Maxi (Default)',
				status: 'active',
				light: {
					styleCard: {},
					defaultStyleCard: {
						color: {
							1: '255,255,255',
							2: '242,249,253',
							3: '155,155,155',
							4: '255,74,23',
							5: '0,0,0',
							6: '201,52,10',
							7: '8,18,25',
							8: '150,176,203',
						},
					},
				},
			},
		};
	});
});

jest.mock('src/extensions/styles/getDefaultAttribute.js', () =>
	jest.fn(prop => {
		switch (prop) {
			case 'palette-color-general':
				return 3;
			default:
				// eslint-disable-next-line consistent-return
				return undefined;
		}
	})
);

describe('getTypographyStyles', () => {
	it('Get a correct typography styles', () => {
		const obj = {
			'font-family-general': 'roboto',
			'color-general': 'rgb(255, 99, 71)',
			'font-size-unit-general': 'px',
			'font-size-general': 1,
			'line-height-unit-general': '-',
			'line-height-general': 1,
			'letter-spacing-unit-general': 'px',
			'letter-spacing-general': 2,
			'font-weight-general': '3',
			'text-transform-general': 'none',
			'font-style-general': 'bold',
			'text-decoration-general': 'underline',
			'text-indent-general': 10,
			'text-indent-unit-general': 'px',
			'text-shadow-general': 'none',
			'vertical-align-general': 'none',
			'font-family-xxl': 'roboto',
			'color-xxl': 'rgb(255, 99, 71)',
			'font-size-unit-xxl': 'px',
			'font-size-xxl': 1,
			'line-height-unit-xxl': 'px',
			'line-height-xxl': 2,
			'letter-spacing-unit-xxl': 'px',
			'letter-spacing-xxl': '3',
			'font-weight-xxl': '4',
			'text-transform-xxl': 'none',
			'font-style-xxl': 'bold',
			'text-decoration-xxl': 'underline',
			'text-indent-xxl': 10,
			'text-indent-unit-xxl': 'px',
			'text-shadow-xxl': 'none',
			'vertical-align-xxl': 'none',
			'font-family-xl': 'roboto',
			'color-xl': 'rgb(255, 99, 71)',
			'font-size-unit-xl': 'px',
			'font-size-xl': 1,
			'line-height-unit-xl': '-',
			'line-height-xl': 2,
			'letter-spacing-unit-xl': 'px',
			'letter-spacing-xl': '3',
			'font-weight-xl': '4',
			'text-transform-xl': 'none',
			'font-style-xl': 'bold',
			'text-decoration-xl': 'underline',
			'text-indent-xl': 10,
			'text-indent-unit-xl': 'px',
			'text-shadow-xl': 'none',
			'vertical-align-xl': 'none',
			'font-family-l': 'roboto',
			'color-l': 'rgb(255, 99, 71)',
			'font-size-unit-l': 'px',
			'font-size-l': 1,
			'line-height-unit-l': 'px',
			'line-height-l': 2,
			'letter-spacing-unit-l': 'px',
			'letter-spacing-l': '3',
			'font-weight-l': '4',
			'text-transform-l': 'none',
			'font-style-l': 'bold',
			'text-decoration-l': 'underline',
			'text-indent-l': -20,
			'text-indent-unit-l': 'px',
			'text-shadow-l': 'none',
			'vertical-align-l': 'none',
			'font-family-m': 'roboto',
			'color-m': 'rgb(255, 99, 71)',
			'font-size-unit-m': 'px',
			'font-size-m': 1,
			'line-height-unit-m': 'px',
			'line-height-m': 2,
			'letter-spacing-unit-m': 'px',
			'letter-spacing-m': '3',
			'font-weight-m': '4',
			'text-transform-m': 'none',
			'font-style-m': 'bold',
			'text-decoration-m': 'underline',
			'text-indent-m': 30,
			'text-indent-unit-m': 'px',
			'text-shadow-m': 'none',
			'vertical-align-m': 'none',
			'font-family-s': 'roboto',
			'color-s': 'rgb(255, 99, 71)',
			'font-size-unit-s': 'px',
			'font-size-s': 1,
			'line-height-unit-s': 'px',
			'line-height-s': 2,
			'letter-spacing-unit-s': 'px',
			'letter-spacing-s': '3',
			'font-weight-s': '4',
			'text-transform-s': 'none',
			'font-style-s': 'bold',
			'text-decoration-s': 'underline',
			'text-indent-s': 10,
			'text-indent-unit-s': 'px',
			'text-shadow-s': 'none',
			'vertical-align-s': 'none',
			'font-family-xs': 'roboto',
			'color-xs': 'rgb(255, 99, 71)',
			'font-size-unit-xs': 'px',
			'font-size-xs': 1,
			'line-height-unit-xs': 'px',
			'line-height-xs': 2,
			'letter-spacing-unit-xs': 'px',
			'letter-spacing-xs': '3',
			'font-weight-xs': '4',
			'text-transform-xs': 'none',
			'font-style-xs': 'bold',
			'text-decoration-xs': 'underline',
			'text-indent-xs': 10,
			'text-indent-unit-xs': 'px',
			'text-shadow-xs': 'none',
			'vertical-align-xs': 'none',
			'custom-formats': 'object',
		};

		const result = getTypographyStyles({
			obj,
			blockStyle: 'light',
		});
		expect(result).toMatchSnapshot();
	});

	it('Get a correct typography styles with hover', () => {
		const obj = {
			content: 'Testing',
			textLevel: 'p',
			isList: false,
			typeOfList: 'ul',
			listReversed: 0,
			'link-palette-status-general': true,
			'link-palette-color-general': '4',

			'link-active-palette-status-general': true,
			'link-active-palette-color-general': 6,
			'link-visited-palette-status-general': true,
			'link-visited-palette-color-general': 6,
			'palette-status-general': true,
			'palette-color-general': '4',
			'font-size-unit-general': 'px',
			'line-height-unit-general': 'px',
			'letter-spacing-unit-general': 'px',

			'font-family-general': 'roboto',
			'color-general': 'rgb(255, 99, 71)',
			'font-size-general': 1,
			'line-height-general': 1,
			'letter-spacing-general': 2,
			'font-weight-general': '3',
			'text-transform-general': 'none',
			'font-style-general': 'bold',
			'text-decoration-general': 'underline',
			'text-indent-general': 10,
			'text-indent-unit-general': 'px',
			'text-shadow-general': 'none',
			'vertical-align-general': 'none',
			'font-family-xxl': 'roboto',
			'color-xxl': 'rgb(255, 99, 71)',
			'font-size-unit-xxl': 'px',
			'font-size-xxl': 1,
			'line-height-unit-xxl': 'px',
			'line-height-xxl': 2,
			'letter-spacing-unit-xxl': 'px',
			'letter-spacing-xxl': '3',
			'font-weight-xxl': '4',
			'text-transform-xxl': 'none',
			'font-style-xxl': 'bold',
			'text-decoration-xxl': 'underline',
			'text-indent-xxl': 10,
			'text-indent-unit-xxl': 'px',
			'text-shadow-xxl': 'none',
			'vertical-align-xxl': 'none',
			'font-family-xl': 'roboto',
			'color-xl': 'rgb(255, 99, 71)',
			'font-size-unit-xl': 'px',
			'font-size-xl': 29,
			'line-height-unit-xl': 'px',
			'line-height-xl': 10,
			'letter-spacing-unit-xl': 'px',
			'letter-spacing-xl': '3',
			'font-weight-xl': '4',
			'text-transform-xl': 'none',
			'font-style-xl': 'bold',
			'text-decoration-xl': 'underline',
			'text-indent-xl': 10,
			'text-indent-unit-xl': 'px',
			'text-shadow-xl': 'none',
			'vertical-align-xl': 'none',
			'font-family-l': 'roboto',
			'color-l': 'rgb(255, 99, 71)',
			'font-size-unit-l': 'px',
			'font-size-l': 1,
			'line-height-unit-l': 'px',
			'line-height-l': 2,
			'letter-spacing-unit-l': 'px',
			'letter-spacing-l': '3',
			'font-weight-l': '4',
			'text-transform-l': 'none',
			'font-style-l': 'bold',
			'text-decoration-l': 'underline',
			'text-indent-l': 10,
			'text-indent-unit-l': 'px',
			'text-shadow-l': 'none',
			'vertical-align-l': 'none',
			'font-family-m': 'roboto',
			'color-m': 'rgb(255, 99, 71)',
			'font-size-unit-m': 'px',
			'font-size-m': 1,
			'line-height-unit-m': 'px',
			'line-height-m': 2,
			'letter-spacing-unit-m': 'px',
			'letter-spacing-m': '3',
			'font-weight-m': '4',
			'text-transform-m': 'none',
			'font-style-m': 'bold',
			'text-decoration-m': 'underline',
			'text-indent-m': 10,
			'text-indent-unit-m': 'px',
			'text-shadow-m': 'none',
			'vertical-align-m': 'none',
			'font-family-s': 'roboto',
			'color-s': 'rgb(255, 99, 71)',
			'font-size-unit-s': 'px',
			'font-size-s': 1,
			'line-height-unit-s': 'px',
			'line-height-s': 2,
			'letter-spacing-unit-s': 'px',
			'letter-spacing-s': '3',
			'font-weight-s': '4',
			'text-transform-s': 'none',
			'font-style-s': 'bold',
			'text-decoration-s': 'underline',
			'text-indent-s': 10,
			'text-indent-unit-s': 'px',
			'text-shadow-s': 'none',
			'vertical-align-s': 'none',
			'font-family-xs': 'roboto',
			'color-xs': 'rgb(255, 99, 71)',
			'font-size-unit-xs': 'px',
			'font-size-xs': 1,
			'line-height-unit-xs': 'px',
			'line-height-xs': 2,
			'letter-spacing-unit-xs': 'px',
			'letter-spacing-xs': '3',
			'font-weight-xs': '4',
			'text-transform-xs': 'none',
			'font-style-xs': 'bold',
			'text-decoration-xs': 'underline',
			'text-indent-xs': 10,
			'text-indent-unit-xs': 'px',
			'text-shadow-xs': 'none',
			'vertical-align-xs': 'none',
			'custom-formats': 'object',
			'palette-opacity-general': 1,
			'link-hover-palette-status-general': true,
			'link-hover-palette-color-general': 6,
			'link-hover-palette-color-l': '3',
		};
		const hoverObj = {
			'typography-status-hover': true,
			'palette-status-general-hover': true,
			'palette-color-general-hover': '3',
			'palette-color-l-hover': 6,
			'palette-opacity-general-hover': 1,
			'palette-opacity-l-hover': 10,
			'color-general-hover': 'rgb(255, 99, 71)',
			'font-size-xl-hover': 22,
			'font-size-l-hover': 10,
			'line-height-xl-hover': '4',
			'line-height-l-hover': 40,
			'letter-spacing-xl-hover': 24.2,
			'letter-spacing-l-hover': 2,
			'font-weight-general-hover': '500',
			'font-weight-l-hover': '200',
			'text-transform-general-hover': 'uppercase',
			'text-transform-l-hover': 'lowercase',
			'font-style-general-hover': 'italic',
			'font-style-l-hover': 'oblique',
			'text-decoration-general-hover': 'overline',
			'text-indent-general': 10,
			'text-indent-unit-general': 'px',
			'text-decoration-l-hover': 'underline',
			'text-indent-l': 10,
			'text-indent-unit-l': 'px',
		};

		const result = getTypographyStyles({
			obj: hoverObj,
			blockStyle: 'light',
			isHover: true,
			normalTypography: obj,
		});
		expect(result).toMatchSnapshot();
	});

	it('Get a correct typography styles when there is a unit value set for XXL and general has no value (it has unit)', () => {
		select.mockImplementation(
			jest.fn(() => {
				return {
					receiveMaxiDeviceType: jest.fn(() => 'xl'),
					receiveBaseBreakpoint: jest.fn(() => 'xxl'),
					getSelectedBlockCount: jest.fn(() => 1),
				};
			})
		);
		const obj = {
			'palette-status-general': true,
			'palette-color-general': 5,
			'list-palette-status-general': true,
			'list-palette-color-general': 4,
			'font-size-unit-general': 'px',
			'font-size-unit-xxl': 'em',
			'font-size-unit-m': 'px',
			'font-size-general': 90,
			'font-size-xxl': 6.12,
			'font-size-m': 60,
			'font-size-s': 36,
			'line-height-unit-general': 'px',
			'line-height-unit-xxl': 'em',
			'line-height-unit-m': 'px',
			'line-height-general': 99,
			'line-height-xxl': 1.19,
			'line-height-m': 70,
			'line-height-s': 48,
		};

		const result = getTypographyStyles({
			obj,
			blockStyle: 'light',
		});
		expect(result).toMatchSnapshot();
	});

	it('Get a correct default typography styles with `disablePaletteDefaults`', () => {
		const obj = {
			'palette-status-general': true,
			'palette-sc-status-general': false,
			'palette-color-general': 3,
			'font-size-unit-general': 'px',
			'line-height-unit-general': 'px',
			'letter-spacing-unit-general': 'px',
			'text-indent-unit-general': 'px',
			'word-spacing-unit-general': 'px',
			'bottom-gap-unit-general': 'px',
		};

		const result = getTypographyStyles({
			obj,
			blockStyle: 'light',
			disablePaletteDefaults: true,
		});

		expect(result).toMatchSnapshot();
	});

	it('Get a correct typography styles with `disablePaletteDefaults` and changed color', () => {
		const obj = {
			'palette-status-general': true,
			'palette-sc-status-general': false,
			'font-size-unit-general': 'px',
			'line-height-unit-general': 'px',
			'letter-spacing-unit-general': 'px',
			'text-indent-unit-general': 'px',
			'word-spacing-unit-general': 'px',
			'bottom-gap-unit-general': 'px',

			'palette-color-general': 4,
		};

		const result = getTypographyStyles({
			obj,
			blockStyle: 'light',
			disablePaletteDefaults: true,
		});

		expect(result).toMatchSnapshot();
	});

	it('Get a correct typography styles with `disablePaletteDefaults` and changed opacity', () => {
		const obj = {
			'palette-status-general': true,
			'palette-sc-status-general': false,
			'font-size-unit-general': 'px',
			'line-height-unit-general': 'px',
			'letter-spacing-unit-general': 'px',
			'text-indent-unit-general': 'px',
			'word-spacing-unit-general': 'px',
			'bottom-gap-unit-general': 'px',

			'palette-color-general': 3,
			'palette-opacity-general': 0.5,
		};

		const result = getTypographyStyles({
			obj,
			blockStyle: 'light',
			disablePaletteDefaults: true,
		});

		expect(result).toMatchSnapshot();
	});

	it('Get a correct typography styles with `disablePaletteDefaults` and reset on general/changed on other bp opacity', () => {
		const obj = {
			'palette-status-general': true,
			'palette-sc-status-general': false,
			'font-size-unit-general': 'px',
			'line-height-unit-general': 'px',
			'letter-spacing-unit-general': 'px',
			'text-indent-unit-general': 'px',
			'word-spacing-unit-general': 'px',
			'bottom-gap-unit-general': 'px',

			'palette-color-general': 3,
			'palette-opacity-general': 1,
			'palette-opacity-l': 1,
		};

		const result = getTypographyStyles({
			obj,
			blockStyle: 'light',
			disablePaletteDefaults: true,
		});

		expect(result).toMatchSnapshot();
	});

	it('Get a correct typography styles with `disablePaletteDefaults` and disabled palette', () => {
		const obj = {
			'palette-status-general': false,
			'palette-sc-status-general': false,
			'font-size-unit-general': 'px',
			'line-height-unit-general': 'px',
			'letter-spacing-unit-general': 'px',
			'text-indent-unit-general': 'px',
			'word-spacing-unit-general': 'px',
			'bottom-gap-unit-general': 'px',

			'palette-color-general': 3,
			'palette-opacity-general': 1,
			'color-general': 'rgb(255, 99, 71)',
		};

		const result = getTypographyStyles({
			obj,
			blockStyle: 'light',
			disablePaletteDefaults: true,
		});

		expect(result).toMatchSnapshot();
	});

	it('Get a correct typography styles with `disablePaletteDefaults` and changed color and opacity', () => {
		const obj = {
			'palette-status-general': true,
			'palette-sc-status-general': false,
			'font-size-unit-general': 'px',
			'line-height-unit-general': 'px',
			'letter-spacing-unit-general': 'px',
			'text-indent-unit-general': 'px',
			'word-spacing-unit-general': 'px',
			'bottom-gap-unit-general': 'px',

			'palette-color-general': 4,
			'palette-opacity-general': 0.5,

			'palette-color-l': 3,

			'palette-status-xs': false,
			'color-xs': 'rgb(255, 99, 71)',
		};

		const result = getTypographyStyles({
			obj,
			blockStyle: 'light',
			disablePaletteDefaults: true,
		});

		expect(result).toMatchSnapshot();
	});
});
