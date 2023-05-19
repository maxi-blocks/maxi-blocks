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
			'_l_ps-general': true,
			'_l_pc-general': 4,
			'_lih_ps-general': true,
			'_lih_pc-general': 4,
			'_lih_po-general': 0.2,
			'_lia_ps-general': true,
			'_lia_pc-general': 3,
			'_liv_ps-general': true,
			'_liv_pc-general': 3,
		};
		const target = ' p.maxi-text-block__content a';
		const blockStyles = 'light';

		const result = getLinkStyles(obj, target, blockStyles);

		expect(result).toMatchSnapshot();
	});

	it('Returns a correct object with custom colors', () => {
		const obj = {
			'_l_ps-general': false,
			'_l_pc-general': 4,
			'_l_cc-general': 'rgba(57,189,39,1)',
			'_lih_ps-general': false,
			'_lih_pc-general': 4,
			'_lih_po-general': 0.2,
			'_lih_cc-general': 'rgba(191,192,86,1)',
			'_lia_ps-general': false,
			'_lia_pc-general': 3,
			'_lia_cc-general': 'rgba(221,32,32,1)',
			'_liv_ps-general': false,
			'_liv_pc-general': 3,
			'_liv_cc-general': 'rgba(27,109,168,1)',
		};
		const target = ' p.maxi-text-block__content a';
		const blockStyles = 'light';

		const result = getLinkStyles(obj, target, blockStyles);

		expect(result).toMatchSnapshot();
	});
});
