const templates = {
	background: {
		group: {
			'Background color': {
				groupAttributes: ['background', 'backgroundColor'],
			},
			'Background gradient': {
				groupAttributes: ['background', 'backgroundGradient'],
			},
			'Background color hover': {
				groupAttributes: ['backgroundHover', 'backgroundColorHover'],
			},
			'Background gradient hover': {
				groupAttributes: ['backgroundHover', 'backgroundGradientHover'],
			},
		},
	},
	blockBackground: {
		groupAttributes: 'blockBackground',
	},
	border: {
		group: {
			Border: {
				groupAttributes: 'border',
			},
			'Border width': {
				groupAttributes: 'borderWidth',
			},
			'Border radius': {
				groupAttributes: 'borderRadius',
			},
			'Border hover': {
				groupAttributes: 'borderHover',
			},
			'Border width hover': {
				groupAttributes: 'borderWidthHover',
			},
			'Border radius hover': {
				groupAttributes: 'borderRadiusHover',
			},
		},
	},
	boxShadow: {
		group: {
			'Box shadow': {
				groupAttributes: 'boxShadow',
			},
			'Box shadow hover': {
				groupAttributes: 'boxShadowHover',
			},
		},
	},
	typography: {
		group: {
			Typography: {
				groupAttributes: 'typography',
			},
			'Typography hover': {
				groupAttributes: 'typographyHover',
			},
		},
	},
	size: {
		groupAttributes: 'size',
	},
	marginPadding: {
		group: {
			Margin: {
				groupAttributes: 'margin',
			},
			Padding: {
				groupAttributes: 'padding',
			},
		},
	},
	opacity: {
		groupAttributes: 'opacity',
	},
	// Advanced
	customCssClasses: {
		props: '_ecn',
	},
	anchor: {
		props: ['anchor', '_lse'],
	},
	interaction: {
		props: 'relations',
	},
	breakpoints: {
		groupAttributes: '_bp',
	},
	customCss: {
		groupAttributes: 'customCss',
	},
	scroll: {
		groupAttributes: 'scroll',
	},
	transform: {
		groupAttributes: 'transform',
	},
	transition: {
		groupAttributes: '_t',
	},
	display: {
		groupAttributes: 'display',
	},
	position: {
		groupAttributes: '_pos',
	},
	overflow: {
		groupAttributes: 'overflow',
	},
	flex: {
		groupAttributes: 'flex',
	},
	zIndex: {
		groupAttributes: 'zIndex',
	},
	advanced: {
		'Custom CSS classes': {
			template: 'customCssClasses',
		},
		Anchor: {
			template: 'anchor',
		},
		Interaction: {
			template: 'interaction',
		},
		Breakpoints: {
			template: '_bp',
		},
		'Custom CSS': {
			template: 'customCss',
		},
		Scroll: {
			template: 'scroll',
		},
		Transform: {
			template: 'transform',
		},
		'Hover transition': {
			template: '_t',
		},
		'Show/hide block': {
			template: 'display',
		},
		Position: {
			template: '_pos',
		},
		Overflow: {
			template: 'overflow',
		},
		Flexbox: {
			template: 'flex',
		},
		'Z-index': {
			template: 'zIndex',
		},
	},
};

export default templates;
