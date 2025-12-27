/**
 * Helper to map long CSS variable tokens to short ones.
 */

const styleMap = {
	light: 'l',
	dark: 'd',
};

const elementMap = {
	button: 'btn',
	p: 'p',
	h1: 'h1',
	h2: 'h2',
	h3: 'h3',
	h4: 'h4',
	h5: 'h5',
	h6: 'h6',
	icon: 'icn',
	divider: 'div',
	link: 'lnk',
	navigation: 'nav',
	search: 'sch',
};

const settingMap = {
	'font-family': 'ff',
	'font-size': 'fs',
	'font-style': 'fst',
	'font-weight': 'fw',
	'line-height': 'lh',
	'text-decoration': 'td',
	'text-transform': 'tt',
	'letter-spacing': 'ls',
	'white-space': 'ws',
	'word-spacing': 'wsp',
	'margin-bottom': 'mb',
	'text-indent': 'ti',
	'padding-bottom': 'pb',
	'padding-top': 'pt',
	'padding-left': 'pl',
	'padding-right': 'pr',
	'background-color': 'bg',
	color: 'c',
	'border-color': 'bc',
	stroke: 'str',
	fill: 'fil',
	palette: 'pal',

	// Navigation specific
	'menu-item': 'mi',
	'menu-burger': 'mbg',
	'menu-mobile-bg': 'mmb',
	'menu-item-sub-bg': 'misb',

	// Suffixes often used as part of settings in loop
	hover: 'h',
	active: 'a',
	visited: 'v',
	focus: 'f',
	current: 'cur',
};

const breakpointMap = {
	general: 'g',
	xxl: 'xxl',
	xl: 'xl',
	l: 'l',
	m: 'm',
	s: 's',
	xs: 'xs',
};

module.exports = {
	styleMap,
	elementMap,
	settingMap,
	breakpointMap,
};
