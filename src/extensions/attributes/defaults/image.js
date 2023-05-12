import breakpointAttributesCreator from '../breakpointAttributesCreator';

const image = {
	_ir: {
		type: 'string',
		default: 'original',
		longLabel: 'imageRatio',
	},
	_se: {
		type: 'string',
		longLabel: 'SVGElement',
	},
	_sd: {
		type: 'object',
		longLabel: 'SVGData',
	},
	_ct: {
		type: 'string',
		default: 'none',
		longLabel: 'captionType',
	},
	_cco: {
		type: 'string',
		default: '',
		longLabel: 'captionContent',
	},
	_cpo: {
		type: 'string',
		default: 'bottom',
		longLabel: 'captionPosition',
	},
	...breakpointAttributesCreator({
		obj: {
			_cg: {
				type: 'number',
				default: 1,
				longLabel: 'caption-gap',
			},
			'_cg.u': {
				type: 'string',
				default: 'em',
				longLabel: 'caption-gap-unit',
			},
		},
	}),
	_is: {
		type: 'string',
		default: 'full',
		longLabel: 'imageSize',
	},
	_co: {
		type: 'object',
		longLabel: 'cropOptions',
	},
	_iiu: {
		type: 'boolean',
		default: false,
		longLabel: 'isImageUrl',
	},
	_mi: {
		type: 'number',
		longLabel: 'mediaID',
	},
	_mu: {
		type: 'string',
		longLabel: 'mediaURL',
	},
	_mal: {
		type: 'string',
		longLabel: 'mediaAlt',
	},
	_as: {
		type: 'string',
		default: 'wordpress',
		longLabel: 'altSelector',
	},
	_mew: {
		type: 'number',
		longLabel: 'mediaWidth',
	},
	_meh: {
		type: 'number',
		longLabel: 'mediaHeight',
	},
	_iw: {
		type: 'number',
		default: 100,
		longLabel: 'imgWidth',
	},
	_uis: {
		type: 'boolean',
		longLabel: 'useInitSize',
	},
	_fps: {
		type: 'boolean',
		longLabel: 'fitParentSize',
	},
	...breakpointAttributesCreator({
		obj: {
			_os: {
				type: 'number',
				default: 1,
				longLabel: 'object-size',
			},
			_oph: {
				type: 'number',
				default: 50,
				longLabel: 'object-position-horizontal',
			},
			_opv: {
				type: 'number',
				default: 50,
				longLabel: 'object-position-vertical',
			},
		},
	}),
};

export default image;
