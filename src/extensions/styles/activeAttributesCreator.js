/**
 * Creates active state attributes by prefixing with 'active-' and removing defaults
 * so values inherit from normal state via getLastBreakpointAttribute fallback.
 * Similar to hoverAttributesCreator but for active state.
 */

const activeAttributesCreator = ({
	obj,
	sameValAttr = [],
	diffValAttr = {},
	newAttr = {},
}) => {
	const response = {};
	const diffValAttrKeys = Object.keys(diffValAttr);

	Object.entries(obj).forEach(([key, val]) => {
		const newKey = `active-${key}`;
		const value = { ...val };

		if (diffValAttrKeys.includes(newKey)) value.default = diffValAttr[newKey];
		else if (
			!sameValAttr.includes(key) &&
			'default' in value &&
			!newKey.includes('palette-sc-status') // Need to keep the default value for this one
		)
			delete value.default;

		response[newKey] = value;
	});

	return { ...response, ...newAttr };
};

export default activeAttributesCreator;
