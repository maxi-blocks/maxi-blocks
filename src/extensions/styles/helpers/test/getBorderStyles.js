import getBorderStyles from '@extensions/styles/helpers/getBorderStyles';

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
	const defaultAttributes = {
		'border-style-general': 'none',
		'border-palette-status-general': true,
		'border-palette-color-general': 2,
		'border-status-hover': false,
		'border-palette-status-general-hover': true,
		'border-palette-color-general-hover': 6,
		'border-sync-radius-general': 'all',
		'border-unit-radius-general': 'px',
		'border-unit-radius-general-hover': 'px',
		'border-sync-width-general': 'all',
		'border-unit-width-general': 'px',
	};
	it('Test simple and default border attributes', async () => {
		const result = getBorderStyles({
			obj: defaultAttributes,
			blockStyle: 'light',
		});
		expect(result).toMatchSnapshot();
	});

	it('Return border styles object with all the settings', () => {
		const object = {
			'border-palette-status-general': true,
			'border-palette-color-general': 2,
			'border-status-hover': false,
			'border-palette-status-general-hover': true,
			'border-palette-color-general-hover': 6,
			'border-sync-radius-general': 'all',
			'border-unit-radius-general': 'px',
			'border-unit-radius-general-hover': 'px',
			'border-sync-width-general': 'all',
			'border-unit-width-general': 'px',
			'border-style-general': 'solid',
			'border-top-width-general': 2,
			'border-right-width-general': 2,
			'border-bottom-width-general': 2,
			'border-left-width-general': 2,
			'border-sync-width-xxl': 'axis',
			'border-right-width-xxl': 6,
			'border-left-width-xxl': 6,
			'border-palette-status-xxl': true,
			'border-palette-color-xxl': 5,
			'border-sync-width-xl': 'none',
			'border-top-width-xl': 1,
			'border-bottom-width-xl': 3,
			'border-left-width-xl': 1,
			'border-sync-radius-xl': 'all',
			'border-top-left-radius-xl': 50,
			'border-top-right-radius-xl': 50,
			'border-bottom-right-radius-xl': 50,
			'border-bottom-left-radius-xl': 50,
			'border-palette-status-l': false,
			'border-palette-color-l': 5,
			'border-color-l': 'rgba(23, 63, 194, 0.38)',
			'border-palette-opacity-l': 0.38,
			'border-top-width-l': 20,
			'border-right-width-l': 0,
			'border-bottom-width-l': 0,
			'border-left-width-l': 30,
			'border-unit-radius-l': '%',
			'border-palette-status-s': false,
			'border-palette-color-s': 5,
			'border-palette-opacity-s': 0.38,
			'border-color-s': 'rgba(51,54,62,0.38)',
			'border-palette-status-xs': true,
			'border-palette-color-xs': 5,
			'border-palette-opacity-xs': 0.94,
			'border-color-xs': 'rgba(51, 54, 62, 0.94)',
		};

		const result = getBorderStyles({
			obj: object,
			blockStyle: 'light',
		});
		expect(result).toMatchSnapshot();
	});

	it('Return a border styles object with hover options', () => {
		const object = {
			'border-palette-status-general': true,
			'border-palette-color-general': 2,
			'border-status-hover': true,
			'border-palette-status-general-hover': true,
			'border-palette-color-general-hover': 6,
			'border-sync-radius-general': 'all',
			'border-unit-radius-general': 'px',
			'border-unit-radius-general-hover': 'px',
			'border-sync-width-general': 'all',
			'border-unit-width-general': 'px',
			'border-style-general': 'solid',
			'border-top-width-general': 2,
			'border-right-width-general': 2,
			'border-bottom-width-general': 2,
			'border-left-width-general': 2,
			'border-sync-width-xxl': 'axis',
			'border-right-width-xxl': 6,
			'border-left-width-xxl': 6,
			'border-palette-status-xxl': true,
			'border-palette-color-xxl': 5,
			'border-sync-width-xl': 'none',
			'border-top-width-xl': 1,
			'border-bottom-width-xl': 3,
			'border-left-width-xl': 1,
			'border-sync-radius-xl': 'all',
			'border-top-left-radius-xl': 50,
			'border-top-right-radius-xl': 50,
			'border-bottom-right-radius-xl': 50,
			'border-bottom-left-radius-xl': 50,
			'border-palette-status-l': false,
			'border-palette-color-l': 5,
			'border-color-l': 'rgba(23, 63, 194, 0.38)',
			'border-palette-opacity-l': 0.38,
			'border-top-width-l': 20,
			'border-right-width-l': 0,
			'border-bottom-width-l': 0,
			'border-left-width-l': 30,
			'border-unit-radius-l': '%',
			'border-palette-status-s': false,
			'border-palette-color-s': 5,
			'border-palette-opacity-s': 0.38,
			'border-color-s': 'rgba(51,54,62,0.38)',
			'border-palette-status-xs': true,
			'border-palette-color-xs': 5,
			'border-palette-opacity-xs': 0.94,
			'border-color-xs': 'rgba(51, 54, 62, 0.94)',
			'border-style-general-hover': 'dashed',
			'border-palette-status-xxl-hover': false,
			'border-palette-color-xxl-hover': 5,
			'border-palette-status-l-hover': false,
			'border-palette-color-l-hover': 5,
			'border-palette-opacity-l-hover': 0.38,
			'border-color-l-hover': 'rgba(23, 63, 194, 0.38)',
			'border-palette-status-s-hover': false,
			'border-palette-color-s-hover': 5,
			'border-palette-opacity-s-hover': 0.38,
			'border-color-s-hover': 'rgba(51,54,62,0.38)',
			'border-palette-status-xs-hover': true,
			'border-palette-color-xs-hover': 5,
			'border-palette-opacity-xs-hover': 0.94,
			'border-color-xs-hover': 'rgba(51, 54, 62, 0.94)',
			'border-top-width-general-hover': 20,
			'border-right-width-general-hover': 20,
			'border-bottom-width-general-hover': 20,
			'border-left-width-general-hover': 20,
			'border-sync-width-general-hover': 'all',
			'border-unit-width-general-hover': 'px',
			'border-right-width-xxl-hover': 6,
			'border-left-width-xxl-hover': 6,
			'border-sync-width-xxl-hover': 'axis',
			'border-top-width-xl-hover': 1,
			'border-bottom-width-xl-hover': 30,
			'border-left-width-xl-hover': 1,
			'border-sync-width-xl-hover': 'none',
			'border-top-width-l-hover': 20,
			'border-right-width-l-hover': 0,
			'border-bottom-width-l-hover': 0,
			'border-left-width-l-hover': 30,
			'border-sync-radius-general-hover': 'all',
			'border-top-left-radius-xl-hover': 50,
			'border-top-right-radius-xl-hover': 50,
			'border-bottom-right-radius-xl-hover': 50,
			'border-bottom-left-radius-xl-hover': 50,
			'border-sync-radius-xl-hover': 'all',
			'border-unit-radius-l-hover': '%',
			'border-palette-opacity-general-hover': 0.31,
			'border-top-left-radius-general-hover': 0,
			'border-top-right-radius-general-hover': 0,
			'border-bottom-right-radius-general-hover': 0,
			'border-bottom-left-radius-general-hover': 0,
			'border-palette-opacity-xxl-hover': 0.31,
			'border-color-xxl-hover': 'rgba(213,14,227,0.31)',
			'border-sync-width-m-hover': 'all',
			'border-top-width-m-hover': 0,
			'border-right-width-m-hover': 0,
			'border-bottom-width-m-hover': 0,
			'border-left-width-m-hover': 0,
			'border-sync-width-xs-hover': 'none',
			'border-top-width-xs-hover': 1,
			'border-right-width-xs-hover': 2,
			'border-bottom-width-xs-hover': 3,
			'border-left-width-xs-hover': 4,
		};

		const result = getBorderStyles({
			obj: object,
			blockStyle: 'light',
			isHover: true,
		});
		expect(result).toMatchSnapshot();
	});

	it('Ensures 0 is accepted on responsive stages', () => {
		const object = {
			'border-palette-status-general': true,
			'border-palette-color-general': 7,
			'border-style-general': 'solid',
			'border-top-width-general': 2,
			'border-right-width-general': 2,
			'border-bottom-width-general': 2,
			'border-left-width-general': 2,
			'border-sync-width-general': true,
			'border-unit-width-general': 'px',
			'border-right-width-s': 0,
			'border-sync-width-s': false,
			'border-top-radius-general': 2,
			'border-right-radius-general': 2,
			'border-bottom-radius-general': 2,
			'border-left-radius-general': 2,
			'border-sync-radius-general': true,
			'border-unit-radius-general': 'px',
			'border-right-radius-s': 0,
		};

		const result = getBorderStyles({
			obj: object,
			blockStyle: 'light',
		});
		expect(result).toMatchSnapshot();
	});

	it('Return a border styles object based on Button Maxi', async () => {
		const object = {
			'button-border-palette-status-general': true,
			'button-border-palette-color-general': 2,
			'button-border-sync-width-general': 'all',
			'button-border-unit-width-general': 'px',
			'button-border-top-left-radius-general': 10,
			'button-border-top-right-radius-general': 10,
			'button-border-bottom-right-radius-general': 10,
			'button-border-bottom-left-radius-general': 10,
			'button-border-sync-radius-general': 'all',
			'button-border-unit-radius-general': 'px',
			'button-border-status-hover': false,
			'button-border-palette-status-general-hover': true,
			'button-border-palette-color-general-hover': 6,
			'button-border-unit-radius-general-hover': 'px',
			'button-border-style-general': 'solid',
			'button-border-top-width-general': 20,
			'button-border-right-width-general': 20,
			'button-border-bottom-width-general': 20,
			'button-border-left-width-general': 20,
			'button-border-palette-status-xxl': true,
			'button-border-palette-color-xxl': 3,
			'button-border-palette-opacity-xxl': 0.46,
			'button-border-sync-width-xxl': 'axis',
			'button-border-right-width-xxl': 0,
			'button-border-left-width-xxl': 0,
			'button-border-right-width-xl': 90,
			'button-border-left-width-xl': 90,
			'button-border-palette-status-xl': false,
			'button-border-palette-color-xl': 3,
			'button-border-palette-opacity-xl': 0.46,
			'button-border-color-xl': 'rgba(197,26,209,0.46)',
			'button-border-top-left-radius-xl': 100,
			'button-border-top-right-radius-xl': 100,
			'button-border-bottom-right-radius-xl': 100,
			'button-border-bottom-left-radius-xl': 100,
			'button-border-sync-width-l': 'all',
			'button-border-top-width-l': 2,
			'button-border-right-width-l': 2,
			'button-border-bottom-width-l': 2,
			'button-border-left-width-l': 2,
			'button-border-palette-status-l': false,
			'button-border-palette-color-l': 3,
			'button-border-palette-opacity-l': 0.46,
			'button-border-color-l': 'rgba(114,52,118,0.46)',
			'button-border-style-l': 'dashed',
			'button-border-unit-width-l': 'px',
			'button-border-palette-status-m': true,
			'button-border-palette-color-m': 7,
			'button-border-palette-opacity-m': 0.46,
			'button-border-color-m': 'rgba(114,52,118,0.46)',
			'button-border-top-width-m': 50,
			'button-border-right-width-m': 50,
			'button-border-bottom-width-m': 50,
			'button-border-left-width-m': 50,
			'button-border-top-width-s': 5,
			'button-border-right-width-s': 5,
			'button-border-bottom-width-s': 5,
			'button-border-left-width-s': 5,
			'button-border-top-left-radius-xs': 0,
			'button-border-top-right-radius-xs': 0,
			'button-border-bottom-right-radius-xs': 0,
			'button-border-bottom-left-radius-xs': 0,
			'button-border-palette-status-xs': true,
			'button-border-palette-color-xs': 2,
			'button-border-palette-opacity-xs': 0.46,
			'button-border-color-xs': 'rgba(114,52,118,0.46)',
		};

		const result = getBorderStyles({
			obj: object,
			blockStyle: 'light',
			isButton: true,
			prefix: 'button-',
		});
		expect(result).toMatchSnapshot();
	});

	it('Return a border styles object based on Button Maxi with hover active and non global SC settings enabled', async () => {
		const object = {
			'button-border-palette-status-general': true,
			'button-border-palette-color-general': 2,
			'button-border-sync-width-general': 'all',
			'button-border-unit-width-general': 'px',
			'button-border-top-left-radius-general': 10,
			'button-border-top-right-radius-general': 10,
			'button-border-bottom-right-radius-general': 10,
			'button-border-bottom-left-radius-general': 10,
			'button-border-sync-radius-general': 'all',
			'button-border-unit-radius-general': 'px',
			'button-border-status-hover': true,
			'button-border-palette-status-general-hover': true,
			'button-border-palette-color-general-hover': 6,
			'button-border-unit-radius-general-hover': 'px',
			'button-border-style-general': 'solid',
			'button-border-top-width-general': 20,
			'button-border-right-width-general': 20,
			'button-border-bottom-width-general': 20,
			'button-border-left-width-general': 20,
			'button-border-style-general-hover': 'solid',
			'button-border-top-width-general-hover': 20,
			'button-border-right-width-general-hover': 20,
			'button-border-bottom-width-general-hover': 20,
			'button-border-left-width-general-hover': 20,
			'button-border-sync-width-general-hover': 'all',
			'button-border-unit-width-general-hover': 'px',
			'button-border-top-left-radius-general-hover': 10,
			'button-border-top-right-radius-general-hover': 10,
			'button-border-bottom-right-radius-general-hover': 10,
			'button-border-bottom-left-radius-general-hover': 10,
			'button-border-sync-radius-general-hover': 'all',
		};

		const result = getBorderStyles({
			obj: object,
			blockStyle: 'light',
			isButton: true,
			prefix: 'button-',
		});
		expect(result).toMatchSnapshot();
	});

	it('Return a border styles object based on Button Maxi with hover disabled and global SC settings enabled', async () => {
		const object = {
			'button-border-palette-status-general': true,
			'button-border-palette-color-general': 2,
			'button-border-sync-width-general': 'all',
			'button-border-unit-width-general': 'px',
			'button-border-top-left-radius-general': 10,
			'button-border-top-right-radius-general': 10,
			'button-border-bottom-right-radius-general': 10,
			'button-border-bottom-left-radius-general': 10,
			'button-border-sync-radius-general': 'all',
			'button-border-unit-radius-general': 'px',
			'button-border-status-hover': false,
			'button-border-palette-status-general-hover': true,
			'button-border-palette-color-general-hover': 6,
			'button-border-unit-radius-general-hover': 'px',
			'button-border-style-general': 'solid',
			'button-border-top-width-general': 20,
			'button-border-right-width-general': 20,
			'button-border-bottom-width-general': 20,
			'button-border-left-width-general': 20,
			'button-border-style-general-hover': 'solid',
			'button-border-top-width-general-hover': 20,
			'button-border-right-width-general-hover': 20,
			'button-border-bottom-width-general-hover': 20,
			'button-border-left-width-general-hover': 20,
			'button-border-sync-width-general-hover': 'all',
			'button-border-unit-width-general-hover': 'px',
			'button-border-top-left-radius-general-hover': 10,
			'button-border-top-right-radius-general-hover': 10,
			'button-border-bottom-right-radius-general-hover': 10,
			'button-border-bottom-left-radius-general-hover': 10,
			'button-border-sync-radius-general-hover': 'all',
		};

		const result = getBorderStyles({
			obj: object,
			blockStyle: 'light',
			isButton: true,
			prefix: 'button-',
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
});
