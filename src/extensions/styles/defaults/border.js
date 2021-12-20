import breakpointAttributesCreator from '../breakpointAttributesCreator';
import paletteAttributesCreator from '../paletteAttributesCreator';

const prefix = 'border-';

export const rawBorder = {
	...paletteAttributesCreator({ prefix, palette: 2 }),
	'border-style': {
		type: 'string',
	},
};

export const rawBorderWidth = {
	'border-top-width': {
		type: 'number',
	},
	'border-right-width': {
		type: 'number',
	},
	'border-bottom-width': {
		type: 'number',
	},
	'border-left-width': {
		type: 'number',
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

export const border = breakpointAttributesCreator({
	obj: rawBorder,
});
export const borderWidth = breakpointAttributesCreator({
	obj: rawBorderWidth,
});
export const borderRadius = breakpointAttributesCreator({
	obj: rawBorderRadius,
});
