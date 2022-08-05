const checkIndicator = async (element, on = true) => {
	const elementArray = element.length ? element : [element];

	const classes = await Promise.all(
		elementArray.map(async element =>
			(await element.getProperty('className')).jsonValue()
		)
	);

	return classes.every(className => {
		if (
			on
				? !className
						.split(' ')
						.includes('maxi-tabs-control__button--active')
				: className
						.split(' ')
						.includes('maxi-tabs-control__button--active')
		)
			return false;

		return true;
	});
};

export default checkIndicator;
