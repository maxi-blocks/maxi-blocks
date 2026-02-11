const editAdvancedNumberControl = async ({
	page,
	instance,
	newNumber,
	newValue,
}) => {
	const input = instance.locator(
		'input[type="number"].maxi-advanced-number-control__value'
	);

	await input.fill(String(newNumber));

	if (newValue) {
		const selector = instance.locator('select');
		await selector.selectOption(newValue);
	}
};

export default editAdvancedNumberControl;
