const getAttributeKey = (key, isHover = false, prefix = null) => {
	const newKey = !prefix ? key : `${prefix}${key}`;

	if (!isHover) return newKey;
	return newKey.replace('background-', 'background-hover-');
};

export default getAttributeKey;
