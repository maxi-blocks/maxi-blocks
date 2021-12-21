const prefixAttributesCreator = ({
	obj,
	prefix,
	diffValAttr = {},
	newAttr = {},
	exclAttr = [],
}) => {
	const response = {};
	const diffValAttrKeys = Object.keys(diffValAttr);

	Object.entries(obj).forEach(([key, val]) => {
		if (exclAttr.every(excl => !key.includes(excl))) {
			const newKey = `${prefix}${key}`;

			if (diffValAttrKeys.includes(newKey))
				response[newKey] = {
					...val,
					default: diffValAttr[newKey],
				};
			else response[newKey] = val;
		}
	});

	return { ...response, ...newAttr };
};

export default prefixAttributesCreator;
