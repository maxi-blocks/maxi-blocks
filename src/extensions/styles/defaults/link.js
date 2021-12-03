import breakpointObjectCreator from '../breakpointObjectCreator';

const rawLink = {
	'link-palette-color-status': {
		type: 'boolean',
		default: true,
	},
	'link-palette-color': {
		type: 'number',
		default: 4,
	},
	'link-palette-opacity': {
		type: 'number',
	},
	'link-color': {
		type: 'string',
	},
	'link-hover-palette-color-status': {
		type: 'boolean',
		default: true,
	},
	'link-hover-palette-color': {
		type: 'number',
		default: 6,
	},
	'link-hover-palette-opacity': {
		type: 'number',
	},
	'link-hover-color': {
		type: 'string',
	},
	'link-active-palette-color-status': {
		type: 'boolean',
		default: true,
	},
	'link-active-palette-color': {
		type: 'number',
		default: 6,
	},
	'link-active-palette-opacity': {
		type: 'number',
	},
	'link-active-color': {
		type: 'string',
	},
	'link-visited-palette-color-status': {
		type: 'boolean',
		default: true,
	},
	'link-visited-palette-color': {
		type: 'number',
		default: 6,
	},
	'link-visited-palette-opacity': {
		type: 'number',
	},
	'link-visited-color': {
		type: 'string',
	},
};

const link = breakpointObjectCreator({
	obj: rawLink,
	addBreakpoint: true,
});

export default link;
