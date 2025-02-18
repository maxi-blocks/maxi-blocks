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

	it('Returns selected SC if present otherwise returns the active SC', () => {
		const SC = {
			sc_mini: {
				name: 'Mini (Default)',
				status: 'active',
			},
			sc_maxi: {
				name: 'Maxi (Default)',
				selected: true,
				status: 'active',
			},
		};

		const result = getStyleCardActive(SC, true);

		expect(result).toStrictEqual({ key: 'sc_maxi', value: SC.sc_maxi });

		const SC2 = {
			sc_maxi: {
				name: 'Maxi (Default)',
				status: 'active',
			},
		};

		const result2 = getStyleCardActive(SC2, true);

		expect(result2).toStrictEqual({ key: 'sc_maxi', value: SC2.sc_maxi });
	});
});
