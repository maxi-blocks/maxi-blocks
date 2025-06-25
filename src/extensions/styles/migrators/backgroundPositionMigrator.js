// Pre-compute type mappings and position units to avoid repetitive string operations
const TYPE_MAP = { shape: 'svg' };
const POSITION_UNITS = ['top', 'left', 'bottom', 'right'].map(
	a => `position-${a}-unit-general`
);

// Memoize type calculations
const getLayerType = layer => {
	const type = TYPE_MAP[layer.type] || layer.type;
	return type === 'svg' ? type : `${type}-wrapper`;
};

const isEligible = blockAttributes => {
	const layers = blockAttributes['background-layers'];
	if (!layers || !Array.isArray(layers)) return false;

	// Check each layer for missing position units
	return layers.some((layer, index) => {
		// Add defensive check to ensure layer is an object
		if (typeof layer !== 'object' || layer === null) {
			console.warn(
				'[BackgroundPositionMigrator] Skipping non-object layer:',
				{
					index,
					layerType: typeof layer,
					layerValue: layer,
				}
			);
			return false; // Skip this layer, don't consider it eligible
		}

		const type = getLayerType(layer);
		const prefix = `background-${type}-`;

		// Check if any position unit is missing
		return POSITION_UNITS.some(unit => !(prefix + unit in layer));
	});
};

const migrate = newAttributes => {
	if (!newAttributes['background-layers']?.length) return newAttributes;

	const layers = newAttributes['background-layers'];

	// Avoid spread operator for better performance
	const response = { ...newAttributes };

	// Use forEach instead of for loop to avoid increment operators
	layers.forEach((layer, index) => {
		// Add defensive check here too
		if (typeof layer !== 'object' || layer === null) {
			console.warn(
				'[BackgroundPositionMigrator] Skipping non-object layer in migrate:',
				{
					index,
					layerType: typeof layer,
					layerValue: layer,
				}
			);
			return; // Skip this layer
		}

		const type = getLayerType(layer);
		const prefix = `background-${type}-`;

		POSITION_UNITS.forEach(unit => {
			if (!(prefix + unit in layer)) {
				layer[prefix + unit] = 'px';
			}
		});
	});

	return response;
};

export default { name: 'Background Position', isEligible, migrate };
