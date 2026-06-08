import breakpointAttributesCreator from '@extensions/styles/breakpointAttributesCreator';

const rawPadding = {
	'padding-top': {
		type: 'string',
	},
	'padding-right': {
		type: 'string',
	},
	'padding-bottom': {
		type: 'string',
	},
	'padding-left': {
		type: 'string',
	},
	'padding-top-unit': {
		type: 'string',
		default: 'px',
	},
	'padding-right-unit': {
		type: 'string',
		default: 'px',
	},
	'padding-bottom-unit': {
		type: 'string',
		default: 'px',
	},
	'padding-left-unit': {
		type: 'string',
		default: 'px',
	},
	'padding-sync': {
		type: 'string',
		default: 'all',
	},
	'padding-sync-vertical': {
		type: 'boolean',
		default: true,
	},
	'padding-sync-horizontal': {
		type: 'boolean',
		default: true,
	},
};

const padding = breakpointAttributesCreator({
	obj: rawPadding,
});

export default padding;
