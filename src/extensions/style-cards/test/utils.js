import replaceUndefinedWithNull from '@extensions/style-cards/utils';

describe('replaceUndefinedWithNull', () => {
	it('Should return primitive values unchanged', () => {
		expect(replaceUndefinedWithNull(5)).toBe(5);
		expect(replaceUndefinedWithNull('test')).toBe('test');
		expect(replaceUndefinedWithNull(false)).toBe(false);
		expect(replaceUndefinedWithNull(null)).toBe(null);
	});

	it('Should replace undefined with null in simple object', () => {
		const input = {
			a: undefined,
			b: 'value',
			c: undefined,
		};
		const expected = {
			a: null,
			b: 'value',
			c: null,
		};
		expect(replaceUndefinedWithNull(input)).toEqual(expected);
	});

	it('Should handle nested objects', () => {
		const input = {
			a: {
				b: undefined,
				c: {
					d: undefined,
					e: 'value',
				},
			},
			f: undefined,
		};
		const expected = {
			a: {
				b: null,
				c: {
					d: null,
					e: 'value',
				},
			},
			f: null,
		};
		expect(replaceUndefinedWithNull(input)).toEqual(expected);
	});

	it('Should handle arrays', () => {
		const input = {
			arr: [undefined, { a: undefined }, 'value'],
			b: undefined,
		};
		const expected = {
			arr: [null, { a: null }, 'value'],
			b: null,
		};
		expect(replaceUndefinedWithNull(input)).toEqual(expected);
	});
});
