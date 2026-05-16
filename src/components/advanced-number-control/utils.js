const validateNumberInput = (event, regex = /[a-zA-Z]/) => {
	if (
		regex.test(event.key) &&
		event.key !== 'e' &&
		event.key.length === 1 &&
		!event.ctrlKey &&
		!event.altKey &&
		!event.metaKey
	)
		event.preventDefault();
};

export const clampNumberInputValue = (
	value,
	{ min, max, clampMin = true, clampMax = true } = {}
) => {
	if (value === '') return value;

	const numericValue = +value;

	if (Number.isNaN(numericValue)) return value;
	if (clampMax && max !== undefined && numericValue > max) return max;
	if (
		clampMin &&
		min !== undefined &&
		numericValue !== 0 &&
		numericValue < min
	)
		return min;

	return value;
};

export default validateNumberInput;
