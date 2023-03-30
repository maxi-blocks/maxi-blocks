import breakpointAttributesCreator from '../breakpointAttributesCreator';

const rawPadding = {
	'_p.t': {
		type: 'string',
		longLabel: 'padding-top',
	},
	'_p.r': {
		type: 'string',
		longLabel: 'padding-right',
	},
	'_p.b': {
		type: 'string',
		longLabel: 'padding-bottom',
	},
	'_p.l': {
		type: 'string',
		longLabel: 'padding-left',
	},
	'_p.t.u': {
		type: 'string',
		default: 'px',
		longLabel: 'padding-top-unit',
	},
	'_p.r.u': {
		type: 'string',
		default: 'px',
		longLabel: 'padding-right-unit',
	},
	'_p.b.u': {
		type: 'string',
		default: 'px',
		longLabel: 'padding-bottom-unit',
	},
	'_p.l.u': {
		type: 'string',
		default: 'px',
		longLabel: 'padding-left-unit',
	},
	'_p.sy': {
		type: 'string',
		default: 'all',
		longLabel: 'padding-sync',
	},
};

const padding = breakpointAttributesCreator({
	obj: rawPadding,
});

export default padding;
