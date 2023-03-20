import {
	colorDictionary,
	noTypeDictionary,
	prefixesDictionary,
	suffixesDictionary,
} from './attributesDictionary';

const blockAttributesShorter = attributes => {
	const newAttributes = {};

	Object.entries(attributes).forEach(([objKey, objVal]) => {
		let newKey = objKey;

		// if (type === 'background') debugger;

		// Ensures we set from the longest word to the shortest
		const dictionaryReplacer = dictionary =>
			Object.entries(dictionary)
				.sort(([a], [b]) => b.length - a.length)
				.forEach(([key, val]) => {
					if (newKey.includes(key)) newKey = newKey.replace(key, val);
				});

		dictionaryReplacer(noTypeDictionary);
		dictionaryReplacer(prefixesDictionary);
		dictionaryReplacer(suffixesDictionary);
		dictionaryReplacer(colorDictionary);

		newAttributes[newKey] = { ...objVal, originalLabel: objKey };
	});

	return newAttributes;
};

export default blockAttributesShorter;
