const copyPasteMapping = {
	settings: {
		withBreakpoint: {
			alignment: {
				groupLabel: 'Alignment',
				props: {
					'line-orientation': 'Line Orientation',
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
					'divider-width': 'Line width',
					'divider-height': 'Line height',
					'divider-border-top-width': 'Horizontal line weight',
					'divider-border-top-unit': 'Horizontal line weight unit',
					'divider-border-right-width': 'Vertical line weight',
					'divider-border-right-unit': 'Vertical line weight unit',
				},
			},
		},
		withPrefix: {
			boxShadow: {
				groupLabel: 'Box Shadow',
				props: {
					boxShadow: 'Box Shadow',
					boxShadowHover: 'Box Shadow Hover',
				},
			},
		},
	},
	canvas: {
		blockSpecific: {
			blockFullWidth: 'Block Full Width',
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
				groupLabel: 'Box Shadow',
				props: {
					boxShadow: 'Box Shadow',
					boxShadowHover: 'Box Shadow Hover',
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
			extraClassName: 'Custom CSS Classes',
			anchorLink: {
				label: 'Anchor',
				value: ['anchorLink', 'linkSettings'],
			},
			relations: 'Interaction',
		},
		withoutPrefix: {
			customCss: 'Custom Css',
			scroll: 'Scroll',
			transform: 'Transform',
			transition: 'Hover Transition',
			display: 'Display',
			position: 'Position',
			overflow: 'Overflow',
			flex: 'Flex',
			zIndex: 'z-Index',
		},
	},
};

export default copyPasteMapping;
