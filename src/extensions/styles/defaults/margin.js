import breakpointObjectCreator from '../breakpointObjectCreator';

const rawMargin = {
	'margin-top': {
		type: 'string',
	},
	'margin-right': {
		type: 'string',
	},
	'margin-bottom': {
		type: 'string',
	},
	'margin-left': {
		type: 'string',
	},
	'margin-sync': {
		type: 'string',
		default: 'all',
	},
	'margin-unit': {
		type: 'string',
		default: 'px',
	},
};

const margin = breakpointObjectCreator({
	obj: rawMargin,
});

export default margin;
