const dynamicContentProps = [
	'dc-status',
	'dc-hide',
	'dc-source',
	'dc-type',
	'dc-relation',
	'dc-id',
	'dc-author',
	'dc-show',
	'dc-field',
	'dc-sub-field',
	'dc-format',
	'dc-custom-format',
	'dc-custom-date',
	'dc-year',
	'dc-month',
	'dc-day',
	'dc-hour',
	'dc-hour12',
	'dc-minute',
	'dc-second',
	'dc-locale',
	'dc-timezone',
	'dc-timezone-name',
	'dc-weekday',
	'dc-era',
	'dc-limit',
	'dc-link-status',
	'dc-link-target',
	'dc-custom-delimiter-status',
	'dc-delimiter-content',
	'dc-order-by',
	'dc-order',
	'dc-accumulator',
	'dc-acf-group',
	'dc-acf-field-type',
	'dc-image-accumulator',
	'dc-keep-only-text-content',
	'dc-acf-char-limit',
	'dc-limit-by-archive',
	'dc-media-size',
];

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
		props: 'extraClassName',
	},
	anchor: {
		props: [
			'anchor',
			'anchorLink',
			'linkSettings',
			'dc-status',
			'dc-link-status',
			'dc-link-target',
			'dc-type',
			'dc-field',
			'dc-sub-field',
		],
	},
	dynamicContent: {
		props: dynamicContentProps,
		_skipIfEmpty: true,
	},
	interaction: {
		props: 'relations',
	},
	breakpoints: {
		groupAttributes: 'breakpoints',
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
		groupAttributes: 'transition',
	},
	display: {
		groupAttributes: 'display',
	},
	position: {
		groupAttributes: 'position',
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
		'Dynamic content': {
			template: 'dynamicContent',
		},
		Interaction: {
			template: 'interaction',
		},
		Breakpoints: {
			template: 'breakpoints',
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
			template: 'transition',
		},
		'Show/hide block': {
			template: 'display',
		},
		Position: {
			template: 'position',
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
