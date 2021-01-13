/**
 * WordPress dependencies
 */
const { dispatch } = wp.data;

/**
 * Styles resolver
 */
const styleResolver = (styles, remover = false, breakpoints) => {
	if (!styles) return {};

	const response = (remover && []) || {};

	Object.entries(styles).forEach(([target, props]) => {
		if (!remover) {
			if (!response[target])
				response[target] = {
					breakpoints,
					content: {},
				};
			response[target].content = props;
		}
		if (remover) response.push(target);
	});

	if (!remover) dispatch('maxiBlocks/styles').updateStyles(response);
	else dispatch('maxiBlocks/styles').removeStyles(response);

	return response;
};

export default styleResolver;
