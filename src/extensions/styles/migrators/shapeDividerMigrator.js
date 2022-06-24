/**
 * Internal dependencies
 */
import paletteAttributesCreator from '../paletteAttributesCreator';

const attributes = {
	'shape-divider-top-height': {
		type: 'number',
		default: 100,
	},
	'shape-divider-top-height-unit': {
		type: 'string',
		default: 'px',
	},
	'shape-divider-bottom-height': {
		type: 'number',
		default: 100,
	},
	'shape-divider-bottom-height-unit': {
		type: 'string',
		default: 'px',
	},
	...paletteAttributesCreator({ prefix: 'shape-divider-top-', palette: 5 }),
	...paletteAttributesCreator({
		prefix: 'shape-divider-bottom-',
		palette: 5,
	}),
	'shape-divider-top-opacity': {
		type: 'number',
		default: 1,
	},
	'shape-divider-bottom-opacity': {
		type: 'number',
		default: 1,
	},
};

const migrate = newAttributes => {
	Object.entries(newAttributes).forEach(([key, attr]) => {
		if (key in attributes) {
			newAttributes[`${key}-general`] = attr;

			delete newAttributes[key];
		}
	});
};

const isEligible = blockAttributes =>
	Object.keys(blockAttributes).some(
		key =>
			key in attributes &&
			blockAttributes[key] !== attributes[key].default
	);

export { attributes, migrate, isEligible };
