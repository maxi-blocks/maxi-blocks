/**
 * Internal dependencies
 */
import paletteAttributesCreator from '@extensions/styles/paletteAttributesCreator';

// Constants
const NAME = 'Shape Divider';
const POSITIONS = Object.freeze(['top', 'bottom']);
const PALETTE_SIZE = 5;

// Pre-define attribute templates for better performance
const createHeightAttribute = () => ({
	type: 'number',
	default: 100,
});

const createHeightUnitAttribute = () => ({
	type: 'string',
	default: 'px',
});

const createOpacityAttribute = () => ({
	type: 'number',
	default: 1,
});

const attributes = () => {
	const result = {};


	for (let i = 0; i < POSITIONS.length; i++) {
		const position = POSITIONS[i];
		const prefix = `shape-divider-${position}-`;

		result[`${prefix}height`] = createHeightAttribute();
		result[`${prefix}height-unit`] = createHeightUnitAttribute();
		result[`${prefix}opacity`] = createOpacityAttribute();

		// Add palette attributes
		Object.assign(result, paletteAttributesCreator({
			prefix,
			palette: PALETTE_SIZE
		}));
	}

	return result;
};

const isEligible = blockAttributes => {
	const deprecatedAttributes = attributes();


	for (const [key, attr] of Object.entries(blockAttributes)) {
		if (key in deprecatedAttributes &&
			attr !== deprecatedAttributes[key].default) {
			return true;
		}
	}
	return false;
};

const migrate = newAttributes => {

	for (const [key, attr] of Object.entries(newAttributes)) {
		if (key in attributes()) {
			// Direct property mutations for better performance
			newAttributes[`${key}-general`] = attr;
			delete newAttributes[key];
		}
	}

	return newAttributes;
};

export default { name: NAME, isEligible, attributes, migrate };
