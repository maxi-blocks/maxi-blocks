const dynamicContentLink = {
	'dc-status': {
		type: 'boolean',
	},
	'dc-link-status': {
		type: 'boolean',
	},
	'dc-link-target': {
		type: 'string',
		default: 'none',
	},
};

const dynamicContent = {
	'dc-error': {
		type: 'string',
		default: '',
	},
	'dc-hide': {
		type: 'boolean',
		default: true,
	},
	'dc-status': {
		type: 'boolean',
	},
	'dc-source': {
		type: 'string',
	},
	'dc-type': {
		type: 'string',
	},
	'dc-relation': {
		type: 'string',
	},
	'dc-id': {
		type: 'number',
	},
	'dc-author': {
		type: 'number',
	},
	'dc-show': {
		type: 'string',
		default: 'current',
	},
	'dc-field': {
		type: 'string',
	},
	'dc-sub-field': {
		type: 'string',
	},
	'dc-format': {
		type: 'string',
		default: 'd.m.Y t',
	},
	'dc-custom-format': {
		type: 'string',
	},
	'dc-custom-date': {
		type: 'boolean',
		default: false,
	},
	'dc-year': {
		type: 'string',
		default: 'numeric',
	},
	'dc-month': {
		type: 'string',
		default: 'numeric',
	},
	'dc-day': {
		type: 'string',
		default: 'numeric',
	},
	'dc-hour': {
		type: 'boolean',
		default: 'numeric',
	},
	'dc-hour12': {
		type: 'string',
		default: false,
	},
	'dc-minute': {
		type: 'string',
		default: 'numeric',
	},
	'dc-second': {
		type: 'string',
		default: 'numeric',
	},
	'dc-locale': {
		type: 'string',
		default: 'en',
	},
	'dc-timezone': {
		type: 'string',
		default: 'Europe/London',
	},
	'dc-timezone-name': {
		type: 'string',
		default: 'none',
	},
	'dc-weekday': {
		type: 'string',
		default: 'none',
	},
	'dc-era': {
		type: 'string',
		default: 'none',
	},
	'dc-limit': {
		type: 'number',
		default: 100,
	},
	'dc-content': {
		type: 'string',
	},
	'dc-media-id': {
		type: 'number',
	},
	'dc-media-url': {
		type: 'string',
	},
	'dc-media-caption': {
		type: 'string',
	},
	'dc-media-size': {
		type: 'number',
		default: 512,
	},
	'dc-link-status': {
		type: 'boolean',
	},
	'dc-link-url': {
		type: 'string',
	},
	'dc-custom-delimiter-status': {
		type: 'boolean',
	},
	'dc-delimiter-content': {
		type: 'string',
		default: '',
	},
	'dc-order-by': {
		type: 'string',
	},
	'dc-order': {
		type: 'string',
	},
	'dc-accumulator': {
		type: 'number',
	},
	'dc-acf-group': {
		type: 'number',
	},
	'dc-acf-field-type': {
		type: 'string',
	},
	'dc-contains-html': {
		type: 'boolean',
		default: false,
	},
	'dc-image-accumulator': {
		type: 'number',
		default: 0,
	},
	'dc-keep-only-text-content': {
		type: 'boolean',
		default: false,
	},
	...dynamicContentLink,
};

export { dynamicContent, dynamicContentLink };
