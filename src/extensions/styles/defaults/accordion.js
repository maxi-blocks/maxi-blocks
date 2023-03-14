import attributesShorter from '../dictionary/attributesShorter';

const accordion = {
	accordionLayout: { type: 'string', default: 'simple' },
	autoPaneClose: { type: 'boolean', default: true },
	isCollapsible: {
		type: 'boolean',
		default: true,
	},
	animationDuration: {
		type: 'number',
		default: 0.3,
	},
};

export default attributesShorter(accordion, 'accordion');
