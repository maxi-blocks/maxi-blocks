import getNumberCounterStyles from '../getNumberCounterStyles';

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

describe('getNumberCounterStyles', () => {
	it('Returns correct styles', () => {
		const obj = {
			'nc.s': true,
			nc_pr: true,
			'nc_psi.s': false,
			'nc_rou.s': false,
			'nc_ci.s': false,
			nc_sta: 0,
			nc_e: 100,
			nc_du: 1,
			nc_str: 20,
			nc_san: 'page-load',
			'nct_ps-g': true,
			'nct_pc-g': 5,
			nccb_ps: true,
			nccb_pc: 2,
			'nccba_ps-g': true,
			'nccba_pc-g': 4,
			'nc-ti_fs-g': 40,
			'_ff-g': 'Roboto',
		};
		const target = '.maxi-number-counter__box';
		const blockStyle = 'light';

		const result = getNumberCounterStyles({ obj, target, blockStyle });

		expect(result).toMatchSnapshot();
	});
});
