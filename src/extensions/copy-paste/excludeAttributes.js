const GLOBAL_EXCLUDE = ['uniqueID', 'customLabel'];

const excludeAttributes = (rawAttributes, copyPasteMapping) => {
	const attributes = { ...rawAttributes };

	const keysToExclude = [
		...GLOBAL_EXCLUDE,
		...(copyPasteMapping._exclude || []),
	];

	keysToExclude.forEach(prop => {
		if (attributes[prop]) delete attributes[prop];
	});

	return attributes;
};

export default excludeAttributes;
