import getColorRGBAString from '@extensions/styles/getColorRGBAString';

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

describe('getColorRGBAString', () => {
	it('Returns a single variable color string', () => {
		const result = getColorRGBAString({
			firstVar: 'color-4',
			opacity: 0.5,
			blockStyle: 'light',
		});

		expect(result).toStrictEqual(
			'rgba(var(--maxi-light-color-4,255,74,23),0.5)'
		);
	});

	it('Returns a double variable color string', () => {
		const result = getColorRGBAString({
			firstVar: 'test-color',
			secondVar: 'color-4',
			opacity: 0.5,
			blockStyle: 'light',
		});

		expect(result).toStrictEqual(
			'var(--maxi-light-test-color,rgba(var(--maxi-light-color-4,255,74,23),0.5))'
		);
	});
});
