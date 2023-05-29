import getArrowStyles from '../getArrowStyles';

jest.mock('src/extensions/attributes/getDefaultAttribute.js', () =>
	jest.fn(() => 0)
);

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

describe('getArrowStyles', () => {
	it('Get a correct arrow styles with different values for different responsive stages color background settings', () => {
		const object = {
			target: '',
			blockStyle: 'light',
			'ar.s-g': true,
			'ar_sid-g': 'top',
			'ar_pos-g': 1,
			'ar_w-g': 2,
			'ar_sid-xxl': 'top',
			'ar_pos-xxl': 4,
			'ar_w-xxl': 1,
			'ar_sid-xl': 'top',
			'ar_pos-xl': 2,
			'ar_w-xl': 3,
			'ar.s-l': false,
			'ar_sid-l': 'top',
			'ar_pos-l': 4,
			'ar_w-l': 1,
			'ar_sid-m': 'bottom',
			'ar_pos-m': 2,
			'ar_w-m': 3,
			'ar.s-s': true,
			'ar_sid-s': 'bottom',
			'ar_pos-s': 4,
			'ar_w-s': 1,
			'ar_sid-xs': 'bottom',
			'ar_pos-xs': 2,
			'ar_w-xs': 3,
			b_ly: [
				{
					order: 0,
					type: 'color',
					'_d-g': 'block',
					'bc_ps-g': true,
					'bc_pc-g': 1,
					'bc_po-g': 0.07,
					'bc_cc-g': '',
					'bc_cp-g': 'polygon(50% 0%, 0% 100%, 100% 100%)',
					'bc_ps-xl': true,
					'bc_pc-xl': 1,
					'bc_po-xl': 0.07,
					'bc_cc-xl': '',
					'bc_cp-xl': 'polygon(50% 0%, 0% 100%, 100% 100%)',
					'bc_cp-xxl': 'polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)',
					'bc_ps-xxl': true,
					'bc_pc-xxl': 2,
					'bc_po-xxl': 0.2,
					'bc_cc-xxl': '',
					'bc_ps-l': true,
					'bc_pc-l': 4,
					'bc_po-l': 0.3,
					'bc_cc-l': '',
					'bc_cp-l': 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
					'bc_ps-m': true,
					'bc_pc-m': 5,
					'bc_po-m': 0.59,
					'bc_cc-m': '',
					'bc_cp-m':
						'polygon(50% 0%, 80% 10%, 100% 35%, 100% 70%, 80% 90%, 50% 100%, 20% 90%, 0% 70%, 0% 35%, 20% 10%)',
					'bc_ps-s': false,
					'bc_pc-s': 5,
					'bc_po-s': 0.59,
					'bc_cc-s': 'rgba(204,68,68,0.59)',
					'bc_cp-s':
						'polygon(0% 20%, 60% 20%, 60% 0%, 100% 50%, 60% 100%, 60% 80%, 0% 80%)',
					'bc_cp-xs':
						'polygon(20% 0%, 0% 20%, 30% 50%, 0% 80%, 20% 100%, 50% 70%, 80% 100%, 100% 80%, 70% 50%, 100% 20%, 80% 0%, 50% 30%)',
				},
			],
			'bo_ps-g': true,
			'bo_pc-g': 4,
			'bo_s-g': 'solid',
			'bo_w.t-g': 1,
			'bo_w.r-g': 1,
			'bo_w.b-g': 1,
			'bo_w.l-g': 1,
			'bo_w.u-g': 'px',
			'bo_ps-m': false,
			'bo_cc-m': 'rgba(61,133,209)',
			'bo_s-m': 'solid',
			'bo_w.t-m': 3,
			'bo_w.r-m': 3,
			'bo_w.b-m': 3,
			'bo_w.l-m': 3,
			'bo_w.u-m': 'px',
			'bo_s-s': 'none',
			'bo.ra.tl-g': 20,
			'bo.ra.tr-g': 20,
			'bo.ra.br-g': 20,
			'bo.ra.bl-g': 20,
			'bo.ra.sy-g': 'all',
			'bo.ra.u-g': 'px',
			'bo.ra.u-g.h': 'px',
		};

		const result = getArrowStyles(object);
		expect(result).toMatchSnapshot();
	});

	it.skip('Get a correct palette colors arrow hover styles', () => {
		const object = {
			target: '',
			isHover: true,
			blockStyle: 'light',
			'ar.s-g': true,
			'b_am-g': 'color',
			'bs_ps-g': true,
			'bs_pc-g': 2,
			'bs_po-g': 0.2,
			'bs.sh': true,
			'bs_ps-g.h': true,
			'bs_pc-g.h': 4,
			'bs_po-g.h': 0.2,
			'bs_ho-g.h': 1,
			'bs_v-g.h': 2,
			'bs_blu-g.h': 3,
			'bs_sp-g.h': 4,
			'bo_ps-g': true,
			'bo_pc-g': 4,
			'bo_po-g': 0.2,
			'bo_s-g': 'solid',
			'bo.sh': true,
			'bo_ps-g.h': true,
			'bo_pc-g.h': 1,
			'bo_po-g.h': 0.2,
			'bo_s-g.h': 'solid',
			'bo_w.t-g.h': 1,
			'bo_w.r-g.h': 2,
			'bo_w.b-g.h': 3,
			'bo_w.l-g.h': 4,
			'bo_w.sy-g.h': true,
			'bo_w.u-g.h': 'px',
			'bo.ra.tl-g.h': 1,
			'bo.ra.tr-g.h': 2,
			'bo.ra.br-g.h': 3,
			'bo.ra.bl-g.h': 4,
			'bo.ra.sy-g.h': true,
			'bo.ra.u-g.h': 'px',
			'bc_ps-g': true,
			'bc_pc-g': 5,
			'b.sh': true,
			'b_am-g.h': 'color',
			'bc_ps-g.h': true,
			'bc_pc-g.h': 1,
		};

		const result = getArrowStyles(object);
		expect(result).toMatchSnapshot();
	});

	it('Get a correct arrow hover styles with background, shadow and border custom colors', () => {
		const object = {
			target: '',
			isHover: true,
			blockStyle: 'light',
			'ar.s-g': true,
			'bs_ps-g': true,
			'bs_pc-g': 2,
			'bs_po-g': 0.2,
			'bs.sh': true,
			'bs_ps-g.h': false,
			'bs_cc-g.h': 'rgba(61,133,209)',
			'bs_po-g.h': 0.2,
			'bs_ho-g.h': 1,
			'bs_v-g.h': 2,
			'bs_blu-g.h': 3,
			'bs_sp-g.h': 4,
			'bo_ps-g': true,
			'bo_pc-g': 4,
			'bo_po-g': 0.2,
			'bo_s-g': 'solid',
			'bo.sh': true,
			'bo_ps-g.h': false,
			'bo_cc-g.h': 'rgba(150,200,90)',
			'bo_po-g.h': 0.2,
			'bo_s-g.h': 'solid',
			'bo_w.t-g.h': 1,
			'bo_w.r-g.h': 2,
			'bo_w.b-g.h': 3,
			'bo_w.l-g.h': 4,
			'bo_w.sy-g.h': true,
			'bo_w.u-g.h': 'px',
			'bo.ra.tl-g.h': 1,
			'bo.ra.tr-g.h': 2,
			'bo.ra.br-g.h': 3,
			'bo.ra.bl-g.h': 4,
			'bo.ra.sy-g.h': true,
			'bo.ra.u-g.h': 'px',
			'bo.ra.tl-g': 10,
			'bo.ra.tr-g': 10,
			'bo.ra.br-g': 10,
			'bo.ra.bl-g': 10,
			'bo.ra.sy-g': 'all',
			'bo.ra.u-g': 'px',
			'bc_ps-g': true,
			'bc_pc-g': 5,
			b_ly: [
				{
					type: 'color',
					order: 0,
					'd-g': 'block',
					'bc_ps-g': false,
					'bc_pc-g': 1,
					'bc_po-g': 0.07,
					'bc_cc-g': 'rgba(150,200,90)',
					'bc_cp-g': 'polygon(50% 0%, 0% 100%, 100% 100%)',
				},
			],
		};

		const result = getArrowStyles(object);
		expect(result).toMatchSnapshot();
	});

	it('Return empty arrow styles when arrow status is off', () => {
		const object = {
			target: '',
			blockStyle: 'light',
			'ar.s-g': false,
		};

		const result = getArrowStyles(object);
		expect(result).toMatchSnapshot();
	});

	it('Return empty arrow styles when background color is not selected', () => {
		const object = {
			target: '',
			blockStyle: 'light',
			'ar.s-g': true,
			b_am: 'gradient',
		};

		const result = getArrowStyles(object);
		expect(result).toMatchSnapshot();
	});

	it('Return empty arrow styles when background color is selected and border is active but the style is not solid', () => {
		const object = {
			target: '',
			blockStyle: 'light',
			'ar.s-g': true,
			b_am: 'color',
			'bo_s-g': undefined,
			'bo_s-s': 'dashed',
		};

		const result = getArrowStyles(object);
		expect(result).toMatchSnapshot();
	});

	it('Return empty arrow styles when background color is selected and border is active but some style on hover is not solid', () => {
		const object = {
			target: '',
			blockStyle: 'light',
			'ar.s-g': true,
			b_am: 'color',
			'bo_s-g': undefined,
			'bo_s-s': 'solid',
			'bo_s-s.h': 'dashed',
		};

		const result = getArrowStyles(object);
		expect(result).toMatchSnapshot();
	});
});
