import breakpointAttributesCreator from '../breakpointAttributesCreator';

const accordion = {
	accordionLayout: { type: 'string', default: 'simple' },
	autoPaneClose: { type: 'boolean', default: true },
	...breakpointAttributesCreator({
		obj: {
			'pane-spacing': {
				type: 'number',
				default: 15,
			},
			'pane-spacing-unit': {
				type: 'string',
				default: 'px',
			},
		},
	}),
	isCollapsible: {
		type: 'boolean',
		default: true,
	},
	animationDuration: {
		type: 'number',
		default: 0,
	},
};

export default accordion;
