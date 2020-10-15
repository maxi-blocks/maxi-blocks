const isRTL =
	document.querySelector('body').getAttribute('class').indexOf('rtl') !== -1;

export const alignment = {
	label: 'Alignment',
	general: {
		alignment: !isRTL ? 'left' : 'right',
	},
	xxl: {
		alignment: '',
	},
	xl: {
		alignment: '',
	},
	l: {
		alignment: '',
	},
	m: {
		alignment: '',
	},
	s: {
		alignment: '',
	},
	xs: {
		alignment: '',
	},
};

export const margin = {
	label: 'Margin',
	unit: 'em',
	general: {
		'margin-top': 1,
		'margin-right': '',
		'margin-bottom': 1,
		'margin-left': '',
		sync: false,
		unit: 'em',
	},
	xxl: {
		'margin-top': '',
		'margin-right': '',
		'margin-bottom': '',
		'margin-left': '',
		sync: true,
	},
	xl: {
		'margin-top': '',
		'margin-right': '',
		'margin-bottom': '',
		'margin-left': '',
		sync: true,
		unit: '',
	},
	l: {
		'margin-top': '',
		'margin-right': '',
		'margin-bottom': '',
		'margin-left': '',
		sync: true,
		unit: '',
	},
	m: {
		'margin-top': '',
		'margin-right': '',
		'margin-bottom': '',
		'margin-left': '',
		sync: true,
		unit: '',
	},
	s: {
		'margin-top': '',
		'margin-right': '',
		'margin-bottom': '',
		'margin-left': '',
		sync: true,
		unit: '',
	},
	xs: {
		'margin-top': '',
		'margin-right': '',
		'margin-bottom': '',
		'margin-left': '',
		sync: true,
		unit: '',
	},
};
