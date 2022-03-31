import breakpointAttributesCreator from '../breakpointAttributesCreator';

export const clipPathRaw = {
	'clip-path': {
		type: 'string',
	},
	'clip-path-status': {
		type: 'boolean',
		default: false,
	},
};

const clipPath = breakpointAttributesCreator({
	obj: clipPathRaw,
});

export default clipPath;
