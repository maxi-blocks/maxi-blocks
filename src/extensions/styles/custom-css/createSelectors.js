const createSelectors = selectors => {
	const getNormalAndHoverSelectors = obj => {
		const { label, target } = obj;

		return {
			normal: obj,
			hover: {
				label: `${label} on hover`,
				target: `${target}:hover`,
			},
		};
	};

	const addPseudoElementSelector = (key, selector, pseudoElement, obj) => {
		const { label, target } = selector;

		obj[`${pseudoElement} ${key}`] = {
			label: `${label} ::${pseudoElement}`,
			target: `${target}::${pseudoElement}`,
		};
	};

	const result = { ...selectors };

	['before', 'after'].forEach(pseudoElement => {
		Object.entries(selectors).forEach(([key, selector]) => {
			addPseudoElementSelector(key, selector, pseudoElement, result);
		});
	});

	Object.entries(result).forEach(([key, obj]) => {
		result[key] = getNormalAndHoverSelectors(obj);
	});
	console.log(result);
	return result;
};

export default createSelectors;
