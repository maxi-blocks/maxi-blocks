import breakpointAttributesCreator from '../breakpointAttributesCreator';

const accordion = {
	accordionLayout: { type: 'string', default: 'simple' },
	autoPaneClose: { type: 'boolean', default: true },
	...breakpointAttributesCreator({
		obj: { 'pane-spacing': { type: 'number', default: 15 } },
	}),
};

export default accordion;
