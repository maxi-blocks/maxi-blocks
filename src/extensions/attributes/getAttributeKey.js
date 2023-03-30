/**
 * Internal dependencies
 */
import parseLongAttrKey from './dictionary/parseLongAttrKey';

const getAttributeKey = (
	key = '',
	isHover = false,
	prefix = false,
	breakpoint = false
) =>
	// parseLongAttrKey(
	`${prefix || ''}${`${key}${breakpoint ? `-${breakpoint}` : ''}${
		isHover ? '-hover' : ''
	}`}`;
// );

export default getAttributeKey;
