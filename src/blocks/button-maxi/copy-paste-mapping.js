const copyPasteMapping = {
	exclude: ['buttonContent'],
	settings: {
		blockSpecific: {
			fullWidth: 'Full width',
			buttonContent: 'Button text',
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
						],
					},
					iconBorderHover: {
						label: 'Icon border hover',
						props: [
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
						],
					},
					iconBackgroundHover: {
						label: 'Icon background hover',
						props: [
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
			size: 'Size',
			'margin-padding': {
				groupLabel: 'Margin/Padding',
				props: { margin: 'Margin', padding: 'Padding' },
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
