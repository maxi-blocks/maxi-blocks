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

	it('Uses Style Card variables for connected Number Counter colours', () => {
		const obj = {
			'number-counter-text-palette-status-general': true,
			'number-counter-text-palette-sc-status-general': false,
			'number-counter-text-palette-color-general': 4,
			'number-counter-text-palette-opacity-general': 0.8,
			'number-counter-circle-background-palette-status': true,
			'number-counter-circle-background-palette-sc-status': false,
			'number-counter-circle-background-palette-color': 2,
			'number-counter-circle-background-palette-opacity': 0.7,
			'number-counter-circle-bar-palette-status-general': true,
			'number-counter-circle-bar-palette-sc-status-general': false,
			'number-counter-circle-bar-palette-color-general': 6,
			'number-counter-circle-bar-palette-opacity-general': 0.6,
		};

		const result = getNumberCounterStyles({
			obj,
			target: '.maxi-number-counter__box',
			blockStyle: 'light',
		});

		expect(
			result[
				' .maxi-number-counter__box .maxi-number-counter__box__text'
			].numberCounterText.general.color
		).toBe(
			'var(--maxi-light-number-counter-color,rgba(var(--maxi-light-color-4,255,74,23),0.8))'
		);
		expect(
			result[
				' .maxi-number-counter__box .maxi-number-counter__box__background'
			].numberCounterBackground.general.stroke
		).toBe(
			'var(--maxi-light-number-counter-circle-background,rgba(var(--maxi-light-color-2,242,249,253),0.7))'
		);
		expect(
			result[
				' .maxi-number-counter__box .maxi-number-counter__box__circle'
			].numberCounterCircleBar.general.stroke
		).toBe(
			'var(--maxi-light-number-counter-circle-bar,rgba(var(--maxi-light-color-6,201,52,10),0.6))'
		);
	});

	it('Does not emit the legacy Roboto default as a block font override', () => {
		const result = getNumberCounterStyles({
			obj: {
				'font-family-general': 'Roboto',
			},
			target: '.maxi-number-counter__box',
			blockStyle: 'light',
		});

		expect(
			result[
				' .maxi-number-counter__box .maxi-number-counter__box__text'
			].numberCounterText.general['font-family']
		).toBeUndefined();
	});

	it('Keeps explicit Number Counter font family overrides', () => {
		const result = getNumberCounterStyles({
			obj: {
				'font-family-general': 'Poppins',
			},
			target: '.maxi-number-counter__box',
			blockStyle: 'light',
		});

		expect(
			result[
				' .maxi-number-counter__box .maxi-number-counter__box__text'
			].numberCounterText.general['font-family']
		).toBe('Poppins');
	});
});
