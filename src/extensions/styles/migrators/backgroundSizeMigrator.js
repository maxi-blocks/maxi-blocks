// Constants
const NAME = 'Background Size';
const SIZE_PATTERN = /size/;
const WIDTH_REPLACEMENT = 'width';

const isEligible = blockAttributes => {
	const layers = blockAttributes['background-layers'];
	if (!layers) return false;

	// Use for...of for better performance with break capability
	for (const layer of layers) {
		for (const key of Object.keys(layer)) {
			if (key.includes('wrapper-size') || key.includes('svg-size')) {
				return true;
			}
		}
	}
	return false;
};

const migrate = newAttributes => {
	const layers = newAttributes['background-layers'];
	if (!layers) return newAttributes;

	// Use for...of for better performance
	for (let i = 0; i < layers.length; i++) {
		const layer = layers[i];
		const entries = Object.entries(layer);

		for (const [key, value] of entries) {
			if (key.includes('wrapper-size') || key.includes('svg-size')) {
				// Create new key once
				const newKey = key.replace(SIZE_PATTERN, WIDTH_REPLACEMENT);
				layers[i][newKey] = value;
				delete layers[i][key];
			}
		}
	}

	return newAttributes;
};

export default { name: NAME, isEligible, migrate };
