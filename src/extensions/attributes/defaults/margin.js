import breakpointAttributesCreator from '../breakpointAttributesCreator';

const rawMargin = {
	'm.t': {
		type: 'string',
		longLabel: 'margin-top',
	},
	'm.r': {
		type: 'string',
		longLabel: 'margin-right',
	},
	'm.b': {
		type: 'string',
		longLabel: 'margin-bottom',
	},
	'm.l': {
		type: 'string',
		longLabel: 'margin-left',
	},
	'm.s': {
		type: 'string',
		default: 'all',
		longLabel: 'margin-sync',
	},
	'm.t.u': {
		type: 'string',
		default: 'px',
		longLabel: 'margin-top-unit',
	},
	'm.r.u': {
		type: 'string',
		default: 'px',
		longLabel: 'margin-right-unit',
	},
	'm.b.u': {
		type: 'string',
		default: 'px',
		longLabel: 'margin-bottom-unit',
	},
	'm.l.u': {
		type: 'string',
		default: 'px',
		longLabel: 'margin-left-unit',
	},
};

const margin = breakpointAttributesCreator({
	obj: rawMargin,
});

export default margin;
