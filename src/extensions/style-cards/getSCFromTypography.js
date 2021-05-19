/**
 * External dependencies
 */
import { isNil, isEmpty, isNumber } from 'lodash';

const getSCFromTypography = (styleCards, SCStyle, typographyObj) => {
	const parsedTypography = {};

	Object.entries(typographyObj).forEach(([key, val]) => {
		if (isEmpty(val) && !isNumber(val)) {
			if (!key.includes('-unit'))
				parsedTypography[key] =
					styleCards.styleCardDefaults[SCStyle][key];

			return;
		}

		if (
			key.includes('font-size') ||
			key.includes('line-height') ||
			key.includes('letter-spacing')
		) {
			const isUnit = key.includes('-unit');
			if (isUnit) {
				const newKey = key.replace(/-unit/g, '');
				if (!isNil(typographyObj[newKey]) && !isEmpty(val))
					parsedTypography[newKey] = typographyObj[newKey] + val;
			}
		}
		if (!key.includes('-unit')) parsedTypography[key] = val;
	});
	return parsedTypography;
};

export default getSCFromTypography;
