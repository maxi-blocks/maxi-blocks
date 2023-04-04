import parseLongAttrObj from '../../../attributes/dictionary/parseLongAttrObj';
import getBoxShadowStyles from '../getBoxShadowStyles';

jest.mock('src/extensions/attributes/getDefaultAttribute.js', () =>
	jest.fn(() => 4)
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

describe('getBoxShadowStyles', () => {
	it('Get a correct box shadow styles with values in all responsive and with custom color', () => {
		const object = parseLongAttrObj({
			'box-shadow-palette-status-general': false,
			'bs_cc-general': 'rgb(255, 99, 71)',
			'bs_ho-general': 1,
			'bs_v-general': 2,
			'bs_blu-general': 3,
			'bs_sp-general': 4,
			'bs_in-general': true,
			'bs_blu.u-general': 'px',
			'bs_ho.u-general': 'px',
			'bs_v.u-general': 'px',
			'bs_sp.u-general': 'px',
			'box-shadow-palette-status-xxl': false,
			'bs_cc-xxl': 'rgb(255, 99, 72)',
			'bs_ho-xxl': 5,
			'bs_v-xxl': 6,
			'bs_blu-xxl': 7,
			'bs_sp-xxl': 8,
			'bs_blu.u-xxl': 'px',
			'bs_ho.u-xxl': 'px',
			'bs_v.u-xxl': 'px',
			'bs_sp.u-xxl': 'px',
			'box-shadow-palette-status-xl': false,
			'bs_cc-xl': 'rgb(255, 99, 73)',
			'bs_ho-xl': 9,
			'bs_v-xl': 10,
			'bs_blu-xl': 11,
			'bs_sp-xl': 12,
			'bs_blu.u-xl': 'px',
			'bs_ho.u-xl': 'px',
			'bs_v.u-xl': 'px',
			'bs_sp.u-xl': 'px',
			'box-shadow-palette-status-l': false,
			'bs_cc-l': 'rgb(255, 99, 74)',
			'bs_ho-l': 13,
			'bs_v-l': 14,
			'bs_blu-l': 15,
			'bs_sp-l': 16,
			'bs_blu.u-l': 'px',
			'bs_ho.u-l': 'px',
			'bs_v.u-l': 'px',
			'bs_sp.u-l': 'px',
			'box-shadow-palette-status-m': false,
			'bs_cc-m': 'rgb(255, 99, 75)',
			'bs_ho-m': 17,
			'bs_v-m': 18,
			'bs_blu-m': 19,
			'bs_sp-m': 20,
			'bs_in-m': false,
			'bs_blu.u-m': 'px',
			'bs_ho.u-m': 'px',
			'bs_v.u-m': 'px',
			'bs_sp.u-m': 'px',
			'box-shadow-palette-status-s': false,
			'bs_cc-s': 'rgb(255, 99, 76)',
			'bs_ho-s': 21,
			'bs_v-s': 22,
			'bs_blu-s': 23,
			'bs_sp-s': 24,
			'bs_blu.u-s': 'px',
			'bs_ho.u-s': 'px',
			'bs_v.u-s': 'px',
			'bs_sp.u-s': 'px',
			'box-shadow-palette-status-xs': false,
			'bs_cc-xs': 'rgb(255, 99, 77)',
			'bs_ho-xs': 25,
			'bs_v-xs': 26,
			'bs_blu-xs': 27,
			'bs_sp-xs': 28,
			'bs_in-xs': true,
			'bs_blu.u-xs': 'px',
			'bs_ho.u-xs': 'px',
			'bs_v.u-xs': 'px',
			'bs_sp.u-xs': 'px',
		});

		const result = getBoxShadowStyles({
			obj: object,
			blockStyle: 'light',
		});
		expect(result).toMatchSnapshot();
	});

	it('Returns box-shadow object with different colors based on palette', () => {
		const object = parseLongAttrObj({
			'box-shadow-palette-status-general': true,
			'bs_pc-general': 4,
			'bs_ho-general': 1,
			'bs_v-general': 2,
			'bs_blu-general': 3,
			'bs_sp-general': 4,
			'bs_pc-l': 2,
			'bs_po-l': 0.2,
			'bs_blu.u-general': 'px',
			'bs_ho.u-general': 'px',
			'bs_v.u-general': 'px',
			'bs_sp.u-general': 'px',
		});

		const result = getBoxShadowStyles({
			obj: object,
			blockStyle: 'light',
		});
		expect(result).toMatchSnapshot();
	});

	it('Returns box-shadow default styles for IB', () => {
		const object = parseLongAttrObj({
			'box-shadow-palette-status-general': true,
			'bs_pc-general': 8,
			'bs_pc-l': 8,
			'bs_po-general': 1,
			'bs_po-l': 1,
			'bs_in-general': false,
			'bs_ho-general': 0,
			'bs_ho-l': 0,
			'bs_ho.u-general': 'px',
			'bs_ho.u-l': 'px',
			'bs_v-general': 0,
			'bs_v-l': 0,
			'bs_v.u-general': 'px',
			'bs_v.u-l': 'px',
			'bs_blu-general': 0,
			'bs_blu-l': 0,
			'bs_blu.u-general': 'px',
			'bs_blu.u-l': 'px',
			'bs_sp-general': 0,
			'bs_sp-l': 0,
			'bs_sp.u-general': 'px',
			'bs_sp.u-l': 'px',
		});

		const result = getBoxShadowStyles({
			obj: object,
			blockStyle: 'light',
			isIB: true,
		});
		expect(result).toMatchSnapshot();
	});
});
