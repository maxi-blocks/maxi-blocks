import breakpointAttributesCreator from '../breakpointAttributesCreator';

const rawTransform = {
	tr_sc: {
		type: 'object',
		longLabel: 'transform-scale',
	},
	tr_tr: {
		type: 'object',
		longLabel: 'transform-translate',
	},
	tr_rot: {
		type: 'object',
		longLabel: 'transform-rotate',
	},
	tr_ori: {
		type: 'object',
		longLabel: 'transform-origin',
	},
};

const transform = {
	tr_tar: {
		type: 'string',
		longLabel: 'transform-target',
	},
	...breakpointAttributesCreator({
		obj: rawTransform,
	}),
};

export default transform;
