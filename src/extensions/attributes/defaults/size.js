import breakpointAttributesCreator from '../breakpointAttributesCreator';

export const rawSize = {
	sao: {
		type: 'boolean',
		default: false,
		longLabel: 'size-advanced-options',
	},
};

export const rawMaxWidth = {
	'mw.u': {
		type: 'string',
		default: 'px',
		longLabel: 'max-width-unit',
	},
	mw: {
		type: 'string',
		longLabel: 'max-width',
	},
};

export const rawWidth = {
	'w-u': {
		type: 'string',
		default: 'px',
		longLabel: 'width-unit',
	},
	w: {
		type: 'string',
		longLabel: 'width',
	},
	wfc: {
		type: 'boolean',
		default: false,
		longLabel: 'width-fit-content',
	},
};

export const rawMinWidth = {
	'miw.u': {
		type: 'string',
		default: 'px',
		longLabel: 'min-width-unit',
	},
	miw: {
		type: 'string',
		longLabel: 'min-width',
	},
};

export const rawMaxHeight = {
	'mh.u': {
		type: 'string',
		default: 'px',
		longLabel: 'max-height-unit',
	},
	mh: {
		type: 'string',
		longLabel: 'max-height',
	},
};

export const rawHeight = {
	'h.u': {
		type: 'string',
		default: 'px',
		longLabel: 'height-unit',
	},
	h: {
		type: 'string',
		longLabel: 'height',
	},
	far: {
		type: 'boolean',
		longLabel: 'force-aspect-ratio',
	},
};

export const rawMinHeight = {
	'mih.u': {
		type: 'string',
		default: 'px',
		longLabel: 'min-height-unit',
	},
	mih: {
		type: 'string',
		longLabel: 'min-height',
	},
};

export const rawFullWidth = {
	fw: {
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
