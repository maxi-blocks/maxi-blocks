/**
 * Internal dependencies
 */
import * as attributes from '../../defaults';
import dictionary, {
	prefixesDictionary,
	suffixesDictionary,
} from '../attributesDictionary';
import parseLongAttrKey from '../parseLongAttrKey';
import parseShortAttrKey from '../parseShortAttrKey';

/**
 * External dependencies
 */
import { isBoolean } from 'lodash';

describe('attributesDictionary', () => {
	it('All attributes label coincide with the longLabel when are parsed, and vice versa', () => {
		const test = Object.entries(attributes).map(([attrKey, attrType]) =>
			Object.entries(attrType).map(([label, { longLabel }]) => {
				const parsedLabel = parseShortAttrKey(label);
				const parsedLongLabel = parseLongAttrKey(longLabel);

				// if (
				// 	attrKey !== 'scroll' &&
				// 	!(parsedLabel === longLabel && parsedLongLabel === label)
				// )
				// 	debugger;

				return parsedLabel === longLabel && parsedLongLabel === label
					? true
					: { label, parsedLabel, longLabel, parsedLongLabel };
			})
		);

		const result = test.flat().filter(el => !isBoolean(el));

		expect(result).toStrictEqual([]);
	});

	it('Expect no duplicated keys', () => {
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
		const allKeys = Object.values(prefixesDictionary);

		const allKeysFlat = allKeys.flat();

		const duplicates = allKeysFlat.filter(
			(item, index) => allKeysFlat.indexOf(item) !== index
		);

		expect(duplicates).toEqual([]);
	});

	it('Expect no duplicated suffixes', () => {
		const allKeys = Object.values(suffixesDictionary);

		const allKeysFlat = allKeys.flat();

		const duplicates = allKeysFlat.filter(
			(item, index) => allKeysFlat.indexOf(item) !== index
		);

		expect(duplicates).toEqual([]);
	});
});
