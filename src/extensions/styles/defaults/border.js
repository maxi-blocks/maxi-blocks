import breakpointAttributesCreator from '../breakpointAttributesCreator';
import attributesShorter from '../dictionary/attributesShorter';
import paletteAttributesCreator from '../paletteAttributesCreator';

const prefix = 'border-';

export const rawBorder = {
	...paletteAttributesCreator({ prefix, palette: 2 }),
	'border-style': {
		type: 'string',
		default: 'none',
	},
};

export const rawBorderWidth = {
	'border-top-width': {
		type: 'number',
		default: 2,
	},
	'border-right-width': {
		type: 'number',
		default: 2,
	},
	'border-bottom-width': {
		type: 'number',
		default: 2,
	},
	'border-left-width': {
		type: 'number',
		default: 2,
	},
	'border-sync-width': {
		type: 'string',
		default: 'all',
	},
	'border-unit-width': {
		type: 'string',
		default: 'px',
	},
};

export const rawBorderRadius = {
	'border-top-left-radius': {
		type: 'number',
	},
	'border-top-right-radius': {
		type: 'number',
	},
	'border-bottom-right-radius': {
		type: 'number',
	},
	'border-bottom-left-radius': {
		type: 'number',
	},
	'border-sync-radius': {
		type: 'string',
		default: 'all',
	},
	'border-unit-radius': {
		type: 'string',
		default: 'px',
	},
};

export const border = attributesShorter(
	breakpointAttributesCreator({
		obj: rawBorder,
	}),
	'border'
);
export const borderWidth = attributesShorter(
	breakpointAttributesCreator({
		obj: rawBorderWidth,
	}),
	'border'
);
export const borderRadius = attributesShorter(
	breakpointAttributesCreator({
		obj: rawBorderRadius,
	}),
	'border'
);
