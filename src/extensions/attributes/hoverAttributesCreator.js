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
		let newKey = `${key}.h`;
		if (newKey.endsWith('.s.h')) newKey = newKey.replace('.s.h', '.sh');

		const value = { ...val };

		if (diffValAttrKeys.includes(key)) value.default = diffValAttr[key];
		else if (!sameValAttr.includes(key) && 'default' in value)
			delete value.default;

		response[newKey] = { ...value, longLabel: `${val.longLabel}-hover` };
	});

	return { ...response, ...newAttr };
};

export default hoverAttributesCreator;
