import { __ } from '@wordpress/i18n';

import { border, borderWidth, borderRadius } from './border';
import { background, backgroundColor, backgroundGradient } from './background';
import { margin } from './margin';
import { padding } from './padding';
import { typography } from './typography';

export const hover = {
	'hover-type': {
		type: 'string',
		default: 'none',
	},
	'hover-preview': {
		type: 'boolean',
		default: true,
	},
	'hover-extension': {
		type: 'boolean',
		default: false,
	},
	'hover-basic-effect-type': {
		type: 'string',
		default: 'zoom-in',
	},
	'hover-text-effect-type': {
		type: 'string',
		default: 'fade',
	},
	'hover-text-preset': {
		type: 'string',
		default: 'center-center',
	},
	'hover-transition-easing': {
		type: 'string',
		default: 'easing',
	},
	'hover-transition-easing-cubic-bezier': {
		type: 'object',
	},
	'hover-transition-duration': {
		type: 'number',
		default: 0.5,
	},
	'hover-basic-zoom-in-value': {
		type: 'number',
		default: 1.3,
	},
	'hover-basic-zoom-out-value': {
		type: 'number',
		default: 1.5,
	},
	'hover-basic-slide-value': {
		type: 'number',
		default: 30,
	},
	'hover-basic-rotate-value': {
		type: 'number',
		default: 15,
	},
	'hover-basic-blur-value': {
		type: 'number',
		default: 2,
	},
};

export const hoverBorder = (() => {
	const response = {
		'hover-border-status': {
			type: 'boolean',
			default: false,
		},
	};

	Object.keys(border).forEach(key => {
		const newKey = `hover-${key}`;
		const value = { ...border[key] };

		response[newKey] = value;
	});

	return response;
})();

export const hoverBorderWidth = (() => {
	const response = {};

	Object.keys(borderWidth).forEach(key => {
		const newKey = `hover-${key}`;
		const value = { ...borderWidth[key] };

		response[newKey] = value;
	});

	return response;
})();

export const hoverBorderRadius = (() => {
	const response = {};

	Object.keys(borderRadius).forEach(key => {
		const newKey = `hover-${key}`;
		const value = { ...borderRadius[key] };

		response[newKey] = value;
	});

	return response;
})();

export const hoverBackground = (() => {
	const response = {
		'hover-background-status': {
			type: 'boolean',
			default: false,
		},
	};

	Object.keys(background).forEach(key => {
		const newKey = `hover-${key}`;
		const value = { ...background[key] };

		if (key === 'background-active-media') value.default = 'color';

		response[newKey] = value;
	});

	return response;
})();

export const hoverBackgroundColor = (() => {
	const response = {};

	Object.keys(backgroundColor).forEach(key => {
		const newKey = `hover-${key}`;
		const value = { ...backgroundColor[key] };

		if (key === 'background-palette-color') value.default = 5;
		if (key === 'background-palette-opacity') value.default = 60;

		response[newKey] = value;
	});

	return response;
})();

export const hoverBackgroundGradient = (() => {
	const response = {};

	Object.keys(backgroundGradient).forEach(key => {
		const newKey = `hover-${key}`;
		const value = { ...backgroundGradient[key] };

		response[newKey] = value;
	});

	return response;
})();

export const hoverMargin = (() => {
	const response = {
		'hover-margin-status': {
			type: 'boolean',
			default: false,
		},
	};

	Object.keys(margin).forEach(key => {
		const newKey = `hover-${key}`;
		const value = { ...margin[key] };

		response[newKey] = value;
	});

	return response;
})();

export const hoverPadding = (() => {
	const response = {
		'hover-padding-status': {
			type: 'boolean',
			default: false,
		},
	};

	Object.keys(padding).forEach(key => {
		const newKey = `hover-${key}`;
		const value = { ...padding[key] };

		response[newKey] = value;
	});

	return response;
})();

export const hoverTitleTypography = (() => {
	const response = {
		'hover-title-typography-status': {
			type: 'boolean',
			default: false,
		},
		'hover-title-typography-content': {
			type: 'string',
			default: __('Add your Hover Title here', 'maxi-blocks'),
		},
	};

	Object.keys(typography).forEach(key => {
		const newKey = `hover-title-${key}`;
		const value = { ...typography[key] };

		response[newKey] = value;
	});

	response['hover-title-font-size-general'].default = 30;
	response['hover-title-palette-color-general'].default = 1;

	return response;
})();

export const hoverContentTypography = (() => {
	const response = {
		'hover-content-typography-status': {
			type: 'boolean',
			default: false,
		},
		'hover-content-typography-content': {
			type: 'string',
			default: __('Add your Hover Title here', 'maxi-blocks'),
		},
	};

	Object.keys(typography).forEach(key => {
		const newKey = `hover-content-${key}`;
		const value = { ...typography[key] };

		response[newKey] = value;
	});

	response['hover-content-font-size-general'].default = 18;
	response['hover-content-palette-color-general'].default = 1;

	return response;
})();
