import getDividerStyles from '../getDividerStyles';

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

describe('getDividerStyles', () => {
	it('Get a correct divider styles', () => {
		const obj = {
			'di-bo.t-g': 38,
			'di-bo.t-s': 149,
			'di-bo.t.u-g': 'px',
			'di-bo.r-g': 2,
			'di-bo.r-l': 14,
			'di-bo.r.u-g': 'px',
			'di-bo.ra-g': false,
			'di_w-g': 79,
			'di_w-s': 23,
			'di_w.u-g': '%',
			'di_h-g': 100,
			'di_h-l': 41,
			'_la-g': 'row',
			'_lv-g': 'flex-end',
			'_lv-l': 'flex-start',
			'_lv-s': 'center',
			'_lh-g': 'flex-start',
			'_lh-l': 'center',
			'_lh-s': 'flex-start',
			'_lo-g': 'horizontal',
			'_lo-l': 'vertical',
			'_lo-s': 'horizontal',
			'di-bo_ps-g': true,
			'di-bo_ps-l': true,
			'di-bo_ps-s': true,
			'di-bo_pc-g': 7,
			'di-bo_pc-l': 4,
			'di-bo_pc-s': 3,
			'di-bo_po-l': 0.56,
			'di-bo_po-s': 0.56,
			'di-bo_s-g': 'dashed',
			'di-bo_s-l': 'solid',
		};

		const resultLine = getDividerStyles(obj, 'line', 'light');
		expect(resultLine).toMatchSnapshot();

		const resultAlign = getDividerStyles(obj, 'row', 'light');
		expect(resultAlign).toMatchSnapshot();
	});
});
