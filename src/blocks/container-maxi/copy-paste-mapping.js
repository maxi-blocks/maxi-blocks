const copyPasteMapping = {
	settings: {
		withBreakpoint: {
			arrow: {
				groupLabel: 'Callout arrow',
				props: {
					'arrow-status': 'Show arrow',
					'arrow-side': 'Arrow side',
					'arrow-position': 'Arrow position',
					'arrow-width': 'Arrow size',
				},
			},
		},
		blockSpecific: {
			topShapeDivider: {
				groupLabel: 'Top shape divider',
				props: {
					'shape-divider-top-status': 'Divider status',
					'shape-divider-top-shape-style': 'Divider style',
					'shape-divider-top-opacity': 'Divider opacity',
					'shape-divider-top-color': {
						label: 'Divider color',
						props: [
							'shape-divider-top-palette-color',
							'shape-divider-top-color',
							'shape-divider-top-palette-status',
						],
					},
					'shape-divider-top-height': 'Divider height',
					'shape-divider-top-height-unit': 'Divider height unit',
					'shape-divider-top-effects-status': 'Divider scroll effect',
				},
			},
			bottomShapeDivider: {
				groupLabel: 'Bottom shape divider',
				props: {
					'shape-divider-bottom-status': 'Divider status',
					'shape-divider-bottom-shape-style': 'Divider style',
					'shape-divider-bottom-opacity': 'Divider opacity',
					'shape-divider-bottom-color': {
						label: 'Divider colour',
						props: [
							'shape-divider-bottom-palette-color',
							'shape-divider-bottom-palette-status',
							'shape-divider-bottom-color',
						],
					},
					'shape-divider-bottom-height': 'Divider height',
					'shape-divider-bottom-height-unit': 'Divider height unit',
					'shape-divider-bottom-effects-status':
						'Divider scroll effect',
				},
			},
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
			scroll: 'Scroll effects',
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
