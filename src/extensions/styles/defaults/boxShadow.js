import breakpointObjectCreator from '../breakpointObjectCreator';

const rawBoxShadow = {
	'box-shadow-palette-color-status': {
		type: 'boolean',
		default: true,
	},
	'box-shadow-palette-color': {
		type: 'number',
		default: 8,
	},
	'box-shadow-palette-opacity': {
		type: 'number',
	},
	'box-shadow-color': {
		type: 'string',
	},
	'box-shadow-horizontal': {
		type: 'number',
	},
	'box-shadow-vertical': {
		type: 'number',
	},
	'box-shadow-blur': {
		type: 'number',
	},
	'box-shadow-spread': {
		type: 'number',
	},
};
const boxShadow = breakpointObjectCreator({
	obj: rawBoxShadow
});

export default boxShadow;
