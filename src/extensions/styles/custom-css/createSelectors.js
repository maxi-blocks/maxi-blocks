const createSelectors = (rawSelectors, addPseudoElementSelectors = true) => {
	const getNormalAndHoverSelectors = ({ label, target }) => ({
		normal: {
			label,
			target,
		},
		hover: {
			label: `${label} on hover`,
			target: `${target}:hover`,
		},
	});

	const addPseudoElementSelector = (
		key,
		{ target, label },
		pseudoElement,
		obj
	) => {
		obj[`${pseudoElement} ${key}`] = {
			label: `${label} ::${pseudoElement}`,
			target: `${target}::${pseudoElement}`,
		};
	};

	const selectors = Object.entries(rawSelectors).reduce(
		(acc, [label, target]) => {
			acc[label] = {
				label,
				target,
			};
			return acc;
		},
		{}
	);

	const result = { ...selectors };

	if (addPseudoElementSelectors)
		['before', 'after'].forEach(pseudoElement => {
			Object.entries(selectors).forEach(([key, selector]) =>
				addPseudoElementSelector(key, selector, pseudoElement, result)
			);
		});

	Object.entries(result).forEach(([key, selector]) => {
		result[key] = getNormalAndHoverSelectors(selector);
	});

	return result;
};

export default createSelectors;
