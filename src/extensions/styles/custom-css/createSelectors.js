import getPseudoElementSelectors from './getPseudoElementSelectors';
import getNormalAndHoverSelectors from './getNormalAndHoverSelectors';
import getBaseSelectors from './getBaseSelectors';

const createSelectors = (
	rawSelectors,
	addPseudoElementSelectors = true,
	addOnlyPseudoElementSelectors = false
) => {
	const baseSelectors = getBaseSelectors(rawSelectors);

	const getExtendedSelectors = () => {
		if (addOnlyPseudoElementSelectors) {
			return getPseudoElementSelectors(baseSelectors);
		}

		if (addPseudoElementSelectors) {
			return {
				...baseSelectors,
				...getPseudoElementSelectors(baseSelectors),
			};
		}

		return baseSelectors;
	};
	const extendedSelectors = getExtendedSelectors();

	return Object.fromEntries(
		Object.entries(extendedSelectors).map(([key, selector]) => [
			key,
			getNormalAndHoverSelectors(selector),
		])
	);
};

export default createSelectors;
