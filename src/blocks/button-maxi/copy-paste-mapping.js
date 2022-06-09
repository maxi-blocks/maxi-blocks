const copyPasteMapping = {
	exclude: ['buttonContent'],
	_order: [
		'Icon',
		'Alignment',
		'Typography',
		'Background',
		'Border',
		'Box shadow',
		'Size',
		'Margin/Padding',
	],

	settings: {
		blockSpecific: {
			buttonContent: 'Button text',
			size: {
				groupLabel: 'Size',
				props: {
					fullWidth: 'Full width',
					size: { label: 'Size', type: 'withPrefix' },
				},
			},
		},
		withoutPrefix: {
			iconGroup: {
				groupLabel: 'Icon',
				props: {
					icon: { label: 'Icon', props: ['icon', 'iconHover'] },
					iconBorder: {
						label: 'Icon border',
						props: [
							'iconBorder',
							'iconBorderWidth',
							'iconBorderRadius',
							'iconBorderHover',
							'iconBorderWidthHover',
							'iconBorderRadiusHover',
						],
					},
					iconBackground: {
						label: 'Icon background',
						props: [
							'iconBackground',
							'iconBackgroundColor',
							'iconBackgroundGradient',
							'iconBackgroundHover',
							'iconBackgroundColorHover',
							'iconBackgroundGradientHover',
						],
					},
					iconPadding: 'Icon padding',
				},
			},
			alignment: {
				groupLabel: 'Alignment',
				props: {
					alignment: 'Alignment',
					textAlignment: 'Text alignment',
				},
			},
			typography: {
				groupLabel: 'Typography',
				props: {
					typography: 'Typography',
					typographyHover: 'Typography hover',
				},
			},
		},
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
			position: 'Position',
			overflow: 'Overflow',
			flex: 'Flexbox',
			zIndex: 'Z-index',
		},
	},
};

export default copyPasteMapping;
