import * as attributes from '../../defaults';
import dictionary, {
	prefixesDictionary,
	suffixesDictionary,
} from '../attributesDictionary';

describe('attributesDictionary', () => {
	it.only('test', () => {
		const test = attributes;

		expect(test).toMatchSnapshot();
	});

	it('Expect no duplicates', () => {
		const allKeys = Object.values(dictionary).map(item =>
			Object.values(item)
		);

		const allKeysFlat = allKeys.flat();

		const duplicates = allKeysFlat.filter(
			(item, index) => allKeysFlat.indexOf(item) !== index
		);

		expect(duplicates).toEqual([]);
	});

	it('Expect no duplicated prefixes', () => {
		const allKeys = Object.values(prefixesDictionary).map(item =>
			Object.values(item)
		);

		const allKeysFlat = allKeys.flat();

		const duplicates = allKeysFlat.filter(
			(item, index) => allKeysFlat.indexOf(item) !== index
		);

		expect(duplicates).toEqual([]);
	});

	it('Expect no duplicated suffixes', () => {
		const allKeys = Object.values(suffixesDictionary).map(item =>
			Object.values(item)
		);

		const allKeysFlat = allKeys.flat();

		const duplicates = allKeysFlat.filter(
			(item, index) => allKeysFlat.indexOf(item) !== index
		);

		expect(duplicates).toEqual([]);
	});
});
