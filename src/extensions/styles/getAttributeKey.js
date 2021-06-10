const getAttributeKey = (key, isHover = false, prefix = false) => {
	const newKey = !prefix ? key : `${prefix}${key}`;

	if (!isHover) return newKey;
	return `${newKey}-hover`;
};

export default getAttributeKey;
