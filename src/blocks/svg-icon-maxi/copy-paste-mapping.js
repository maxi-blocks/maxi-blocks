const copyPasteMapping = {
	exclude: ['content', 'svgType'],
	settings: {
		blockSpecific: {
			content: { label: 'SVG Content', value: ['svgType', 'content'] },
			iconColor: {
				groupLabel: 'Icon colour',
				props: {
					'svg-status-hover': 'Icon hover status',
					'svg-fill-': { label: 'Fill colour', type: 'withPalette' },
					'svg-line-': { label: 'Line colour', type: 'withPalette' },
					'svg-fill-hover': {
						label: 'Fill hover colour',
						type: 'withPaletteHover',
					},
					'svg-line-hover': {
						label: 'Line hover colour',
						type: 'withPaletteHover',
					},
				},
			},
			size: {
				groupLabel: 'Size',
				props: {
					'svg-responsive': {
						label: 'Force responsive',
						type: 'withBreakpoint',
					},
					size: { label: 'Size', type: 'withPrefix' },
				},
			},
		},
		withBreakpoint: { 'svg-stroke': 'Icon line width' },
		withPrefix: {
			background: {
				groupLabel: 'Background',
				props: {
					backgroundColor: {
						label: 'Background color',
						props: ['background', 'backgroundColor'],
					},
					backgroundGradient: {
						label: 'Background gradient',
						props: ['background', 'backgroundGradient'],
					},
				},
			},
			backgroundHover: {
				groupLabel: 'Background hover',
				props: {
					backgroundColorHover: {
						label: 'Background color hover',
						props: ['backgroundHover', 'backgroundColorHover'],
					},
					backgroundGradientHover: {
						label: 'Background gradient hover',
						props: ['backgroundHover', 'backgroundGradientHover'],
					},
				},
			},
			border: {
				groupLabel: 'Border',
				props: {
					border: 'Border',
					borderWidth: 'Border width',
					borderRadius: 'Border radius',
				},
			},
			borderHover: {
				groupLabel: 'Border hover',
				props: {
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
			withoutPrefix: {
				alignment: 'Alignment',
			},
		},
	},
	canvas: {
		blockSpecific: {
			size: {
				groupLabel: 'Size',
				props: {
					blockFullWidth: 'Full width',
					size: { label: 'Size', type: 'withoutPrefix' },
				},
			},
		},
		withoutPrefix: {
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
			opacity: 'Opacity',
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
			overflow: 'Overflow',
			flex: 'Flexbox',
			zIndex: 'Z-index',
		},
	},
};

export default copyPasteMapping;
