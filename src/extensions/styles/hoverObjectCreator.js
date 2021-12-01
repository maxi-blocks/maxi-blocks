/**
 * TODO: implement on the rest of default attributes 👍
 */

const breakpointObjectCreator = ({
	obj,
	sameValAttr = [],
	diffValAttr = {},
	newAttr = {},
}) => {
	const response = {};
	const diffValAttrKeys = Object.keys(diffValAttr);

	Object.entries(obj).forEach(([key, val]) => {
		const newKey = `${key}-hover`;
		const value = { ...obj[key] };

		if (diffValAttrKeys.includes(key)) value.default = diffValAttr[key];
		else if (!sameValAttr.includes(key) && 'default' in value)
			delete value.default;

		response[newKey] = value;
	});

	return { ...response, ...newAttr };
};

export default breakpointObjectCreator;
