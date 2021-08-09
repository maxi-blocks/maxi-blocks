const getAttributeValue = (target, props, isHover, prefix = '') =>
	props[`${prefix}${target}${isHover ? '-hover' : ''}`] ||
	props[`${prefix}${target}`];

export default getAttributeValue;
