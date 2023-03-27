import parseLongAttrKey from './parseLongAttrKey';
import parseShortAttrKey from './parseShortAttrKey';

const blockAttributesShorter = attributes => {
	const newAttributes = {};

	Object.entries(attributes).forEach(([objKey, objVal]) => {
		const newKey = parseLongAttrKey(objKey);
		const longKey = parseShortAttrKey(newKey);

		newAttributes[newKey] = { ...objVal, longLabel: longKey };
	});

	return newAttributes;
};

export default blockAttributesShorter;
