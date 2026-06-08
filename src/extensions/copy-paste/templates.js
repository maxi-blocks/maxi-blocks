const typographyItem = (
	props,
	isHover = false,
	hasBreakpoints = true,
	pasteWith = false
) => ({
	props,
	...(hasBreakpoints && { hasBreakpoints: true }),
	...(isHover && { isHover: true }),
	...(pasteWith && { pasteWith }),
});

const typographyHoverItem = (props, hasBreakpoints = true) =>
	typographyItem(props, true, hasBreakpoints, 'typography-status-hover');

const typographyGroups = {
	'Font family': typographyItem('font-family'),
	'Font colour': typographyItem([
		'palette-status',
		'palette-sc-status',
		'palette-color',
		'color',
	]),
	'Colour opacity': typographyItem('palette-opacity'),
	'Font size': typographyItem(['font-size', 'font-size-unit']),
	'Line height': typographyItem(['line-height', 'line-height-unit']),
	'Letter spacing': typographyItem([
		'letter-spacing',
		'letter-spacing-unit',
	]),
	'Font style': typographyItem([
		'font-weight',
		'text-transform',
		'font-style',
		'text-decoration',
	]),
	'Text spacing': typographyItem([
		'text-indent',
		'text-indent-unit',
		'word-spacing',
		'word-spacing-unit',
		'bottom-gap',
		'bottom-gap-unit',
	]),
	'Text layout': typographyItem([
		'vertical-align',
		'text-orientation',
		'text-direction',
		'text-wrap',
		'white-space',
	]),
	'Text shadow': typographyItem('text-shadow'),
	'Custom formats': typographyItem('custom-formats', false, false),
	'List font colour': typographyItem([
		'list-palette-status',
		'list-palette-sc-status',
		'list-palette-color',
		'list-color',
	]),
	'List colour opacity': typographyItem('list-palette-opacity'),
};

const typographyHoverGroups = {
	'Hover state': { props: 'typography-status', isHover: true },
	'Hover font family': typographyHoverItem('font-family'),
	'Hover font colour': typographyHoverItem([
		'palette-status',
		'palette-sc-status',
		'palette-color',
		'color',
	]),
	'Hover colour opacity': typographyHoverItem('palette-opacity'),
	'Hover font size': typographyHoverItem(['font-size', 'font-size-unit']),
	'Hover line height': typographyHoverItem([
		'line-height',
		'line-height-unit',
	]),
	'Hover letter spacing': typographyHoverItem([
		'letter-spacing',
		'letter-spacing-unit',
	]),
	'Hover font style': typographyHoverItem([
		'font-weight',
		'text-transform',
		'font-style',
		'text-decoration',
	]),
	'Hover text spacing': typographyHoverItem([
		'text-indent',
		'text-indent-unit',
		'word-spacing',
		'word-spacing-unit',
		'bottom-gap',
		'bottom-gap-unit',
	]),
	'Hover text layout': typographyHoverItem([
		'vertical-align',
		'text-orientation',
		'text-direction',
		'text-wrap',
		'white-space',
	]),
	'Hover text shadow': typographyHoverItem('text-shadow'),
	'Hover custom formats': typographyHoverItem('custom-formats', false),
	'Hover list font colour': typographyHoverItem([
		'list-palette-status',
		'list-palette-sc-status',
		'list-palette-color',
		'list-color',
	]),
	'Hover list colour opacity': typographyHoverItem('list-palette-opacity'),
};

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
	backgroundActive: {
		group: {
			'Background color active': {
				groupAttributes: ['backgroundActive', 'backgroundColorActive'],
			},
			'Background gradient active': {
				groupAttributes: [
					'backgroundActive',
					'backgroundGradientActive',
				],
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
	borderActive: {
		group: {
			'Border active': {
				groupAttributes: 'borderActive',
			},
			'Border width active': {
				groupAttributes: 'borderWidthActive',
			},
			'Border radius active': {
				groupAttributes: 'borderRadiusActive',
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
	boxShadowActive: {
		groupAttributes: 'boxShadowActive',
	},
	typography: {
		group: {
			...typographyGroups,
			...typographyHoverGroups,
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
		groupAttributes: ['opacity', 'opacityHover'],
	},
	// Advanced
	blockSettings: {
		props: ['ariaLabels', 'blockStyle'],
	},
	customCssClasses: {
		props: 'extraClassName',
	},
	anchor: {
		groupAttributes: 'link',
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
		_gatekeeper: 'dc-status',
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
	advancedCss: {
		groupAttributes: 'advancedCss',
	},
	contextLoop: {
		groupAttributes: 'contextLoop',
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
		'Block settings': {
			template: 'blockSettings',
		},
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
		'Advanced CSS': {
			template: 'advancedCss',
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
