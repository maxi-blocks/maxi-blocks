import attributesShorter from '../dictionary/attributesShorter';

const transition = {
	transition: {
		type: 'object',
	},
	'transition-change-all': {
		type: 'boolean',
		default: true,
	},
};

export default attributesShorter(transition, 'transition');
