import getNumberCounterStyles from '@extensions/styles/helpers/getNumberCounterStyles';

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

describe('getNumberCounterStyles', () => {
	it('Returns correct styles', () => {
		const obj = {
			'number-counter-status': true,
			'number-counter-preview': true,
			'number-counter-percentage-sign-status': false,
			'number-counter-percentage-sign-position-status': false,
			'number-counter-rounded-status': false,
			'number-counter-circle-status': false,
			'number-counter-start': 0,
			'number-counter-end': 100,
			'number-counter-radius': 200,
			'number-counter-stroke': 20,
			'number-counter-duration': 1,
			'number-counter-start-animation': 'page-load',
			'number-counter-text-palette-status-general': true,
			'number-counter-text-palette-color-general': 5,
			'number-counter-circle-background-palette-status': true,
			'number-counter-circle-background-palette-color': 2,
			'number-counter-circle-bar-palette-status-general': true,
			'number-counter-circle-bar-palette-color-general': 4,
			'number-counter-title-font-size-general': 40,
			'font-family-general': 'Roboto',
		};
		const target = '.maxi-number-counter__box';
		const blockStyle = 'light';

		const result = getNumberCounterStyles({ obj, target, blockStyle });

		expect(result).toMatchSnapshot();
	});
});
