/**
 * Internal dependencies
 */
import { getDefaultAttribute } from '../../styles';

/**
 * External dependencies
 */
import { omitBy } from 'lodash';

const getListTypographyAttributes = (listContext, rawTypography) => ({
	...listContext,
	...omitBy(rawTypography, (value, key) =>
		key.includes('palette')
			? value === getDefaultAttribute(key)
			: value === undefined
	),
});

export default getListTypographyAttributes;
