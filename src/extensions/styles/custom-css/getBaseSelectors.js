const getBaseSelectors = selectors =>
	Object.fromEntries(
		Object.entries(selectors).map(([label, target]) => [
			label,
			{ label, target },
		])
	);

export default getBaseSelectors;
