import getCleanKey from './getCleanKey';

const prefixAttributesCreator = ({
	obj,
	prefix,
	longPrefix,
	diffValAttr = {},
	newAttr = {},
	exclAttr = [],
}) => {
	const response = {};
	const diffValAttrKeys = Object.keys(diffValAttr);

	Object.entries(obj).forEach(([key, val]) => {
		if (exclAttr.every(excl => !key.includes(excl))) {
			const newKey = getCleanKey(`${prefix}${key}`);

			if (diffValAttrKeys.includes(newKey))
				response[newKey] = {
					...val,
					default: diffValAttr[newKey],
					longLabel: `${longPrefix}${val.longLabel}`,
				};
			else
				response[newKey] = {
					...val,
					longLabel: `${longPrefix}${val.longLabel}`,
				};
		}
	});

	return { ...response, ...newAttr };
};

export default prefixAttributesCreator;
