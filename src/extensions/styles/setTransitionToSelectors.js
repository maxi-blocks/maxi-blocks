/**
 * Internal dependencies
 */
import { getTransitionStyles } from './helpers';
import getGroupAttributes from './getGroupAttributes';

const setTransitionToSelectors = (selectors, attributes) => {
	const transitionStyles = getTransitionStyles(
		getGroupAttributes(attributes, 'transition')
	);

	Object.entries(selectors).forEach(([selector, styles]) => {
		if (!selector.includes('hover'))
			selectors[selector] = {
				...styles,
				transition: transitionStyles,
			};
	});

	return selectors;
};

export default setTransitionToSelectors;
