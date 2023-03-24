import parseLongAttrKey from './parseLongAttrKey';

const parseLongAttrArray = array => {
	const result = [];

	array.forEach(key => {
		result.push(parseLongAttrKey(key));
	});

	return result;
};

export default parseLongAttrArray;
