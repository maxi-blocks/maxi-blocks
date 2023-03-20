import * as attributes from '../../defaults';

describe('attributesDictionary', () => {
	it('test', () => {
		const test = attributes;

		expect(test).toMatchSnapshot();
	});

	it('Expect no duplicates', () => {
		const test = attributes;

		const allKeys = Object.values(test).map(obj => Object.keys(obj));

		const allKeysFlat = allKeys.flat();

		const duplicates = allKeysFlat.filter(
			(item, index) => allKeysFlat.indexOf(item) !== index
		);

		expect(duplicates).toEqual([]);
	});
});
