const getPrefixedAttributes = (attr, prefix) => {
	const response = {};

	Object.entries(attr).forEach(([key, val]) => {
		const newKey = `${prefix}${key}`;

		response[newKey] = val;
	});

	return response;
};
export default getPrefixedAttributes;
