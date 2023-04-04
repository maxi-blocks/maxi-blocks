import getBorderStyles from '../getBorderStyles';
import parseLongAttrObj from '../../../attributes/dictionary/parseLongAttrObj';

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

describe('getBorderStyles', () => {
	const defaultAttributes = parseLongAttrObj({
		'border-style-general': 'none',
		'border-palette-status-general': true,
		'border-palette-color-general': 2,
		'bo.sh': false,
		'border-palette-status-general-hover': true,
		'border-palette-color-general-hover': 6,
		'border-radius-sync-general': 'all',
		'border-radius-unit-general': 'px',
		'border-radius-unit-general-hover': 'px',
		'border-width-sync-general': 'all',
		'border-width-unit-general': 'px',
	});
	it('Test simple and default border attributes', async () => {
		const result = getBorderStyles({
			obj: defaultAttributes,
			blockStyle: 'light',
		});
		expect(result).toMatchSnapshot();
	});

	it('Return border styles object with all the settings', () => {
		const object = parseLongAttrObj({
			'border-palette-status-general': true,
			'border-palette-color-general': 2,
			'bo.sh': false,
			'border-palette-status-general-hover': true,
			'border-palette-color-general-hover': 6,
			'border-radius-sync-general': 'all',
			'border-radius-unit-general': 'px',
			'border-radius-unit-general-hover': 'px',
			'border-width-sync-general': 'all',
			'border-width-unit-general': 'px',
			'border-style-general': 'solid',
			'border-width-top-general': 2,
			'border-width-right-general': 2,
			'border-width-bottom-general': 2,
			'border-width-left-general': 2,
			'border-width-sync-xxl': 'axis',
			'border-width-right-xxl': 6,
			'border-width-left-xxl': 6,
			'border-palette-status-xxl': true,
			'border-palette-color-xxl': 5,
			'border-width-sync-xl': 'none',
			'border-width-top-xl': 1,
			'border-width-bottom-xl': 3,
			'border-width-left-xl': 1,
			'border-radius-sync-xl': 'all',
			'border-radius-top-left-xl': 50,
			'border-radius-top-right-xl': 50,
			'border-radius-bottom-right-xl': 50,
			'border-radius-bottom-left-xl': 50,
			'border-palette-status-l': false,
			'border-palette-color-l': 5,
			'border-custom-color-l': 'rgba(23, 63, 194, 0.38)',
			'border-palette-opacity-l': 0.38,
			'border-width-top-l': 20,
			'border-width-right-l': 0,
			'border-width-bottom-l': 0,
			'border-width-left-l': 30,
			'border-radius-unit-l': '%',
			'border-palette-status-s': false,
			'border-palette-color-s': 5,
			'border-palette-opacity-s': 0.38,
			'border-custom-color-s': 'rgba(51,54,62,0.38)',
			'border-palette-status-xs': true,
			'border-palette-color-xs': 5,
			'border-palette-opacity-xs': 0.94,
			'border-custom-color-xs': 'rgba(51, 54, 62, 0.94)',
		});

		const result = getBorderStyles({
			obj: object,
			blockStyle: 'light',
		});
		expect(result).toMatchSnapshot();
	});

	it('Return a border styles object with hover options', () => {
		const object = parseLongAttrObj({
			'border-palette-status-general': true,
			'border-palette-color-general': 2,
			'bo.sh': true,
			'border-palette-status-general-hover': true,
			'border-palette-color-general-hover': 6,
			'border-radius-sync-general': 'all',
			'border-radius-unit-general': 'px',
			'border-radius-unit-general-hover': 'px',
			'border-width-sync-general': 'all',
			'border-width-unit-general': 'px',
			'border-style-general': 'solid',
			'border-width-top-general': 2,
			'border-width-right-general': 2,
			'border-width-bottom-general': 2,
			'border-width-left-general': 2,
			'border-width-sync-xxl': 'axis',
			'border-width-right-xxl': 6,
			'border-width-left-xxl': 6,
			'border-palette-status-xxl': true,
			'border-palette-color-xxl': 5,
			'border-width-sync-xl': 'none',
			'border-width-top-xl': 1,
			'border-width-bottom-xl': 3,
			'border-width-left-xl': 1,
			'border-radius-sync-xl': 'all',
			'border-radius-top-left-xl': 50,
			'border-radius-top-right-xl': 50,
			'border-radius-bottom-right-xl': 50,
			'border-radius-bottom-left-xl': 50,
			'border-palette-status-l': false,
			'border-palette-color-l': 5,
			'border-custom-color-l': 'rgba(23, 63, 194, 0.38)',
			'border-palette-opacity-l': 0.38,
			'border-width-top-l': 20,
			'border-width-right-l': 0,
			'border-width-bottom-l': 0,
			'border-width-left-l': 30,
			'border-radius-unit-l': '%',
			'border-palette-status-s': false,
			'border-palette-color-s': 5,
			'border-palette-opacity-s': 0.38,
			'border-custom-color-s': 'rgba(51,54,62,0.38)',
			'border-palette-status-xs': true,
			'border-palette-color-xs': 5,
			'border-palette-opacity-xs': 0.94,
			'border-custom-color-xs': 'rgba(51, 54, 62, 0.94)',
			'border-style-general-hover': 'dashed',
			'border-palette-status-xxl-hover': false,
			'border-palette-color-xxl-hover': 5,
			'border-palette-status-l-hover': false,
			'border-palette-color-l-hover': 5,
			'border-palette-opacity-l-hover': 0.38,
			'border-custom-color-l-hover': 'rgba(23, 63, 194, 0.38)',
			'border-palette-status-s-hover': false,
			'border-palette-color-s-hover': 5,
			'border-palette-opacity-s-hover': 0.38,
			'border-custom-color-s-hover': 'rgba(51,54,62,0.38)',
			'border-palette-status-xs-hover': true,
			'border-palette-color-xs-hover': 5,
			'border-palette-opacity-xs-hover': 0.94,
			'border-custom-color-xs-hover': 'rgba(51, 54, 62, 0.94)',
			'border-width-top-general-hover': 20,
			'border-width-right-general-hover': 20,
			'border-width-bottom-general-hover': 20,
			'border-width-left-general-hover': 20,
			'border-width-sync-general-hover': 'all',
			'border-width-unit-general-hover': 'px',
			'border-width-right-xxl-hover': 6,
			'border-width-left-xxl-hover': 6,
			'border-width-sync-xxl-hover': 'axis',
			'border-width-top-xl-hover': 1,
			'border-width-bottom-xl-hover': 30,
			'border-width-left-xl-hover': 1,
			'border-width-sync-xl-hover': 'none',
			'border-width-top-l-hover': 20,
			'border-width-right-l-hover': 0,
			'border-width-bottom-l-hover': 0,
			'border-width-left-l-hover': 30,
			'border-radius-sync-general-hover': 'all',
			'border-radius-top-left-xl-hover': 50,
			'border-radius-top-right-xl-hover': 50,
			'border-radius-bottom-right-xl-hover': 50,
			'border-radius-bottom-left-xl-hover': 50,
			'border-radius-sync-xl-hover': 'all',
			'border-radius-unit-l-hover': '%',
			'border-palette-opacity-general-hover': 0.31,
			'border-radius-top-left-general-hover': 0,
			'border-radius-top-right-general-hover': 0,
			'border-radius-bottom-right-general-hover': 0,
			'border-radius-bottom-left-general-hover': 0,
			'border-palette-opacity-xxl-hover': 0.31,
			'border-custom-color-xxl-hover': 'rgba(213,14,227,0.31)',
			'border-width-sync-m-hover': 'all',
			'border-width-top-m-hover': 0,
			'border-width-right-m-hover': 0,
			'border-width-bottom-m-hover': 0,
			'border-width-left-m-hover': 0,
			'border-width-sync-xs-hover': 'none',
			'border-width-top-xs-hover': 1,
			'border-width-right-xs-hover': 2,
			'border-width-bottom-xs-hover': 3,
			'border-width-left-xs-hover': 4,
		});

		const result = getBorderStyles({
			obj: object,
			blockStyle: 'light',
			isHover: true,
		});
		expect(result).toMatchSnapshot();
	});

	it('Ensures 0 is accepted on responsive stages', () => {
		const object = parseLongAttrObj({
			'border-palette-status-general': true,
			'border-palette-color-general': 7,
			'border-style-general': 'solid',
			'border-width-top-general': 2,
			'border-width-right-general': 2,
			'border-width-bottom-general': 2,
			'border-width-left-general': 2,
			'border-width-sync-general': true,
			'border-width-unit-general': 'px',
			'border-width-right-s': 0,
			'border-width-sync-s': false,
			'border-radius-top-general': 2,
			'border-radius-right-general': 2,
			'border-radius-bottom-general': 2,
			'border-radius-left-general': 2,
			'border-radius-sync-general': true,
			'border-radius-unit-general': 'px',
			'border-radius-right-s': 0,
		});

		const result = getBorderStyles({
			obj: object,
			blockStyle: 'light',
		});
		expect(result).toMatchSnapshot();
	});

	it('Return a border styles object based on Button Maxi', async () => {
		const object = parseLongAttrObj({
			'button-border-palette-status-general': true,
			'button-border-palette-color-general': 2,
			'button-border-width-sync-general': 'all',
			'button-border-width-unit-general': 'px',
			'button-border-radius-top-left-general': 10,
			'button-border-radius-top-right-general': 10,
			'button-border-radius-bottom-right-general': 10,
			'button-border-radius-bottom-left-general': 10,
			'button-border-radius-sync-general': 'all',
			'button-border-radius-unit-general': 'px',
			'bt-bo.sh': false,
			'button-border-palette-status-general-hover': true,
			'button-border-palette-color-general-hover': 6,
			'button-border-radius-unit-general-hover': 'px',
			'button-border-style-general': 'solid',
			'button-border-width-top-general': 20,
			'button-border-width-right-general': 20,
			'button-border-width-bottom-general': 20,
			'button-border-width-left-general': 20,
			'button-border-palette-status-xxl': true,
			'button-border-palette-color-xxl': 3,
			'button-border-palette-opacity-xxl': 0.46,
			'button-border-width-sync-xxl': 'axis',
			'button-border-width-right-xxl': 0,
			'button-border-width-left-xxl': 0,
			'button-border-width-right-xl': 90,
			'button-border-width-left-xl': 90,
			'button-border-palette-status-xl': false,
			'button-border-palette-color-xl': 3,
			'button-border-palette-opacity-xl': 0.46,
			'button-border-custom-color-xl': 'rgba(197,26,209,0.46)',
			'button-border-radius-top-left-xl': 100,
			'button-border-radius-top-right-xl': 100,
			'button-border-radius-bottom-right-xl': 100,
			'button-border-radius-bottom-left-xl': 100,
			'button-border-width-sync-l': 'all',
			'button-border-width-top-l': 2,
			'button-border-width-right-l': 2,
			'button-border-width-bottom-l': 2,
			'button-border-width-left-l': 2,
			'button-border-palette-status-l': false,
			'button-border-palette-color-l': 3,
			'button-border-palette-opacity-l': 0.46,
			'button-border-custom-color-l': 'rgba(114,52,118,0.46)',
			'button-border-style-l': 'dashed',
			'button-border-width-unit-l': 'px',
			'button-border-palette-status-m': true,
			'button-border-palette-color-m': 7,
			'button-border-palette-opacity-m': 0.46,
			'button-border-custom-color-m': 'rgba(114,52,118,0.46)',
			'button-border-width-top-m': 50,
			'button-border-width-right-m': 50,
			'button-border-width-bottom-m': 50,
			'button-border-width-left-m': 50,
			'button-border-width-top-s': 5,
			'button-border-width-right-s': 5,
			'button-border-width-bottom-s': 5,
			'button-border-width-left-s': 5,
			'button-border-radius-top-left-xs': 0,
			'button-border-radius-top-right-xs': 0,
			'button-border-radius-bottom-right-xs': 0,
			'button-border-radius-bottom-left-xs': 0,
			'button-border-palette-status-xs': true,
			'button-border-palette-color-xs': 2,
			'button-border-palette-opacity-xs': 0.46,
			'button-border-custom-color-xs': 'rgba(114,52,118,0.46)',
		});

		const result = getBorderStyles({
			obj: object,
			blockStyle: 'light',
			isButton: true,
			prefix: 'bt-',
		});
		expect(result).toMatchSnapshot();
	});

	it('Return a border styles object based on Button Maxi with hover active and non global SC settings enabled', async () => {
		const object = parseLongAttrObj({
			'button-border-palette-status-general': true,
			'button-border-palette-color-general': 2,
			'button-border-width-sync-general': 'all',
			'button-border-width-unit-general': 'px',
			'button-border-radius-top-left-general': 10,
			'button-border-radius-top-right-general': 10,
			'button-border-radius-bottom-right-general': 10,
			'button-border-radius-bottom-left-general': 10,
			'button-border-radius-sync-general': 'all',
			'button-border-radius-unit-general': 'px',
			'bt-bo.sh': true,
			'button-border-palette-status-general-hover': true,
			'button-border-palette-color-general-hover': 6,
			'button-border-radius-unit-general-hover': 'px',
			'button-border-style-general': 'solid',
			'button-border-width-top-general': 20,
			'button-border-width-right-general': 20,
			'button-border-width-bottom-general': 20,
			'button-border-width-left-general': 20,
			'button-border-style-general-hover': 'solid',
			'button-border-width-top-general-hover': 20,
			'button-border-width-right-general-hover': 20,
			'button-border-width-bottom-general-hover': 20,
			'button-border-width-left-general-hover': 20,
			'button-border-width-sync-general-hover': 'all',
			'button-border-width-unit-general-hover': 'px',
			'button-border-radius-top-left-general-hover': 10,
			'button-border-radius-top-right-general-hover': 10,
			'button-border-radius-bottom-right-general-hover': 10,
			'button-border-radius-bottom-left-general-hover': 10,
			'button-border-radius-sync-general-hover': 'all',
		});

		const result = getBorderStyles({
			obj: object,
			blockStyle: 'light',
			isButton: true,
			prefix: 'bt-',
		});
		expect(result).toMatchSnapshot();
	});

	it('Return a border styles object based on Button Maxi with hover disabled and global SC settings enabled', async () => {
		const object = parseLongAttrObj({
			'button-border-palette-status-general': true,
			'button-border-palette-color-general': 2,
			'button-border-width-sync-general': 'all',
			'button-border-width-unit-general': 'px',
			'button-border-radius-top-left-general': 10,
			'button-border-radius-top-right-general': 10,
			'button-border-radius-bottom-right-general': 10,
			'button-border-radius-bottom-left-general': 10,
			'button-border-radius-sync-general': 'all',
			'button-border-radius-unit-general': 'px',
			'bt-bo.sh': false,
			'button-border-palette-status-general-hover': true,
			'button-border-palette-color-general-hover': 6,
			'button-border-radius-unit-general-hover': 'px',
			'button-border-style-general': 'solid',
			'button-border-width-top-general': 20,
			'button-border-width-right-general': 20,
			'button-border-width-bottom-general': 20,
			'button-border-width-left-general': 20,
			'button-border-style-general-hover': 'solid',
			'button-border-width-top-general-hover': 20,
			'button-border-width-right-general-hover': 20,
			'button-border-width-bottom-general-hover': 20,
			'button-border-width-left-general-hover': 20,
			'button-border-width-sync-general-hover': 'all',
			'button-border-width-unit-general-hover': 'px',
			'button-border-radius-top-left-general-hover': 10,
			'button-border-radius-top-right-general-hover': 10,
			'button-border-radius-bottom-right-general-hover': 10,
			'button-border-radius-bottom-left-general-hover': 10,
			'button-border-radius-sync-general-hover': 'all',
		});

		const result = getBorderStyles({
			obj: object,
			blockStyle: 'light',
			isButton: true,
			prefix: 'bt-',
			scValues: {
				'hover-border-color-global': true,
				'hover-border-color-all': true,
			},
		});
		// The snapshot of this test should be equal than the snapshot of the previous test
		expect(result).toMatchSnapshot();
	});

	it('Return an IB border styles when border-style - none', async () => {
		const result = getBorderStyles({
			obj: defaultAttributes,
			blockStyle: 'light',
			isIB: true,
		});
		expect(result).toMatchSnapshot();
	});

	it('Return a border radius object as the one that can be required by background helper', async () => {
		const result = getBorderStyles({
			obj: parseLongAttrObj({
				'border-radius-bottom-left-general': 181,
				'border-radius-bottom-right-general': 182,
				'border-radius-top-left-general': 183,
				'border-radius-top-right-general': 184,
			}),
			blockStyle: 'light',
			isIB: true,
		});
		expect(result).toMatchSnapshot();
	});
});
