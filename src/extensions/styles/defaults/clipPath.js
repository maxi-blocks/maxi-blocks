import breakpointAttributesCreator from '@extensions/styles/breakpointAttributesCreator';

export const clipPathRaw = {
	'clip-path': {
		type: 'string',
		default: 'none',
	},
	'clip-path-status': {
		type: 'boolean',
		default: false,
	},
};

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
