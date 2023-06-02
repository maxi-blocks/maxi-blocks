import { isNil } from 'lodash';
import { reversedSelectorKeys } from './attributesDictionary';

export const getSelectorKeyLongLabel = key => {
	if (isNil(key)) return key;

	const keys = key.split(' ');
	return keys.map(key => reversedSelectorKeys[key] || key).join(' ');
};
