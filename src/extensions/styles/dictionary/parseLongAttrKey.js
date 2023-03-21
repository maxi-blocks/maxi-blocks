import {
	colorDictionary,
	noTypeDictionary,
	prefixesDictionary,
	suffixesDictionary,
} from './attributesDictionary';

/**
 * Parse long key to short one
 *
 * @param {*} attrKey
 * @returns
 */
const parseLongAttrKey = attrKey => {
	if (!attrKey) return null;

	let newKey = attrKey;

	const dictionaryReplacer = dictionary =>
		Object.entries(dictionary)
			.sort(([a], [b]) => b.length - a.length) // Ensures we set from the longest word to the shortest
			.forEach(([key, val]) => {
				// We need to check if the key is a word, not a part of another word
				let cleanedKey = key;
				// Prefixes clean
				if (key.includes('-') && key.endsWith('-'))
					cleanedKey = cleanedKey.replace(/-([^/-]*)$/, '');
				// Suffixes clean
				if (val.includes('.') && val.startsWith('.'))
					cleanedKey = cleanedKey.replace('-', '');

				const regex = new RegExp(`(^|\\W)(${cleanedKey})(\\W|$)`);

				// if (newKey.includes(key)) debugger;

				if (newKey.includes(key) && regex.test(newKey)) {
					newKey = newKey.replace(key, val);
				}
			});

	dictionaryReplacer(colorDictionary);
	dictionaryReplacer(noTypeDictionary);
	dictionaryReplacer(prefixesDictionary);
	dictionaryReplacer(suffixesDictionary);

	return newKey;
};

export default parseLongAttrKey;
