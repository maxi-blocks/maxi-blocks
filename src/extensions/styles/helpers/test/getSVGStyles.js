import { getSVGStyles, getSVGWidthStyles } from '../getSVGStyles';

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

describe('getSVGStyles', () => {
	it('Returns correct styles', () => {
		const obj = {
			sfi_ps: true,
			sfi_pc: 4,
			sli_ps: true,
			sli_pc: 7,
			's_str-general': 2,
			's_w-general': '64',
			's_w.u-general': 'px',
			's_str-m': 20,
			's_w-m': '640',
			's_w.u-m': 'vw',
		};
		const target = ' .maxi-svg-icon-block__icon';
		const blockStyle = 'light';

		const result = getSVGStyles({ obj, target, blockStyle });

		expect(result).toMatchSnapshot();
	});

	it('Should return correct icon size', () => {
		const attributes = {
			's_w-general': '32',
			's_w.u-general': 'px',
			's_wfc-general': false,
			's-i_w-general': '71',
			's-i_w.u-general': '%',
		};

		expect(
			getSVGWidthStyles({ obj: attributes, prefix: 's-' })
		).toMatchSnapshot();
	});

	it('Should return correct icon size with disableHeight: false', () => {
		const attributes = {
			's_w-general': '32',
			's_w.u-general': 'px',
			's_wfc-general': false,
			's-i_w-general': '71',
			's-i_w.u-general': '%',
		};

		expect(
			getSVGWidthStyles({
				obj: attributes,
				prefix: 's-',
				disableHeight: false,
			})
		).toMatchSnapshot();
	});

	it('Should work on responsive', () => {
		const prefix = 'any-prefix';

		const attributes = {
			[`${prefix}_h-general`]: '32',
			[`${prefix}_h.u-general`]: 'px',
			[`${prefix}_h-m`]: '12',
			[`${prefix}_h.u-m`]: 'em',
		};

		expect(
			getSVGWidthStyles({ obj: attributes, prefix: `${prefix}-` })
		).toMatchSnapshot();
	});

	it('Should return right styles with height fit-content, width/height ratio > 1 with disableHeight true', () => {
		const attributes = {
			'i_w-general': '36',
			'i_w.u-general': '%',
			'i_wfc-general': true,
			'i_w-l': '32',
			'i_wfc-l': false,
			'i_w-m': '36',
			'i_wfc-m': true,
			'i_str-general': '1',
			'i_str-l': '3',
			'i_str-m': '4',
		};

		expect(
			getSVGWidthStyles({
				obj: attributes,
				iconWidthHeightRatio: 3,
				disableHeight: true,
			})
		).toMatchSnapshot();
	});

	it('Should return right styles with height fit-content, width/height ratio < 1 with disableHeight: true', () => {
		const attributes = {
			'i_w-general': '36',
			'i_w.u-general': '%',
			'i_wfc-general': true,
			'i_w-l': '32',
			'i_wfc-l': false,
			'i_w-m': '36',
			'i_wfc-m': true,
			'i_str-general': '1',
			'i_str-l': '3',
			'i_str-m': '4',
		};

		expect(
			getSVGWidthStyles({
				obj: attributes,
				iconWidthHeightRatio: 0.5,
				disableHeight: true,
			})
		).toMatchSnapshot();
	});
});
