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
	`${prefix || ''}${parseLongAttrKey(
		`${key}${breakpoint ? `-${breakpoint}` : ''}${isHover ? '-hover' : ''}`
	)}`;

export default getAttributeKey;
