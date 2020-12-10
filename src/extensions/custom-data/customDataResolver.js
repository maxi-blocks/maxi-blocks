const styleResolver = (styles, breakpoints, remover = false) => {
	const response = (remover && []) || {};

	for (const [target, props] of Object.entries(styles)) {
		if (!remover) response[target] = objectManipulator(props, breakpoints);
		if (remover) response.push(target);
	}

	if (!remover) dispatch('maxiBlocks/styles').updateStyles(response);
	else dispatch('maxiBlocks/styles').removeStyles(response);

	return response;
};
