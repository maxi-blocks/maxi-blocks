const dynamicContent = {
	dc_er: {
		type: 'string',
		default: '',
		longLabel: 'dc-error',
	},
	'dc.s': {
		type: 'boolean',
		default: false,
		longLabel: 'dc-status',
	},
	dc_ty: {
		type: 'string',
		default: 'posts',
		longLabel: 'dc-type',
	},
	dc_rel: {
		type: 'string',
		default: 'by-id',
		longLabel: 'dc-relation',
	},
	dc_id: {
		type: 'number',
		longLabel: 'dc-id',
	},
	dc_au: {
		type: 'number',
		longLabel: 'dc-author',
	},
	dc_sho: {
		type: 'string',
		default: 'current',
		longLabel: 'dc-show',
	},
	dc_f: {
		type: 'string',
		longLabel: 'dc-field',
	},
	dc_fo: {
		type: 'string',
		default: 'd.m.Y t',
		longLabel: 'dc-format',
	},
	dc_cfo: {
		type: 'string',
		longLabel: 'dc-custom-format',
	},
	dc_cd: {
		type: 'boolean',
		default: false,
		longLabel: 'dc-custom-date',
	},
	dc_y: {
		type: 'string',
		default: 'numeric',
		longLabel: 'dc-year',
	},
	dc_mo: {
		type: 'string',
		default: 'numeric',
		longLabel: 'dc-month',
	},
	dc_da: {
		type: 'string',
		default: 'numeric',
		longLabel: 'dc-day',
	},
	dc_hou: {
		type: 'boolean',
		default: 'numeric',
		longLabel: 'dc-hour',
	},
	dc_h12: {
		type: 'string',
		default: false,
		longLabel: 'dc-hour12',
	},
	dc_min: {
		type: 'string',
		default: 'numeric',
		longLabel: 'dc-minute',
	},
	dc_sec: {
		type: 'string',
		default: 'numeric',
		longLabel: 'dc-second',
	},
	dc_loc: {
		type: 'string',
		default: 'en',
		longLabel: 'dc-locale',
	},
	dc_tz: {
		type: 'string',
		default: 'Europe/London',
		longLabel: 'dc-timezone',
	},
	dc_tzn: {
		type: 'string',
		default: 'none',
		longLabel: 'dc-timezone-name',
	},
	dc_wd: {
		type: 'string',
		longLabel: 'dc-weekday',
	},
	dc_era: {
		type: 'string',
		longLabel: 'dc-era',
	},
	dc_lim: {
		type: 'number',
		default: 100,
		longLabel: 'dc-limit',
	},
	dc_c: {
		type: 'string',
		longLabel: 'dc-content',
	},
	dc_mid: {
		type: 'number',
		longLabel: 'dc-media-id',
	},
	dc_mur: {
		type: 'string',
		longLabel: 'dc-media-url',
	},
	dc_mc: {
		type: 'string',
		longLabel: 'dc-media-caption',
	},
	'dc_l.s': {
		type: 'boolean',
		longLabel: 'dc-link-status',
	},
	dc_lur: {
		type: 'string',
		longLabel: 'dc-link-url',
	},
};

export default dynamicContent;
