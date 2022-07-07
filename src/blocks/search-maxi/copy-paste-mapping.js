const copyPasteMapping = {
	block: {
		_order: ['Border', 'Box shadow', 'Height/Width', 'Margin/Padding'],

		blockSpecific: {
			size: {
				groupLabel: 'Size',
				props: {
					'full-width': {
						type: 'withBreakpoint',
						label: 'Set block full-width',
					},
					size: { label: 'Size', type: 'withoutPrefix' },
				},
			},
		},
		withoutPrefix: {
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
	button: {
		_order: [
			'Skin',
			'Button',
			'Icon',
			'Close icon',
			'Border',
			'Button background',
			'Margin/Padding',
		],

		blockSpecific: {
			skin: {
				groupLabel: 'Skin',
				props: {
					skin: 'Skin',
					placeholder: 'Placeholder',
				},
			},
			button: {
				groupLabel: 'Button',
				props: {
					searchButtonSkin: 'Skin',
				},
			},
		},
		withoutPrefix: {
			iconGroup: {
				groupLabel: 'Icon',
				props: {
					icon: { label: 'Icon', props: ['icon', 'iconHover'] },
				},
			},
		},
		withPrefix: {
			closeIconGroup: {
				groupLabel: 'Close icon',
				props: {
					icon: { label: 'Icon', props: ['icon', 'iconHover'] },
				},
				prefix: 'close-',
			},
			typography: {
				groupLabel: 'Typography',
				props: {
					typography: 'Typography',
					typographyHover: 'Typography hover',
				},
				prefix: 'search-button-',
			},
			background: {
				groupLabel: 'Button background',
				props: {
					backgroundColor: {
						label: 'Background color',
						props: ['background', 'backgroundColor'],
					},
					backgroundColorHover: {
						label: 'Background color hover',
						props: ['backgroundHover', 'backgroundColorHover'],
					},
				},
				prefix: 'search-button-',
			},
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
				prefix: 'search-button-',
			},
			'margin-padding': {
				groupLabel: 'Margin/Padding',
				props: { margin: 'Margin', padding: 'Padding' },
				prefix: 'search-button-',
			},
		},
	},
	input: {
		_order: ['Typography', 'Border', 'Input background', 'Padding'],

		withPrefix: {
			typography: {
				groupLabel: 'Typography',
				props: {
					typography: 'Typography',
					typographyHover: 'Typography hover',
				},
				prefix: 'search-input-',
			},
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
				prefix: 'search-input-',
			},
			background: {
				groupLabel: 'Input background',
				props: {
					backgroundColor: {
						label: 'Background color',
						props: ['background', 'backgroundColor'],
					},
					backgroundColorHover: {
						label: 'Background color hover',
						props: ['backgroundHover', 'backgroundColorHover'],
					},
				},
				prefix: 'search-input-',
			},
			padding: {
				groupLabel: 'Padding',
				props: { padding: 'Padding' },
				prefix: 'search-input-',
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
			position: 'Position',
			overflow: 'Overflow',
			flex: 'Flexbox',
			zIndex: 'Z-index',
		},
	},
};

export default copyPasteMapping;
