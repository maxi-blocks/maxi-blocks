const excludeAttributes = (rawAttributes, copyPasteMapping) => {
	const attributes = { ...rawAttributes };

	if (copyPasteMapping._exclude)
		copyPasteMapping._exclude.forEach(prop => {
			if (attributes[prop]) delete attributes[prop];
		});

	return attributes;
};

export default excludeAttributes;
