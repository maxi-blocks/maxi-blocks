import breakpointAttributesCreator from '@extensions/styles/breakpointAttributesCreator';

// Constants
const NAME = 'full-width Attribute';
const VERSIONS = new Set([
	'0.0.1-SC1',
	'0.0.1-SC2',
	'0.0.1-SC3',
	'0.0.1-SC4',
	'0.0.1-SC5',
	'0.0.1-SC6',
	'1.0.0-RC1',
	'1.0.0-RC2',
	'1.0.0-beta',
	'1.0.0-beta-2',
	'wp-directory-beta-1',
	'1.0.0',
	'1.0.1',
	'1.1.0',
	'1.1.1',
]);

// Pre-compute prefixes array
const PREFIXES = Object.freeze(['', 'button-', 'image-', 'video-']);

// Pre-define attribute template
const ATTRIBUTE_TEMPLATE = {
	type: 'string',
	default: 'normal',
};

const attributes = () => {
	const result = breakpointAttributesCreator({
		obj: { 'full-width': ATTRIBUTE_TEMPLATE },
	});

	// Use for loop for better performance
	for (let i = 0; i < PREFIXES.length; i++) {
		Object.assign(result, breakpointAttributesCreator({
			obj: {
				[`${PREFIXES[i]}full-width`]: ATTRIBUTE_TEMPLATE,
			},
		}));
	}

	return result;
};

const isEligible = blockAttributes => {
	const {
		'maxi-version-origin': maxiVersionOrigin,
		'maxi-version-current': maxiVersionCurrent,
	} = blockAttributes;

	// Early return if version check fails
	if (!(!maxiVersionOrigin || VERSIONS.has(maxiVersionCurrent))) {
		return false;
	}

	// Use for...of for better performance with break capability
	for (const [key, value] of Object.entries(blockAttributes)) {
		if (key.includes('full-width') && typeof value === 'string') {
			return true;
		}
	}
	return false;
};

const migrate = newAttributes => {
	// Use for...of for better performance
	for (const [key, value] of Object.entries(newAttributes)) {
		if (key.includes('full-width') && typeof value === 'string') {
			newAttributes[key] = value === 'full';
		}
	}

	return newAttributes;
};

export default { name: NAME, isEligible, migrate, attributes };
