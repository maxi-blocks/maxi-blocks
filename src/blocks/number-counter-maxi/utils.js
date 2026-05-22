const getNumberCounterDisplayValue = value => {
	const numberValue = Number(value);

	if (!Number.isFinite(numberValue)) return `${value}`;

	const normalizedValue = parseFloat(numberValue.toFixed(10));

	return `${Object.is(normalizedValue, -0) ? 0 : normalizedValue}`;
};

export default getNumberCounterDisplayValue;
