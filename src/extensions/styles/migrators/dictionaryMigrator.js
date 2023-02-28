import { noTypeDictionary } from '../dictionary/attributesDictionary';
import parseLongAttrObj from '../dictionary/parseLongAttrObj';

const name = 'Dictionary migrator';

const isEligible = blockAttributes => {
	const oldLongAttributes = Object.keys(noTypeDictionary);

	return Object.keys(blockAttributes).some(key =>
		oldLongAttributes.includes(key)
	);
};

const migrate = newAttributes => {
	const parsedAttributes = parseLongAttrObj(newAttributes);

	return parsedAttributes;
};

export default { name, isEligible, migrate };
