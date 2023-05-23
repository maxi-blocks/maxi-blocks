import parseShortAttrKey from './parseShortAttrKey';
import parseLongAttrKey from './parseLongAttrKey';

const blockAttributesShorter = attributes => {
	const newAttributes = {};

	Object.entries(attributes).forEach(([objKey, objVal]) => {
		const longKey = parseShortAttrKey(objKey);
		const newKey = parseLongAttrKey(longKey);

		newAttributes[newKey] = { ...objVal, longLabel: longKey };
	});

	return newAttributes;
};

export default blockAttributesShorter;
