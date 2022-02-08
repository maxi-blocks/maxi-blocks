const getAttributeKey = (
	key,
	isHover = false,
	prefix = false,
	breakpoint = false
) =>
	`${prefix || ''}${key}${breakpoint ? `-${breakpoint}` : ''}${
		isHover ? '-hover' : ''
	}`;

export default getAttributeKey;
