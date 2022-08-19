export const selectorsAccordion = {
	accordion: {
		normal: {
			title: 'accordion',
			target: '',
		},
		hover: {
			title: 'accordion on hover',
			target: ':hover',
		},
	},
	'before accordion': {
		normal: {
			label: 'accordion ::before',
			target: '::before',
		},
		hover: {
			label: 'accordion ::before on hover',
			target: ':hover::before',
		},
	},
	'after accordion': {
		normal: {
			label: 'accordion ::after',
			target: '::after',
		},
		hover: {
			label: 'accordion :after on hover',
			target: ':hover::after',
		},
	},
	'pane header': {
		normal: {
			label: 'pane header',
			target: ' .maxi-pane-block[aria-expanded] .maxi-pane-block__header',
		},
		hover: {
			label: 'pane header on hover',
			target: ' .maxi-pane-block[aria-expanded] .maxi-pane-block__header:hover',
		},
		active: {
			label: 'pane header on active state',
			target: ' .maxi-pane-block[aria-expanded=true] .maxi-pane-block__header',
		},
	},
	'pane icon': {
		normal: {
			label: 'icon',
			target: ' .maxi-pane-block[aria-expanded=false] .maxi-pane-block__icon',
		},
		svg: {
			label: "icon's svg",
			target: ' .maxi-pane-block[aria-expanded=false] .maxi-pane-block__icon svg',
		},
		insideSvg: {
			label: 'everything inside svg (svg > *)',
			target: ' .maxi-pane-block[aria-expanded=false] .maxi-pane-block__icon svg > *',
		},
		path: {
			label: "svg's path",
			target: ' .maxi-pane-block[aria-expanded=false] .maxi-pane-block__icon svg path',
		},
		hover: {
			label: 'icon on hover',
			target: ' .maxi-pane-block[aria-expanded] .maxi-pane-block__icon:hover',
		},
		hoverSvg: {
			label: "icon's svg on hover",
			target: ' .maxi-pane-block[aria-expanded] .maxi-pane-block__icon:hover svg',
		},
		hoverInsideSvg: {
			label: 'everything inside svg on hover (:hover svg > *)',
			target: ' .maxi-pane-block[aria-expanded] .maxi-pane-block__icon:hover svg > *',
		},
		hoverPath: {
			label: "svg's path on hover",
			target: ' .maxi-pane-block[aria-expanded] .maxi-pane-block__icon:hover svg path',
		},
		active: {
			label: 'active icon',
			target: ' .maxi-pane-block[aria-expanded=true] .maxi-pane-block__icon',
		},
		activeSvg: {
			label: "active icon's svg",
			target: ' .maxi-pane-block[aria-expanded=true] .maxi-pane-block__icon svg',
		},
		activeInsideSvg: {
			label: 'everything inside active svg (svg > *)',
			target: ' .maxi-pane-block[aria-expanded=true] .maxi-pane-block__icon svg > *',
		},
		activePath: {
			label: "active svg's path",
			target: ' .maxi-pane-block[aria-expanded=true] .maxi-pane-block__icon svg path',
		},
	},
	'pane content': {
		normal: {
			label: 'pane content',
			target: ' .maxi-pane-block[aria-expanded] .maxi-pane-block__content',
		},
		hover: {
			label: 'pane content on hover',
			target: ' .maxi-pane-block[aria-expanded] .maxi-pane-block__content:hover',
		},
	},
};

export const categoriesAccordion = [
	'accordion',
	'before accordion',
	'after accordion',
	'background',
	'background hover',
	'pane header',
	'pane content',
	'pane icon',
];
