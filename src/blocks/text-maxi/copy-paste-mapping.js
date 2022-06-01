const copyPasteMapping = {
	exclude: ['content'],
	_order: [
		'Heading / Paragraph tag',
		'List options',
		'Text alignment',
		'Typography',
		'Background',
		'Border',
		'Box shadow',
		'Size',
		'Margin/Padding',
	],

	settings: {
		blockSpecific: {
			size: {
				groupLabel: 'Size',
				props: {
					blockFullWidth: 'Full width',
					size: { label: 'Size', type: 'withPrefix' },
				},
			},
			textLevel: 'Heading / Paragraph tag',
			content: 'Text content',
			list: {
				groupLabel: 'List options',
				props: {
					'list-indent': {
						type: 'withBreakpoint',
						label: 'List indent',
					},
					'list-indent-unit': {
						type: 'withBreakpoint',
						label: 'List indent unit',
					},
					'list-gap': {
						type: 'withBreakpoint',
						label: 'List gap',
					},
					'list-gap-unit': {
						type: 'withBreakpoint',
						label: 'List gap unit',
					},
					'list-paragraph-spacing': {
						type: 'withBreakpoint',
						label: 'List paragraph spacing',
					},
					'list-paragraph-spacing-unit': {
						type: 'withBreakpoint',
						label: 'List paragraph spacing unit',
					},
					'list-marker-size': {
						type: 'withBreakpoint',
						label: 'Marker size',
					},
					'list-marker-size-unit': {
						type: 'withBreakpoint',
						label: 'Marker size unit',
					},
					'list-marker-indent': {
						type: 'withBreakpoint',
						label: 'List marker indent',
					},
					'list-marker-indent-unit': {
						type: 'withBreakpoint',
						label: 'List marker indent unit',
					},
					'list-marker-line-height': {
						type: 'withBreakpoint',
						label: 'List marker line height',
					},
					'list-marker-line-height-unit': {
						type: 'withBreakpoint',
						label: 'List marker line height unit',
					},
					'list-': {
						type: 'withPalette',
						label: 'List colour',
					},
					'list-text-position': {
						type: 'withBreakpoint',
						label: 'List text position',
					},
					typeOfList: 'List type',
					listStyle: 'List style',
					listStyleCustom: 'List style custom',
					listStart: 'List start',
					listReversed: 'List reversed',
				},
			},
		},
		withoutPrefix: {
			textAlignment: 'Text alignment',
			typography: {
				groupLabel: 'Typography',
				props: {
					typography: 'Typography',
					typographyHover: 'Typography hover',
				},
			},
			blockBackground: 'Background',
			border: {
				groupLabel: 'Border',
				props: {
					border: 'Border',
					borderWidth: 'Border width',
					borderRadius: 'Border radius',
					borderHover: 'Border hover',
					borderWidthHover: 'Border width hover',
					borderRadiusHover: 'Border radius hover',
				},
			},
			boxShadow: {
				groupLabel: 'Box shadow',
				props: {
					boxShadow: 'Box shadow',
					boxShadowHover: 'Box shadow hover',
				},
			},
			'margin-padding': {
				groupLabel: 'Margin/Padding',
				props: { margin: 'Margin', padding: 'Padding' },
			},
		},
	},
	advanced: {
		blockSpecific: {
			extraClassName: 'Custom CSS classes',
			anchorLink: {
				label: 'Anchor',
				value: ['anchorLink', 'linkSettings'],
			},
			relations: 'Interaction',
		},
		withoutPrefix: {
			breakpoints: 'Breakpoints',
			customCss: 'Custom CSS',
			scroll: 'Scroll',
			transform: 'Transform',
			transition: 'Hyperlink hover transition',
			display: 'Show/hide block',
			opacity: 'Opacity',
			position: 'Position',
			overflow: 'Overflow',
			flex: 'Flexbox',
			zIndex: 'Z-index',
		},
	},
};

export default copyPasteMapping;
