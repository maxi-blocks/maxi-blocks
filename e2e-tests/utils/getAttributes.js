import getBlockAttributes from './getBlockAttributes';
import parseLongAttrKey from '../../src/extensions/styles/dictionary/parseLongAttrKey';

const getAttributes = async target => {
	const attributes = await getBlockAttributes();

	if (typeof target === 'string') {
		const parsedTarget = parseLongAttrKey(target);

		return attributes[parsedTarget ?? target];
	}

	const response = {};

	target.forEach(key => {
		const parsedTarget = parseLongAttrKey(key);

		response[key] = attributes[parsedTarget ?? key];
	});

	return response;
};

export default getAttributes;
