const copyPasteMapping = {
	_order: [
		'Callout arrow',
		'Background',
		'Border',
		'Box shadow',
		'Size',
		'Margin/Padding',
	],

	settings: {
		withBreakpoint: {
			blockSpecific: {
				size: {
					groupLabel: 'Size',
					props: {
						blockFullWidth: 'Full width',
						size: { label: 'Size', type: 'withoutPrefix' },
					},
				},
			},
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
