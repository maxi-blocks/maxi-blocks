export const selectorsPane = {
	pane: {
		normal: {
			label: 'pane',
			target: '',
		},
		hover: {
			label: 'pane on hover',
			target: ':hover',
		},
	},
	'before pane': {
		normal: {
			label: 'pane ::before',
			target: '::before',
		},
		hover: {
			label: 'pane ::before on hover',
			target: ':hover::before',
		},
	},
	'after pane': {
		normal: {
			label: 'pane ::after',
			target: '::after',
		},
		hover: {
			label: 'pane :after on hover',
			target: ':hover::after',
		},
	},
	header: {
		normal: {
			label: 'pane header',
			target: '[aria-expanded] .maxi-pane-block__header',
		},
		hover: {
			label: 'pane header on hover',
			target: '[aria-expanded] .maxi-pane-block__header:hover',
		},
		active: {
			label: 'pane header on active state',
			target: '[aria-expanded=true] .maxi-pane-block__header',
		},
	},
	'header content': {
		normal: {
			label: 'header content',
			target: '[aria-expanded] .maxi-pane-block__header-content',
		},
		hover: {
			label: 'header content on hover',
			target: '[aria-expanded] .maxi-pane-block__header-content:hover',
		},
		active: {
			label: 'header content on active state',
			target: '[aria-expanded=true] .maxi-pane-block__header-content',
		},
	},
	'header line': {
		normal: {
			label: 'header line',
			target: '[aria-expanded] .maxi-pane-block__header-line',
		},
		hover: {
			label: 'header line on hover',
			target: '[aria-expanded] .maxi-pane-block__header-line:hover',
		},
		active: {
			label: 'header line on active state',
			target: '[aria-expanded=true] .maxi-pane-block__header-line',
		},
	},
	'content line': {
		normal: {
			label: 'content line',
			target: '[aria-expanded] .maxi-pane-block__content-line',
		},
		hover: {
			label: 'content line on hover',
			target: '[aria-expanded] .maxi-pane-block__content-line:hover',
		},
		active: {
			label: 'content line on active state',
			target: '[aria-expanded=true] .maxi-pane-block__content-line',
		},
	},
	icon: {
		normal: {
			label: 'icon',
			target: '[aria-expanded=false] .maxi-pane-block__icon',
		},
		svg: {
			label: "icon's svg",
			target: '[aria-expanded=false] .maxi-pane-block__icon svg',
		},
		insideSvg: {
			label: 'everything inside svg (svg > *)',
			target: '[aria-expanded=false] .maxi-pane-block__icon svg > *',
		},
		path: {
			label: "svg's path",
			target: '[aria-expanded=false] .maxi-pane-block__icon svg path',
		},
		hover: {
			label: 'icon on hover',
			target: '[aria-expanded] .maxi-pane-block__icon:hover',
		},
		hoverSvg: {
			label: "icon's svg on hover",
			target: '[aria-expanded] .maxi-pane-block__icon:hover svg',
		},
		hoverInsideSvg: {
			label: 'everything inside svg on hover (:hover svg > *)',
			target: '[aria-expanded] .maxi-pane-block__icon:hover svg > *',
		},
		hoverPath: {
			label: "svg's path on hover",
			target: '[aria-expanded] .maxi-pane-block__icon:hover svg path',
		},
		active: {
			label: 'active icon',
			target: '[aria-expanded=true] .maxi-pane-block__icon',
		},
		activeSvg: {
			label: "active icon's svg",
			target: '[aria-expanded=true] .maxi-pane-block__icon svg',
		},
		activeInsideSvg: {
			label: 'everything inside active svg (svg > *)',
			target: '[aria-expanded=true] .maxi-pane-block__icon svg > *',
		},
		activePath: {
			label: "active svg's path",
			target: '[aria-expanded=true] .maxi-pane-block__icon svg path',
		},
	},
	content: {
		normal: {
			label: 'pane content',
			target: '[aria-expanded] .maxi-pane-block__content',
		},
		hover: {
			label: 'pane content on hover',
			target: '[aria-expanded] .maxi-pane-block__content:hover',
		},
	},
};

export const categoriesPane = [
	'pane',
	'before pane',
	'after pane',
	'header',
	'header content',
	'header line',
	'content line',
	'content',
	'icon',
	'background',
	'background hover',
];
