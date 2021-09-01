import getSVGStyles from '../getSvgStyles';

describe('getSVGStyles', () => {
	it('Returns correct styles', () => {
		const obj = {
			'svg-palette-fill-color-status': true,
			'svg-palette-fill-color': 4,
			'svg-palette-line-color-status': true,
			'svg-palette-line-color': 7,
			'svg-stroke-general': 2,
			'svg-width-general': 64,
			'svg-width-unit-general': 'px',
		};
		const target = ' .maxi-svg-icon-block__icon';
		const blockStyle = 'light';

		const result = getSVGStyles({ obj, target, blockStyle });

		expect(result).toMatchSnapshot();
	});
});
