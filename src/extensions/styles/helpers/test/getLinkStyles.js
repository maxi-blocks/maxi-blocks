import getLinkStyles from '../getLinkStyles';

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

describe('getLinkStyles', () => {
	it('Returns a correct object', () => {
		const obj = {
			'_l_ps-g': true,
			'_l_pc-g': 4,
			'_lih_ps-g': true,
			'_lih_pc-g': 4,
			'_lih_po-g': 0.2,
			'_lia_ps-g': true,
			'_lia_pc-g': 3,
			'_liv_ps-g': true,
			'_liv_pc-g': 3,
		};
		const target = ' p.maxi-text-block__content a';
		const blockStyles = 'light';

		const result = getLinkStyles(obj, target, blockStyles);

		expect(result).toMatchSnapshot();
	});

	it('Returns a correct object with custom colors', () => {
		const obj = {
			'_l_ps-g': false,
			'_l_pc-g': 4,
			'_l_cc-g': 'rgba(57,189,39,1)',
			'_lih_ps-g': false,
			'_lih_pc-g': 4,
			'_lih_po-g': 0.2,
			'_lih_cc-g': 'rgba(191,192,86,1)',
			'_lia_ps-g': false,
			'_lia_pc-g': 3,
			'_lia_cc-g': 'rgba(221,32,32,1)',
			'_liv_ps-g': false,
			'_liv_pc-g': 3,
			'_liv_cc-g': 'rgba(27,109,168,1)',
		};
		const target = ' p.maxi-text-block__content a';
		const blockStyles = 'light';

		const result = getLinkStyles(obj, target, blockStyles);

		expect(result).toMatchSnapshot();
	});
});
