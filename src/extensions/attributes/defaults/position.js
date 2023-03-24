import breakpointAttributesCreator from '../breakpointAttributesCreator';
import attributesShorter from '../dictionary/attributesShorter';

export const rawPosition = attributesShorter(
	{
		position: {
			type: 'string',
			default: 'inherit',
		},
		'position-top': {
			type: 'string',
		},
		'position-right': {
			type: 'string',
		},
		'position-bottom': {
			type: 'string',
		},
		'position-left': {
			type: 'string',
		},
		'position-sync': {
			type: 'string',
			default: 'all',
		},
		'position-top-unit': {
			type: 'string',
			default: 'px',
		},
		'position-right-unit': {
			type: 'string',
			default: 'px',
		},
		'position-bottom-unit': {
			type: 'string',
			default: 'px',
		},
		'position-left-unit': {
			type: 'string',
			default: 'px',
		},
	},
	'position'
);

const position = breakpointAttributesCreator({
	obj: rawPosition,
});

export default attributesShorter(position, 'position');
