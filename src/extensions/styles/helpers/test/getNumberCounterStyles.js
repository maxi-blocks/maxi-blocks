import getNumberCounterStyles from '../getNumberCounterStyles';

describe('getNumberCounterStyles', () => {
	it('Returns correct styles', () => {
		const obj = {
			'number-counter-status': true,
			'number-counter-preview': true,
			'number-counter-percentage-sign-status': false,
			'number-counter-rounded-status': false,
			'number-counter-circle-status': false,
			'number-counter-start': 0,
			'number-counter-end': 100,
			'number-counter-radius': 200,
			'number-counter-stroke': 20,
			'number-counter-duration': 1,
			'number-counter-start-animation': 'page-load',
			'number-counter-text-palette-status': true,
			'number-counter-text-palette-color': 5,
			'number-counter-circle-background-palette-status': true,
			'number-counter-circle-background-palette-color': 2,
			'number-counter-circle-bar-palette-status': true,
			'number-counter-circle-bar-palette-color': 4,
			'number-counter-title-font-size': 40,
			'number-counter-title-font-family': 'Roboto',
		};
		const target = '.maxi-number-counter__box';
		const blockStyle = 'light';

		const result = getNumberCounterStyles({ obj, target, blockStyle });

		expect(result).toMatchSnapshot();
	});
});
