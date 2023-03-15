import breakpointAttributesCreator from '../breakpointAttributesCreator';
import attributesShorter from '../dictionary/attributesShorter';

export const clipPathRaw = attributesShorter(
	{
		'clip-path': {
			type: 'string',
			default: 'none',
		},
		'clip-path-status': {
			type: 'boolean',
			default: false,
		},
	},
	'clipPath'
);

const clipPath = {
	...breakpointAttributesCreator({
		obj: clipPathRaw,
	}),
	'clip-path-status-hover': {
		type: 'boolean',
		default: false,
	},
};

export default clipPath;
