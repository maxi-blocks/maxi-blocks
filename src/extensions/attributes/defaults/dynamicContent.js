const dynamicContent = {
	'dc-er': {
		type: 'string',
		default: '',
		longLabel: 'dc-error',
	},
	'dc.s': {
		type: 'boolean',
		default: false,
		longLabel: 'dc-status',
	},
	'dc-ty': {
		type: 'string',
		default: 'posts',
		longLabel: 'dc-type',
	},
	'dc-rel': {
		type: 'string',
		default: 'by-id',
		longLabel: 'dc-relation',
	},
	'dc-id': {
		type: 'number',
		longLabel: 'dc-id',
	},
	'dc-au': {
		type: 'number',
		longLabel: 'dc-author',
	},
	'dc-sho': {
		type: 'string',
		default: 'current',
		longLabel: 'dc-show',
	},
	'dc-f': {
		type: 'string',
		longLabel: 'dc-field',
	},
	'dc-fo': {
		type: 'string',
		default: 'd.m.Y t',
		longLabel: 'dc-format',
	},
	'dc-cfo': {
		type: 'string',
		longLabel: 'dc-custom-format',
	},
	'dc-cd': {
		type: 'boolean',
		default: false,
		longLabel: 'dc-custom-date',
	},
	'dc-y': {
		type: 'string',
		default: 'numeric',
		longLabel: 'dc-year',
	},
	'dc-mo': {
		type: 'string',
		default: 'numeric',
		longLabel: 'dc-month',
	},
	'dc-da': {
		type: 'string',
		default: 'numeric',
		longLabel: 'dc-day',
	},
	'dc-hou': {
		type: 'boolean',
		default: 'numeric',
		longLabel: 'dc-hour',
	},
	'dc-h12': {
		type: 'string',
		default: false,
		longLabel: 'dc-hour12',
	},
	'dc-min': {
		type: 'string',
		default: 'numeric',
		longLabel: 'dc-minute',
	},
	'dc-sec': {
		type: 'string',
		default: 'numeric',
		longLabel: 'dc-second',
	},
	'dc-loc': {
		type: 'string',
		default: 'en',
		longLabel: 'dc-locale',
	},
	'dc-tz': {
		type: 'string',
		default: 'Europe/London',
		longLabel: 'dc-timezone',
	},
	'dc-tzn': {
		type: 'string',
		default: 'none',
		longLabel: 'dc-timezone-name',
	},
	'dc-wd': {
		type: 'string',
		longLabel: 'dc-weekday',
	},
	'dc-era': {
		type: 'string',
		longLabel: 'dc-era',
	},
	'dc-lim': {
		type: 'number',
		default: 100,
		longLabel: 'dc-limit',
	},
	'dc-content': {
		type: 'string',
		longLabel: 'dc-content',
	},
	'dc-mid': {
		type: 'number',
		longLabel: 'dc-media-id',
	},
	'dc-mur': {
		type: 'string',
		longLabel: 'dc-media-url',
	},
	'dc-mc': {
		type: 'string',
		longLabel: 'dc-media-caption',
	},
	'dc-l.s': {
		type: 'boolean',
		longLabel: 'dc-link-status',
	},
	'dc-lur': {
		type: 'string',
		longLabel: 'dc-link-url',
	},
};

export default dynamicContent;
