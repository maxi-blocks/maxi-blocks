import { getSVGStyles, getSVGWidthStyles } from '@extensions/styles/helpers/getSVGStyles';

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
			'svg-fill-palette-status': true,
			'svg-fill-palette-color': 4,
			'svg-line-palette-status': true,
			'svg-line-palette-color': 7,
			'svg-stroke-general': 2,
			'svg-width-general': '64',
			'svg-width-unit-general': 'px',
			'svg-stroke-m': 20,
			'svg-width-m': '640',
			'svg-width-unit-m': 'vw',
		};
		const target = ' .maxi-svg-icon-block__icon';
		const blockStyle = 'light';

		const result = getSVGStyles({ obj, target, blockStyle });

		expect(result).toMatchSnapshot();
	});

	it('Should return correct icon size', () => {
		const attributes = {
			'svg-width-general': '32',
			'svg-width-unit-general': 'px',
			'svg-width-fit-content-general': false,
			'svg-icon-width-general': '71',
			'svg-icon-width-unit-general': '%',
		};

		expect(
			getSVGWidthStyles({ obj: attributes, prefix: 'svg-' })
		).toMatchSnapshot();
	});

	it('Should return correct icon size with disableHeight: false', () => {
		const attributes = {
			'svg-width-general': '32',
			'svg-width-unit-general': 'px',
			'svg-width-fit-content-general': false,
			'svg-icon-width-general': '71',
			'svg-icon-width-unit-general': '%',
		};

		expect(
			getSVGWidthStyles({
				obj: attributes,
				prefix: 'svg-',
				disableHeight: false,
			})
		).toMatchSnapshot();
	});

	it('Should work on responsive', () => {
		const prefix = 'any-prefix-';

		const attributes = {
			[`${prefix}icon-height-general`]: '32',
			[`${prefix}icon-height-unit-general`]: 'px',
			[`${prefix}icon-height-m`]: '12',
			[`${prefix}icon-height-unit-m`]: 'em',
		};

		expect(
			getSVGWidthStyles({ obj: attributes, prefix })
		).toMatchSnapshot();
	});

	it('Should return right styles with height fit-content, width/height ratio > 1 with disableHeight true', () => {
		const attributes = {
			'icon-width-general': '36',
			'icon-width-unit-general': '%',
			'icon-width-fit-content-general': true,
			'icon-width-l': '32',
			'icon-width-fit-content-l': false,
			'icon-width-m': '36',
			'icon-width-fit-content-m': true,
			'icon-stroke-general': '1',
			'icon-stroke-l': '3',
			'icon-stroke-m': '4',
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
			'icon-width-general': '36',
			'icon-width-unit-general': '%',
			'icon-width-fit-content-general': true,
			'icon-width-l': '32',
			'icon-width-fit-content-l': false,
			'icon-width-m': '36',
			'icon-width-fit-content-m': true,
			'icon-stroke-general': '1',
			'icon-stroke-l': '3',
			'icon-stroke-m': '4',
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
