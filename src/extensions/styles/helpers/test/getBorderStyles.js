import getBorderStyles from '../getBorderStyles';

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
		'bo_s-general': 'none',
		'bo_ps-general': true,
		'bo_pc-general': 2,
		'bo.sh': false,
		'bo_ps-general.h': true,
		'bo_pc-general.h': 6,
		'bo.ra.sy-general': 'all',
		'bo.ra.u-general': 'px',
		'bo.ra.u-general.h': 'px',
		'bo_w.sy-general': 'all',
		'bo_w.u-general': 'px',
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
			'bo_ps-general': true,
			'bo_pc-general': 2,
			'bo.sh': false,
			'bo_ps-general.h': true,
			'bo_pc-general.h': 6,
			'bo.ra.sy-general': 'all',
			'bo.ra.u-general': 'px',
			'bo.ra.u-general.h': 'px',
			'bo_w.sy-general': 'all',
			'bo_w.u-general': 'px',
			'bo_s-general': 'solid',
			'bo_w.t-general': 2,
			'bo_w.r-general': 2,
			'bo_w.b-general': 2,
			'bo_w.l-general': 2,
			'bo_w.sy-xxl': 'axis',
			'bo_w.r-xxl': 6,
			'bo_w.l-xxl': 6,
			'bo_ps-xxl': true,
			'bo_pc-xxl': 5,
			'bo_w.sy-xl': 'none',
			'bo_w.t-xl': 1,
			'bo_w.b-xl': 3,
			'bo_w.l-xl': 1,
			'bo.ra.sy-xl': 'all',
			'bo.ra.tl-xl': 50,
			'bo.ra.tr-xl': 50,
			'bo.ra.br-xl': 50,
			'bo.ra.bl-xl': 50,
			'bo_ps-l': false,
			'bo_pc-l': 5,
			'bo_cc-l': 'rgba(23, 63, 194, 0.38)',
			'bo_po-l': 0.38,
			'bo_w.t-l': 20,
			'bo_w.r-l': 0,
			'bo_w.b-l': 0,
			'bo_w.l-l': 30,
			'bo.ra.u-l': '%',
			'bo_ps-s': false,
			'bo_pc-s': 5,
			'bo_po-s': 0.38,
			'bo_cc-s': 'rgba(51,54,62,0.38)',
			'bo_ps-xs': true,
			'bo_pc-xs': 5,
			'bo_po-xs': 0.94,
			'bo_cc-xs': 'rgba(51, 54, 62, 0.94)',
		};

		const result = getBorderStyles({
			obj: object,
			blockStyle: 'light',
		});
		expect(result).toMatchSnapshot();
	});

	it('Return a border styles object with hover options', () => {
		const object = {
			'bo_ps-general': true,
			'bo_pc-general': 2,
			'bo.sh': true,
			'bo_ps-general.h': true,
			'bo_pc-general.h': 6,
			'bo.ra.sy-general': 'all',
			'bo.ra.u-general': 'px',
			'bo.ra.u-general.h': 'px',
			'bo_w.sy-general': 'all',
			'bo_w.u-general': 'px',
			'bo_s-general': 'solid',
			'bo_w.t-general': 2,
			'bo_w.r-general': 2,
			'bo_w.b-general': 2,
			'bo_w.l-general': 2,
			'bo_w.sy-xxl': 'axis',
			'bo_w.r-xxl': 6,
			'bo_w.l-xxl': 6,
			'bo_ps-xxl': true,
			'bo_pc-xxl': 5,
			'bo_w.sy-xl': 'none',
			'bo_w.t-xl': 1,
			'bo_w.b-xl': 3,
			'bo_w.l-xl': 1,
			'bo.ra.sy-xl': 'all',
			'bo.ra.tl-xl': 50,
			'bo.ra.tr-xl': 50,
			'bo.ra.br-xl': 50,
			'bo.ra.bl-xl': 50,
			'bo_ps-l': false,
			'bo_pc-l': 5,
			'bo_cc-l': 'rgba(23, 63, 194, 0.38)',
			'bo_po-l': 0.38,
			'bo_w.t-l': 20,
			'bo_w.r-l': 0,
			'bo_w.b-l': 0,
			'bo_w.l-l': 30,
			'bo.ra.u-l': '%',
			'bo_ps-s': false,
			'bo_pc-s': 5,
			'bo_po-s': 0.38,
			'bo_cc-s': 'rgba(51,54,62,0.38)',
			'bo_ps-xs': true,
			'bo_pc-xs': 5,
			'bo_po-xs': 0.94,
			'bo_cc-xs': 'rgba(51, 54, 62, 0.94)',
			'bo_s-general.h': 'dashed',
			'bo_ps-xxl.h': false,
			'bo_pc-xxl.h': 5,
			'bo_ps-l.h': false,
			'bo_pc-l.h': 5,
			'bo_po-l.h': 0.38,
			'bo_cc-l.h': 'rgba(23, 63, 194, 0.38)',
			'bo_ps-s.h': false,
			'bo_pc-s.h': 5,
			'bo_po-s.h': 0.38,
			'bo_cc-s.h': 'rgba(51,54,62,0.38)',
			'bo_ps-xs.h': true,
			'bo_pc-xs.h': 5,
			'bo_po-xs.h': 0.94,
			'bo_cc-xs.h': 'rgba(51, 54, 62, 0.94)',
			'bo_w.t-general.h': 20,
			'bo_w.r-general.h': 20,
			'bo_w.b-general.h': 20,
			'bo_w.l-general.h': 20,
			'bo_w.sy-general.h': 'all',
			'bo_w.u-general.h': 'px',
			'bo_w.r-xxl.h': 6,
			'bo_w.l-xxl.h': 6,
			'bo_w.sy-xxl.h': 'axis',
			'bo_w.t-xl.h': 1,
			'bo_w.b-xl.h': 30,
			'bo_w.l-xl.h': 1,
			'bo_w.sy-xl.h': 'none',
			'bo_w.t-l.h': 20,
			'bo_w.r-l.h': 0,
			'bo_w.b-l.h': 0,
			'bo_w.l-l.h': 30,
			'bo.ra.sy-general.h': 'all',
			'bo.ra.tl-xl.h': 50,
			'bo.ra.tr-xl.h': 50,
			'bo.ra.br-xl.h': 50,
			'bo.ra.bl-xl.h': 50,
			'bo.ra.sy-xl.h': 'all',
			'bo.ra.u-l.h': '%',
			'bo_po-general.h': 0.31,
			'bo.ra.tl-general.h': 0,
			'bo.ra.tr-general.h': 0,
			'bo.ra.br-general.h': 0,
			'bo.ra.bl-general.h': 0,
			'bo_po-xxl.h': 0.31,
			'bo_cc-xxl.h': 'rgba(213,14,227,0.31)',
			'bo_w.sy-m.h': 'all',
			'bo_w.t-m.h': 0,
			'bo_w.r-m.h': 0,
			'bo_w.b-m.h': 0,
			'bo_w.l-m.h': 0,
			'bo_w.sy-xs.h': 'none',
			'bo_w.t-xs.h': 1,
			'bo_w.r-xs.h': 2,
			'bo_w.b-xs.h': 3,
			'bo_w.l-xs.h': 4,
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
			'bo_ps-general': true,
			'bo_pc-general': 7,
			'bo_s-general': 'solid',
			'bo_w.t-general': 2,
			'bo_w.r-general': 2,
			'bo_w.b-general': 2,
			'bo_w.l-general': 2,
			'bo_w.sy-general': true,
			'bo_w.u-general': 'px',
			'bo_w.r-s': 0,
			'bo_w.sy-s': false,
			'bo.ra.t-general': 2,
			'bo.ra.r-general': 2,
			'bo.ra.b-general': 2,
			'bo.ra.l-general': 2,
			'bo.ra.sy-general': true,
			'bo.ra.u-general': 'px',
			'bo.ra.r-s': 0,
		};

		const result = getBorderStyles({
			obj: object,
			blockStyle: 'light',
		});
		expect(result).toMatchSnapshot();
	});

	it('Return a border styles object based on Button Maxi', async () => {
		const object = {
			'bt-bo_ps-general': true,
			'bt-bo_pc-general': 2,
			'bt-bo_w.sy-general': 'all',
			'bt-bo_w.u-general': 'px',
			'bt-bo.ra.tl-general': 10,
			'bt-bo.ra.tr-general': 10,
			'bt-bo.ra.br-general': 10,
			'bt-bo.ra.bl-general': 10,
			'bt-bo.ra.sy-general': 'all',
			'bt-bo.ra.u-general': 'px',
			'bt-bo.sh': false,
			'bt-bo_ps-general.h': true,
			'bt-bo_pc-general.h': 6,
			'bt-bo.ra.u-general.h': 'px',
			'bt-bo_s-general': 'solid',
			'bt-bo_w.t-general': 20,
			'bt-bo_w.r-general': 20,
			'bt-bo_w.b-general': 20,
			'bt-bo_w.l-general': 20,
			'bt-bo_ps-xxl': true,
			'bt-bo_pc-xxl': 3,
			'bt-bo_po-xxl': 0.46,
			'bt-bo_w.sy-xxl': 'axis',
			'bt-bo_w.r-xxl': 0,
			'bt-bo_w.l-xxl': 0,
			'bt-bo_w.r-xl': 90,
			'bt-bo_w.l-xl': 90,
			'bt-bo_ps-xl': false,
			'bt-bo_pc-xl': 3,
			'bt-bo_po-xl': 0.46,
			'bt-bo_cc-xl': 'rgba(197,26,209,0.46)',
			'bt-bo.ra.tl-xl': 100,
			'bt-bo.ra.tr-xl': 100,
			'bt-bo.ra.br-xl': 100,
			'bt-bo.ra.bl-xl': 100,
			'bt-bo_w.sy-l': 'all',
			'bt-bo_w.t-l': 2,
			'bt-bo_w.r-l': 2,
			'bt-bo_w.b-l': 2,
			'bt-bo_w.l-l': 2,
			'bt-bo_ps-l': false,
			'bt-bo_pc-l': 3,
			'bt-bo_po-l': 0.46,
			'bt-bo_cc-l': 'rgba(114,52,118,0.46)',
			'bt-bo_s-l': 'dashed',
			'bt-bo_w.u-l': 'px',
			'bt-bo_ps-m': true,
			'bt-bo_pc-m': 7,
			'bt-bo_po-m': 0.46,
			'bt-bo_cc-m': 'rgba(114,52,118,0.46)',
			'bt-bo_w.t-m': 50,
			'bt-bo_w.r-m': 50,
			'bt-bo_w.b-m': 50,
			'bt-bo_w.l-m': 50,
			'bt-bo_w.t-s': 5,
			'bt-bo_w.r-s': 5,
			'bt-bo_w.b-s': 5,
			'bt-bo_w.l-s': 5,
			'bt-bo.ra.tl-xs': 0,
			'bt-bo.ra.tr-xs': 0,
			'bt-bo.ra.br-xs': 0,
			'bt-bo.ra.bl-xs': 0,
			'bt-bo_ps-xs': true,
			'bt-bo_pc-xs': 2,
			'bt-bo_po-xs': 0.46,
			'bt-bo_cc-xs': 'rgba(114,52,118,0.46)',
		};

		const result = getBorderStyles({
			obj: object,
			blockStyle: 'light',
			isButton: true,
			prefix: 'bt-',
		});
		expect(result).toMatchSnapshot();
	});

	it('Return a border styles object based on Button Maxi with hover active and non global SC settings enabled', async () => {
		const object = {
			'bt-bo_ps-general': true,
			'bt-bo_pc-general': 2,
			'bt-bo_w.sy-general': 'all',
			'bt-bo_w.u-general': 'px',
			'bt-bo.ra.tl-general': 10,
			'bt-bo.ra.tr-general': 10,
			'bt-bo.ra.br-general': 10,
			'bt-bo.ra.bl-general': 10,
			'bt-bo.ra.sy-general': 'all',
			'bt-bo.ra.u-general': 'px',
			'bt-bo.sh': true,
			'bt-bo_ps-general.h': true,
			'bt-bo_pc-general.h': 6,
			'bt-bo.ra.u-general.h': 'px',
			'bt-bo_s-general': 'solid',
			'bt-bo_w.t-general': 20,
			'bt-bo_w.r-general': 20,
			'bt-bo_w.b-general': 20,
			'bt-bo_w.l-general': 20,
			'bt-bo_s-general.h': 'solid',
			'bt-bo_w.t-general.h': 20,
			'bt-bo_w.r-general.h': 20,
			'bt-bo_w.b-general.h': 20,
			'bt-bo_w.l-general.h': 20,
			'bt-bo_w.sy-general.h': 'all',
			'bt-bo_w.u-general.h': 'px',
			'bt-bo.ra.tl-general.h': 10,
			'bt-bo.ra.tr-general.h': 10,
			'bt-bo.ra.br-general.h': 10,
			'bt-bo.ra.bl-general.h': 10,
			'bt-bo.ra.sy-general.h': 'all',
		};

		const result = getBorderStyles({
			obj: object,
			blockStyle: 'light',
			isButton: true,
			prefix: 'bt-',
		});
		expect(result).toMatchSnapshot();
	});

	it('Return a border styles object based on Button Maxi with hover disabled and global SC settings enabled', async () => {
		const object = {
			'bt-bo_ps-general': true,
			'bt-bo_pc-general': 2,
			'bt-bo_w.sy-general': 'all',
			'bt-bo_w.u-general': 'px',
			'bt-bo.ra.tl-general': 10,
			'bt-bo.ra.tr-general': 10,
			'bt-bo.ra.br-general': 10,
			'bt-bo.ra.bl-general': 10,
			'bt-bo.ra.sy-general': 'all',
			'bt-bo.ra.u-general': 'px',
			'bt-bo.sh': false,
			'bt-bo_ps-general.h': true,
			'bt-bo_pc-general.h': 6,
			'bt-bo.ra.u-general.h': 'px',
			'bt-bo_s-general': 'solid',
			'bt-bo_w.t-general': 20,
			'bt-bo_w.r-general': 20,
			'bt-bo_w.b-general': 20,
			'bt-bo_w.l-general': 20,
			'bt-bo_s-general.h': 'solid',
			'bt-bo_w.t-general.h': 20,
			'bt-bo_w.r-general.h': 20,
			'bt-bo_w.b-general.h': 20,
			'bt-bo_w.l-general.h': 20,
			'bt-bo_w.sy-general.h': 'all',
			'bt-bo_w.u-general.h': 'px',
			'bt-bo.ra.tl-general.h': 10,
			'bt-bo.ra.tr-general.h': 10,
			'bt-bo.ra.br-general.h': 10,
			'bt-bo.ra.bl-general.h': 10,
			'bt-bo.ra.sy-general.h': 'all',
		};

		const result = getBorderStyles({
			obj: object,
			blockStyle: 'light',
			isButton: true,
			prefix: 'bt-',
			scValues: {
				'h-bo-_col.g': true,
				'h-bo_col.a': true,
			},
		});
		// The snapshot of this test should be equal than the snapshot of the previous test
		expect(result).toMatchSnapshot();
	});

	it('Return an IB border styles when bo_s - none', async () => {
		const result = getBorderStyles({
			obj: defaultAttributes,
			blockStyle: 'light',
			isIB: true,
		});
		expect(result).toMatchSnapshot();
	});

	it('Return a border radius object as the one that can be required by background helper', async () => {
		const result = getBorderStyles({
			obj: {
				'bo.ra.bl-general': 181,
				'bo.ra.br-general': 182,
				'bo.ra.tl-general': 183,
				'bo.ra.tr-general': 184,
			},
			blockStyle: 'light',
			isIB: true,
		});
		expect(result).toMatchSnapshot();
	});
});
