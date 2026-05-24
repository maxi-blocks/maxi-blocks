export const NUMBER_COUNTER_ANIMATION_SCALE = 360 / 100;

export const getNumberCounterAnimationValue = value =>
	Number(value) * NUMBER_COUNTER_ANIMATION_SCALE;

export const getNumberCounterValueFromAnimation = value =>
	Number(value) / NUMBER_COUNTER_ANIMATION_SCALE;

const getNumberCounterDisplayValue = value => {
	const numberValue = Number(value);

	if (!Number.isFinite(numberValue)) return `${value}`;

	const normalizedValue = parseFloat(numberValue.toFixed(10));

	return `${Object.is(normalizedValue, -0) ? 0 : normalizedValue}`;
};

export default getNumberCounterDisplayValue;
