/**
 * External dependencies
 */
import { omitBy } from 'lodash';

const getListTypographyAttributes = (listContext, rawTypography) => ({
	...listContext,
	...omitBy(rawTypography, (value, _key) => value === undefined),
});

export default getListTypographyAttributes;
