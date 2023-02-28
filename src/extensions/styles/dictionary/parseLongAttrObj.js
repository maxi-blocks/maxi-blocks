import parseLongAttrKey from './parseLongAttrKey';

const parseLongAttrObj = obj => {
	const result = {};

	Object.entries(obj).forEach(([key, val]) => {
		result[parseLongAttrKey(key)] = val;
	});

	return result;
};

export default parseLongAttrObj;
