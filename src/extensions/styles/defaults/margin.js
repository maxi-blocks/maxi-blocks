import breakpointAttributesCreator from '@extensions/styles/breakpointAttributesCreator';

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
		default: 'none',
	},
	'margin-top-unit': {
		type: 'string',
		default: 'px',
	},
	'margin-right-unit': {
		type: 'string',
		default: 'px',
	},
	'margin-bottom-unit': {
		type: 'string',
		default: 'px',
	},
	'margin-left-unit': {
		type: 'string',
		default: 'px',
	},
};

const margin = breakpointAttributesCreator({
	obj: rawMargin,
});

export default margin;
