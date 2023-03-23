import parseLongAttrKey from './parseLongAttrKey';

const attributesShorter = (obj, type) => {
	const result = {};

	Object.entries(obj).forEach(([key, val]) => {
		result[parseLongAttrKey(key)] = { ...val, originalName: key };
	});

	return result;
};

export default attributesShorter;
