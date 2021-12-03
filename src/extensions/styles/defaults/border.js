import breakpointObjectCreator from '../breakpointObjectCreator';

const rawBorder = {
	'border-palette-color-status-general': {
		type: 'boolean',
		default: true,
	},
	'border-palette-color-general': {
		type: 'number',
		default: 2,
	},
	'border-palette-opacity-general': {
		type: 'number',
	},
	'border-color-general': {
		type: 'string',
	},
	'border-style-general': {
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
	'border-top-left-radius-general': {
		type: 'number',
	},
	'border-top-right-radius-general': {
		type: 'number',
	},
	'border-bottom-right-radius-general': {
		type: 'number',
	},
	'border-bottom-left-radius-general': {
		type: 'number',
	},
	'border-sync-radius-general': {
		type: 'string',
		default: 'all',
	},
	'border-unit-radius-general': {
		type: 'string',
		default: 'px',
	},
};

export const border = breakpointObjectCreator({
	obj: rawBorder
});
export const borderWidth = breakpointObjectCreator({
	obj: rawBorderWidth
});
export const borderRadius = breakpointObjectCreator({
	obj: rawBorderRadius
});