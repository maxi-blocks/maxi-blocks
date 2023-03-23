import * as attributes from '../../defaults';
import dictionary from '../attributesDictionary';

describe('attributesDictionary', () => {
	it('test', () => {
		const test = attributes;

		expect(test).toMatchSnapshot();
	});

	it.only('Expect no duplicates', () => {
		const allKeys = Object.values(dictionary).map(item =>
			Object.values(item)
		);

		const allKeysFlat = allKeys.flat();

		const duplicates = allKeysFlat.filter(
			(item, index) => allKeysFlat.indexOf(item) !== index
		);

		expect(duplicates).toEqual([]);
	});
});
