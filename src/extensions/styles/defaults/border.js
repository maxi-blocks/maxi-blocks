import breakpointAttributesCreator from '@extensions/styles/breakpointAttributesCreator';
import paletteAttributesCreator from '@extensions/styles/paletteAttributesCreator';

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
		default: 'none',
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

export const border = breakpointAttributesCreator({
	obj: rawBorder,
});
export const borderWidth = breakpointAttributesCreator({
	obj: rawBorderWidth,
});
export const borderRadius = breakpointAttributesCreator({
	obj: rawBorderRadius,
});
