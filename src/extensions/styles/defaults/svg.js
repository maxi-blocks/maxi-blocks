import breakpointObjectCreator from '../breakpointObjectCreator';

const rawSvg = {
	'svg-palette-fill-color-status': {
		type: 'boolean',
		default: true,
	},
	'svg-palette-fill-color': {
		type: 'number',
		default: 4,
	},
	'svg-palette-fill-opacity': {
		type: 'number',
	},
	'svg-fill-color': {
		type: 'string',
	},
	'svg-palette-line-color-status': {
		type: 'boolean',
		default: true,
	},
	'svg-palette-line-color': {
		type: 'number',
		default: 7,
	},
	'svg-palette-line-opacity': {
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
		'svg-palette-fill-color-status',
		'svg-palette-fill-color',
		'svg-palette-fill-opacity',
		'svg-fill-color',
		'svg-palette-line-color-status',
		'svg-palette-line-color',
		'svg-palette-line-opacity',
		'svg-line-color',
	],
});

export default svg;
