import breakpointAttributesCreator from '../breakpointAttributesCreator';

const rawMargin = {
	'_m.t': {
		type: 'string',
		longLabel: 'margin-top',
	},
	'_m.r': {
		type: 'string',
		longLabel: 'margin-right',
	},
	'_m.b': {
		type: 'string',
		longLabel: 'margin-bottom',
	},
	'_m.l': {
		type: 'string',
		longLabel: 'margin-left',
	},
	'_m.sy': {
		type: 'string',
		default: 'all',
		longLabel: 'margin-sync',
	},
	'_m.t.u': {
		type: 'string',
		default: 'px',
		longLabel: 'margin-top-unit',
	},
	'_m.r.u': {
		type: 'string',
		default: 'px',
		longLabel: 'margin-right-unit',
	},
	'_m.b.u': {
		type: 'string',
		default: 'px',
		longLabel: 'margin-bottom-unit',
	},
	'_m.l.u': {
		type: 'string',
		default: 'px',
		longLabel: 'margin-left-unit',
	},
};

const margin = breakpointAttributesCreator({
	obj: rawMargin,
});

export default margin;
