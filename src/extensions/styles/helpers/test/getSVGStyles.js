import { getSVGStyles } from '../getSVGStyles';

jest.mock('@wordpress/data', () => {
	return {
		select: jest.fn(() => {
			return {
				getSelectedBlockCount: jest.fn(() => 1),
			};
		}),
	};
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
