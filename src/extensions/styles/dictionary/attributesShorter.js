import dictionary, {
	colorDictionary,
	prefixesDictionary,
	suffixesDictionary,
} from './attributesDictionary';

const attributesShorter = (obj, type) => {
	const currentDictionary = dictionary[type] ?? {};

	const attributes = {};

	Object.entries(obj).forEach(([objKey, objVal]) => {
		let newKey = objKey;

		// if (type === 'background') debugger;

		// Ensures we set from the longest word to the shortest
		const dictionaryReplacer = dictionary =>
			Object.entries(dictionary)
				.sort(([a], [b]) => b.length - a.length)
				.forEach(([key, val]) => {
					if (newKey.includes(key)) newKey = newKey.replace(key, val);
				});

		dictionaryReplacer(currentDictionary);
		dictionaryReplacer(prefixesDictionary);
		dictionaryReplacer(suffixesDictionary);
		dictionaryReplacer(colorDictionary);

		attributes[newKey] = { ...objVal, originalLabel: objKey };
	});

	return attributes;
};

export default attributesShorter;
