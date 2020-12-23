/**
 * Styles resolver
 */
const styleResolver = (styles, remover = false) => {
	const response = (remover && []) || {};

	Object.entries(styles).forEach(([target, props]) => {
		if (!remover) response[target] = props;
		if (remover) response.push(target);
	});

	return response;
};

export default styleResolver;
