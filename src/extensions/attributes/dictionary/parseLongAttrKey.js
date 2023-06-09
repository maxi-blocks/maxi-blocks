import getCleanKey from '../getCleanKey';
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

	const getLongestKey = dictionary =>
		Object.keys(dictionary).reduce((maxLength, key) => {
			return Math.max(maxLength, key.length);
		}, 0);

	const longestKey = Math.max(
		getLongestKey(prefixesDictionary),
		getLongestKey(colorDictionary),
		getLongestKey(noTypeDictionary),
		getLongestKey(suffixesDictionary)
	);

	const dictionaryReplacer = (dictionary, keyLength) =>
		Object.entries(dictionary)
			.filter(([key]) => key.length === keyLength)
			.sort(([a], [b]) => b.length - a.length) // Ensures we set from the longest word to the shortest
			.forEach(([key, val]) => {
				// We need to check if the key is a word, not a part of another word
				let cleanedKey = key;
				// Prefixes clean
				if (key.includes('-') && key.endsWith('-'))
					cleanedKey = cleanedKey.replace(/-([^/-]*)$/, '');
				// Suffixes clean
				if ((val.includes('.') && val.startsWith('.')) || val === '-g')
					cleanedKey = cleanedKey.replace('-', '');

				const regex = new RegExp(`(^|\\W)(${cleanedKey})(\\W|$)`);

				if (newKey.includes(key) && regex.test(newKey)) {
					// 'content' exists as a key and as a prefix. To avoid modifying the components while reducing
					// the attributes labels, we need to create this exception
					let canReplace = key !== 'content' && key !== 'content-';

					if (!canReplace) {
						if (key === 'content-' && newKey.startsWith('content-'))
							canReplace = true;
						if (key === 'content' && !newKey.startsWith('content-'))
							canReplace = true;
					}
					// exception for stroke
					if (key === 'stroke-' && !newKey.includes('stroke-_')) {
						canReplace = false;
					}

					if (canReplace) newKey = newKey.replace(cleanedKey, val);
					// exception for scroll attributes e.g. scroll-rotate-rotate...
					if (canReplace) newKey = newKey.replace(cleanedKey, val);
				}
			});

	for (let i = 0; i < longestKey; i += 1) {
		dictionaryReplacer(prefixesDictionary, longestKey - i);
		dictionaryReplacer(colorDictionary, longestKey - i);
		dictionaryReplacer(noTypeDictionary, longestKey - i);
		dictionaryReplacer(suffixesDictionary, longestKey - i);
	}
	return getCleanKey(newKey);
};

export default parseLongAttrKey;
