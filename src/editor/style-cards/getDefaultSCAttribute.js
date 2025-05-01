import { isEmpty, isNil, isString } from 'lodash';

const getDefaultSCAttribute = (SC, attr, type) => {
	if (!isEmpty(SC)) {
		const defaultValue = SC.defaultStyleCard?.[type]?.[attr];
		if (!isNil(defaultValue)) {
			if (isString(defaultValue) && defaultValue.includes('var')) {
				const colorNumber = defaultValue.match(/color-(\d+)/)?.[1];
				const colorValue = SC.defaultStyleCard.color[colorNumber];
				if (!isNil(colorValue)) return colorValue;
			} else return defaultValue;
		}
	}

	return null;
};

export default getDefaultSCAttribute;
