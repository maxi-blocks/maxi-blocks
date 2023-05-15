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
			!sameValAttr.includes(key) &&
			'default' in value &&
			!newKey.includes('palette-sc-status-general-hover') // Need to keep the default value for this one
		)
			delete value.default;

		response[newKey] = value;
	});

	return { ...response, ...newAttr };
};

export default hoverAttributesCreator;
