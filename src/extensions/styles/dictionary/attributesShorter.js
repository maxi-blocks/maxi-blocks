import dictionary from './attributesDictionary';

const attributesShorter = (obj, type) => {
	const currentDictionary = dictionary[type];
	const objKeys = Object.keys(obj);

	const attributes = {};

	Object.entries(currentDictionary).forEach(([key, val]) => {
		objKeys.forEach(objKey => {
			if (objKey.includes(key)) {
				const newKey = objKey.replace(key, val);

				attributes[newKey] = obj[objKey];

				delete objKeys[objKeys.indexOf(objKey)];
			}
		});
	});

	return attributes;
};

export default attributesShorter;
