import breakpointAttributesCreator from '../breakpointAttributesCreator';

const rawPadding = {
	'p.t': {
		type: 'string',
		longLabel: 'padding-top',
	},
	'p.r': {
		type: 'string',
		longLabel: 'padding-right',
	},
	'p.b': {
		type: 'string',
		longLabel: 'padding-bottom',
	},
	'p.l': {
		type: 'string',
		longLabel: 'padding-left',
	},
	'p.t.u': {
		type: 'string',
		default: 'px',
		longLabel: 'padding-top-unit',
	},
	'p.r.u': {
		type: 'string',
		default: 'px',
		longLabel: 'padding-right-unit',
	},
	'p.b.u': {
		type: 'string',
		default: 'px',
		longLabel: 'padding-bottom-unit',
	},
	'p.l.u': {
		type: 'string',
		default: 'px',
		longLabel: 'padding-left-unit',
	},
	'p.sy': {
		type: 'string',
		default: 'all',
		longLabel: 'padding-sync',
	},
};

const padding = breakpointAttributesCreator({
	obj: rawPadding,
});

export default padding;
