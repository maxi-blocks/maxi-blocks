/**
 * External dependencies
 */
import { isNil, isEmpty } from 'lodash';

const getStyleCards = sc => {
	if (!isNil(sc)) {
		switch (typeof sc) {
			case 'string':
				if (!isEmpty(sc)) return JSON.parse(sc);
				return false;
			case 'object':
				return sc;
			case 'undefined':
				return false;
			default:
				return false;
		}
	}
	return false;
};

export default getStyleCards;
