const setTransitionToSelectors = (selectors, transitionStyles) => {
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
