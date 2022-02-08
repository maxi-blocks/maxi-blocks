import breakpointAttributesCreator from '../breakpointAttributesCreator';

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

const padding = breakpointAttributesCreator({
	obj: rawPadding,
});

export default padding;
