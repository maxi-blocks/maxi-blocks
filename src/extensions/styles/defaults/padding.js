import breakpointObjectCreator from '../breakpointObjectCreator';

const rawPadding = {
	'padding-top': {
		type: 'number',
	},
	'padding-right': {
		type: 'number',
	},
	'padding-bottom': {
		type: 'number',
	},
	'padding-left': {
		type: 'number',
	},
	'padding-sync': {
		type: 'string',
		default: 'all',
	},
	'padding-unit': {
		type: 'string',
		default: 'px',
	},
};

const padding = breakpointObjectCreator({
	obj: rawPadding,
});

export default padding;
