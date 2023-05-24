/**
 * Internal dependencies
 */
import getCleanKey from './getCleanKey';

const getPrefix = prefix => {
	if (prefix === '' || !prefix) return '';

	if (prefix.endsWith('-')) return prefix;

	return `${prefix}-`;
};

const getAttributeKey = ({
	key = '',
	isHover = false,
	prefix = '',
	breakpoint = false,
}) =>
	getCleanKey(
		`${getPrefix(prefix)}${`${key}${breakpoint ? `-${breakpoint}` : ''}${
			isHover ? '.h' : ''
		}`}`
	);

export default getAttributeKey;
