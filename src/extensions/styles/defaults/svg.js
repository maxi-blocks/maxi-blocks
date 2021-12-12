import breakpointObjectCreator from '../breakpointObjectCreator';

const rawSvg = {
	'svg-fill-palette-status': {
		type: 'boolean',
		default: true,
	},
	'svg-fill-palette-color': {
		type: 'number',
		default: 4,
	},
	'svg-fill-palette-opacity': {
		type: 'number',
	},
	'svg-fill-color': {
		type: 'string',
	},
	'svg-line-palette-status': {
		type: 'boolean',
		default: true,
	},
	'svg-line-palette-color': {
		type: 'number',
		default: 7,
	},
	'svg-line-palette-opacity': {
		type: 'number',
	},
	'svg-line-color': {
		type: 'string',
	},
	'svg-stroke': {
		type: 'number',
		default: 2,
	},
	'svg-width': {
		type: 'number',
		default: 64,
	},
	'svg-width-unit': {
		type: 'string',
		default: 'px',
	},
	'svg-responsive': {
		type: 'boolean',
		default: true,
	},
};

const svg = breakpointObjectCreator({
	obj: rawSvg,
	noBreakpointAttr: [
		'svg-fill-palette-status',
		'svg-fill-palette-color',
		'svg-fill-palette-opacity',
		'svg-fill-color',
		'svg-line-palette-status',
		'svg-line-palette-color',
		'svg-line-palette-opacity',
		'svg-line-color',
	],
});

export default svg;
