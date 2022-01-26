import { getSVGStyles } from '../getSVGStyles';

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
			'svg-width-general': 64,
			'svg-width-unit-general': 'px',
			'svg-responsive-general': false,
			'svg-stroke-m': 20,
			'svg-width-m': 640,
			'svg-width-unit-m': 'vw',
			'svg-responsive-m': true,
		};
		const target = ' .maxi-svg-icon-block__icon';
		const blockStyle = 'light';

		const result = getSVGStyles({ obj, target, blockStyle });

		expect(result).toMatchSnapshot();
	});
});
