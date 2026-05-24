export const normalizePlacementSync = value => {
	if (value === true) return 'all';
	if (value === false) return 'none';

	return value;
};

export const hasPlacementValue = value =>
	value !== null &&
	value !== undefined &&
	value !== '' &&
	value !== false;

export const hasPositionResetValue = value =>
	value !== null && value !== undefined && value !== false;

export const getLayerPlacementAllowedUnits = disablePosition =>
	disablePosition ? ['%'] : ['px', 'em', 'vw', '%', '-'];

export const shouldUseFocalPlacementControls = disablePosition =>
	disablePosition === true;

export const getLayerPlacementResetValue = ({
	target,
	disablePosition,
	isHover,
	normalValue,
	defaultValue,
}) => {
	const hasNormalResetValue =
		target === 'position-sync'
			? normalValue !== null && normalValue !== undefined
			: hasPositionResetValue(normalValue);
	const value =
		disablePosition && isHover && hasNormalResetValue
			? normalValue
			: defaultValue;

	return target === 'position-sync' ? normalizePlacementSync(value) : value;
};
