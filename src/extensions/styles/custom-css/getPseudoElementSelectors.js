import PSEUDO_ELEMENTS from './constants';

const getPseudoElementSelectors = selectors => {
	return PSEUDO_ELEMENTS.reduce((acc, pseudoElement) => {
		Object.entries(selectors).forEach(([key, selector]) => {
			acc[`${pseudoElement} ${key}`] = {
				label: `${selector.label} ::${pseudoElement}`,
				target: `${selector.target}::${pseudoElement}`,
			};
		});
		return acc;
	}, {});
};

export default getPseudoElementSelectors;
