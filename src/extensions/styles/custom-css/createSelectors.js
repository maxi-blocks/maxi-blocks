const PSEUDO_ELEMENTS = ['before', 'after'];

const createSelectors = (rawSelectors, addPseudoElementSelectors = true) => {
	const getNormalAndHoverSelectors = ({ label, target }) => {
		const pseudoElement = PSEUDO_ELEMENTS.find(pseudo =>
			label.includes(pseudo)
		);
		const targetWithoutPseudoElement = target.replace(
			`::${pseudoElement}`,
			''
		);

		return {
			normal: {
				label,
				target,
			},
			hover: {
				label: `${label} on hover`,
				target: `${targetWithoutPseudoElement}:hover${
					pseudoElement ? `::${pseudoElement}` : ''
				}`,
			},
			...(targetWithoutPseudoElement !== '' && {
				'canvas hover': {
					label: `${label} on canvas hover`,
					target: `:hover ${targetWithoutPseudoElement.trim()}${
						pseudoElement ? `::${pseudoElement}` : ''
					}`,
				},
			}),
		};
	};

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
		PSEUDO_ELEMENTS.forEach(pseudoElement => {
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
