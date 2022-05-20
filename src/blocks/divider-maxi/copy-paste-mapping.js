const copyPasteMapping = {
	settings: {
		withBreakpoint: {
			alignment: {
				groupLabel: 'Alignment',
				props: {
					'line-orientation': 'Line orientation',
					'line-vertical': 'Line vertical position',
					'line-horizontal': 'Line horizontal position',
				},
			},
			divider: {
				groupLabel: 'Line settings',
				props: {
					'divider-border-style': 'Line style',
					'divider-border-': {
						type: 'withPalette',
						label: 'Line colour',
					},
					'divider-size': {
						label: 'Line size',
						props: ['divider-height', 'divider-width'],
					},
					'divider-weight': {
						label: 'Line weight',
						props: [
							'divider-border-top-width',
							'divider-border-top-unit',
							'divider-border-right-width',
							'divider-border-right-unit',
						],
					},
				},
			},
		},
		withPrefix: {
			boxShadow: {
				groupLabel: 'Box shadow',
				props: {
					boxShadow: 'Box shadow',
					boxShadowHover: 'Box shadow hover',
				},
			},
		},
	},
	canvas: {
		blockSpecific: {
			blockFullWidth: 'Block full width',
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
			size: 'Size',
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
			transition: 'Hover transition',
			display: 'Display',
			position: 'Position',
			overflow: 'Overflow',
			flex: 'Flex',
			zIndex: 'Z-index',
		},
	},
};

export default copyPasteMapping;
