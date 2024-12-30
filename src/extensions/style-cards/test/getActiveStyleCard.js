import getStyleCardActive from '@extensions/style-cards/getActiveStyleCard';

describe('getStyleCardActive', () => {
	it('Returns the name and value of the active SC', () => {
		const SC = {
			sc_maxi: {
				name: 'Maxi (Default)',
				status: 'active',
			},
		};

		const result = getStyleCardActive(SC);

		expect(result).toStrictEqual({ key: 'sc_maxi', value: SC.sc_maxi });
	});
	it('Returns false as there is no activated SC', () => {
		const SC = {
			sc_maxi: {
				name: 'Maxi (Default)',
				status: '',
			},
		};

		const result = getStyleCardActive(SC);

		expect(result).toStrictEqual(false);
	});
});
