import { getSelectorKeyLongLabel } from '../dictionary/objectKeyParsers';

const PSEUDO_ELEMENTS = ['b', 'a'];

const createSelectors = (rawSelectors, addPseudoElementSelectors = true) => {
	const getNormalAndHoverSelectors = ({ label, target }) => {
		const pseudoElement = PSEUDO_ELEMENTS.find(pseudo =>
			label.includes(getSelectorKeyLongLabel(pseudo))
		);
		const targetWithoutPseudoElement = target.replace(
			`::${getSelectorKeyLongLabel(pseudoElement)}`,
			''
		);

		return {
			n: {
				label,
				target,
			},
			h: {
				label: `${label} on hover`,
				target: `${targetWithoutPseudoElement}:hover${
					pseudoElement
						? `::${getSelectorKeyLongLabel(pseudoElement)}`
						: ''
				}`,
			},
		};
	};

	const addPseudoElementSelector = (
		key,
		{ target, label },
		pseudoElement,
		obj
	) => {
		obj[`${pseudoElement} ${key}`] = {
			label: `${label} ::${getSelectorKeyLongLabel(pseudoElement)}`,
			target: `${target}::${getSelectorKeyLongLabel(pseudoElement)}`,
		};
	};

	const selectors = Object.entries(rawSelectors).reduce(
		(acc, [label, target]) => {
			acc[label] = {
				label: getSelectorKeyLongLabel(label),
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
