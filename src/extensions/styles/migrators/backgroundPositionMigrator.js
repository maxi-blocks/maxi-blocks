// Pre-compute type mappings and position units to avoid repetitive string operations
const TYPE_MAP = { shape: 'svg' };
const POSITION_UNITS = ['top', 'left', 'bottom', 'right'].map(a => `position-${a}-unit-general`);

// Memoize type calculations
const getLayerType = layer => {
	const type = TYPE_MAP[layer.type] || layer.type;
	return type === 'svg' ? type : `${type}-wrapper`;
};

const isEligible = blockAttributes => {
	const layers = blockAttributes['background-layers'];
	if (!layers) return false;

	// Early exit if no layers
	for (let i = 0; i < layers.length; i++) {
		const type = getLayerType(layers[i]);
		const prefix = `background-${type}-`;

		for (const unit of POSITION_UNITS) {
			if (!(prefix + unit in layers[i])) return true;
		}
	}
	return false;
};

const migrate = newAttributes => {
	if (!newAttributes['background-layers']?.length) return newAttributes;

	const layers = newAttributes['background-layers'];

	// Avoid spread operator for better performance
	const response = Object.assign({}, newAttributes);

	for (let i = 0; i < layers.length; i++) {
		const type = getLayerType(layers[i]);
		const prefix = `background-${type}-`;

		for (const unit of POSITION_UNITS) {
			if (!(prefix + unit in layers[i])) {
				layers[i][prefix + unit] = 'px';
			}
		}
	}

	return response;
};

export default { name: 'Background Position', isEligible, migrate };
