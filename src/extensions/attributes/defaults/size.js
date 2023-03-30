import breakpointAttributesCreator from '../breakpointAttributesCreator';

export const rawSize = {
	_sao: {
		type: 'boolean',
		default: false,
		longLabel: 'size-advanced-options',
	},
};

export const rawMaxWidth = {
	'_mw.u': {
		type: 'string',
		default: 'px',
		longLabel: 'max-width-unit',
	},
	_mw: {
		type: 'string',
		longLabel: 'max-width',
	},
};

export const rawWidth = {
	'_w.u': {
		type: 'string',
		default: 'px',
		longLabel: 'width-unit',
	},
	_w: {
		type: 'string',
		longLabel: 'width',
	},
	_wfc: {
		type: 'boolean',
		default: false,
		longLabel: 'width-fit-content',
	},
};

export const rawMinWidth = {
	'_miw.u': {
		type: 'string',
		default: 'px',
		longLabel: 'min-width-unit',
	},
	_miw: {
		type: 'string',
		longLabel: 'min-width',
	},
};

export const rawMaxHeight = {
	'_mh.u': {
		type: 'string',
		default: 'px',
		longLabel: 'max-height-unit',
	},
	_mh: {
		type: 'string',
		longLabel: 'max-height',
	},
};

export const rawHeight = {
	'_h.u': {
		type: 'string',
		default: 'px',
		longLabel: 'height-unit',
	},
	_h: {
		type: 'string',
		longLabel: 'height',
	},
	_far: {
		type: 'boolean',
		longLabel: 'force-aspect-ratio',
	},
};

export const rawMinHeight = {
	'_mih.u': {
		type: 'string',
		default: 'px',
		longLabel: 'min-height-unit',
	},
	_mih: {
		type: 'string',
		longLabel: 'min-height',
	},
};

export const rawFullWidth = {
	_fw: {
		type: 'string',
		default: 'normal',
		longLabel: 'full-width',
	},
};

export const maxWidth = breakpointAttributesCreator({ obj: rawMaxWidth });
export const width = breakpointAttributesCreator({ obj: rawWidth });
export const minWidth = breakpointAttributesCreator({ obj: rawMinWidth });
export const maxHeight = breakpointAttributesCreator({ obj: rawMaxHeight });
export const height = breakpointAttributesCreator({ obj: rawHeight });
export const minHeight = breakpointAttributesCreator({ obj: rawMinHeight });
export const fullWidth = breakpointAttributesCreator({
	obj: rawFullWidth,
});

const size = {
	...rawSize,
	...maxWidth,
	...width,
	...minWidth,
	...maxHeight,
	...height,
	...minHeight,
	...fullWidth,
};

export default size;
