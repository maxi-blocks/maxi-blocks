// Constants
const NAME = 'Corrupted Hover Attributes';
const VALID_VERSIONS = new Set([
	'0.1',
	'0.0.1-SC1',
	'0.0.1-SC2',
	'0.0.1-SC3',
	'0.0.1-SC4',
]);

// Pre-compile patterns for faster lookup
const CORRUPTED_ATTRIBUTES = new Set([
	'border-status-hover',
	'box-shadow-status-hover',
	'background-status-hover',
	'svg-status-hover',
]);

const isEligible = blockAttributes => {
	const {
		'maxi-version-origin': maxiVersionOrigin,
		'maxi-version-current': maxiVersionCurrent,
	} = blockAttributes;

	// Early return if version check fails
	if (!(!maxiVersionOrigin || VALID_VERSIONS.has(maxiVersionCurrent))) {
		return false;
	}

	// Use for...of for better performance with break capability
	for (const [key, val] of Object.entries(blockAttributes)) {
		if (val) {
			for (const attrKey of CORRUPTED_ATTRIBUTES) {
				if (key.includes(attrKey)) return true;
			}
		}
	}
	return false;
};

const migrate = newAttributes => {
	// Use for...of for better performance
	for (const [key, val] of Object.entries(newAttributes)) {
		const hoverKey = `${key}-hover`;
		if (val === newAttributes[hoverKey]) {
			delete newAttributes[hoverKey];
		}
	}

	return newAttributes;
};

export default { name: NAME, isEligible, migrate };
