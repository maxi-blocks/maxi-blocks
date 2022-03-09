/**
 * TODO: implement on the rest of default attributes 👍
 */

const hoverAttributesCreator = ({
	obj,
	sameValAttr = [],
	diffValAttr = {},
	newAttr = {},
}) => {
	const response = {};
	const diffValAttrKeys = Object.keys(diffValAttr);

	Object.entries(obj).forEach(([key, val]) => {
		const newKey = `${key}-hover`;
		const value = { ...val };

		if (diffValAttrKeys.includes(key)) value.default = diffValAttr[key];
		else if (
			sameValAttr.length !== 0 &&
			!sameValAttr.includes(key) &&
			'default' in value
		)
			delete value.default;

		response[newKey] = value;
	});

	return { ...response, ...newAttr };
};

export default hoverAttributesCreator;
