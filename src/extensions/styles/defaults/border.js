import breakpointObjectCreator from '../breakpointObjectCreator';

const rawBorder = {
	'border-palette-color-status': {
		type: 'boolean',
		default: true,
	},
	'border-palette-color': {
		type: 'number',
		default: 2,
	},
	'border-palette-opacity': {
		type: 'number',
	},
	'border-color': {
		type: 'string',
	},
	'border-style': {
		type: 'string',
	},
};

const rawBorderWidth = {
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

const rawBorderRadius = {
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

export const border = breakpointObjectCreator({
	obj: rawBorder,
});
export const borderWidth = breakpointObjectCreator({
	obj: rawBorderWidth,
});
export const borderRadius = breakpointObjectCreator({
	obj: rawBorderRadius,
});
