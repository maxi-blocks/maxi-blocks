import getDefaultSCValue from '../getDefaultSCValue';

describe('getDefaultSCValue', () => {
	it('Returns the default SC value', () => {
		const SC = {
			name: 'Maxi (Default)',
			light: {
				defaultStyleCard: {
					p: {
						color: 'blue',
					},
					h1: {
						color: 'red',
					},
				},
			},
		};

		const result = getDefaultSCValue({
			target: 'color',
			SC,
			SCStyle: 'light',
		});

		expect(result).toStrictEqual('blue');
	});

	it('Returns the default SC value if the groupAttr is present', () => {
		const SC = {
			name: 'Maxi (Default)',
			light: {
				defaultStyleCard: {
					p: {
						color: 'blue',
					},
					h1: {
						color: 'red',
					},
				},
			},
		};

		const result = getDefaultSCValue({
			target: 'color',
			SC,
			SCStyle: 'light',
			groupAttr: 'h1',
		});

		expect(result).toStrictEqual('red');
	});
});
